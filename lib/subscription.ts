import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

// Plan limits definition
export const PLAN_LIMITS = {
    free: {
        series: 1,
        daily_video_tokens: 5,
        allowed_platforms: ["youtube", "email"]
    },
    basic: {
        series: 3,
        daily_video_tokens: Infinity,
        allowed_platforms: ["youtube", "email"]
    },
    unlimited: {
        series: Infinity,
        daily_video_tokens: Infinity,
        allowed_platforms: ["youtube", "email", "tiktok", "instagram", "facebook"]
    }
};

export type PlanTier = keyof typeof PLAN_LIMITS;

// Initialize admin client (still needed for counting series and tracking free-tier tokens)
const createAdminClient = () => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false } }
    );
};

/**
 * Get the user's current subscription tier directly from Clerk.
 * Uses auth().has({ plan: 'slug' }) — no Supabase, no webhooks needed.
 * Plan slugs must match what is configured in the Clerk Dashboard.
 */
export async function getUserSubscriptionTier(): Promise<PlanTier> {
    const { has } = await auth();

    if (has({ plan: "unlimited" })) return "unlimited";
    if (has({ plan: "basic" })) return "basic";
    return "free";
}

/**
 * Check if the user can create another series based on their Clerk plan.
 */
export async function checkSeriesLimit(userId: string) {
    const tier = await getUserSubscriptionTier();
    const limit = PLAN_LIMITS[tier].series;

    if (limit === Infinity) {
        return { canCreate: true, tier };
    }

    const supabase = createAdminClient();
    const { count, error } = await supabase
        .from("series_projects")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

    if (error) {
        console.error("Error checking series count:", error);
        return { canCreate: false, error: "Database error", tier };
    }

    const currentCount = count || 0;

    return {
        canCreate: currentCount < limit,
        currentCount,
        limit,
        tier
    };
}

/**
 * Check if the user can generate a video based on their Clerk plan.
 * Unlimited / Basic plans always return true.
 * Free plan checks the remaining daily token count in Supabase.
 */
export async function checkVideoGenerationLimit(userId: string) {
    const tier = await getUserSubscriptionTier();

    // Unlimited and Basic have no video generation limits
    if (PLAN_LIMITS[tier].daily_video_tokens === Infinity) {
        return { canGenerate: true, tier };
    }

    // Free tier: check remaining daily tokens stored in Supabase
    const supabase = createAdminClient();
    const { data: user, error } = await supabase
        .from("users")
        .select("video_tokens, token_reset_date")
        .eq("id", userId)
        .single();

    if (error || !user) {
        // If no user row exists yet, allow generation (first time use)
        return { canGenerate: true, tier };
    }

    let tokens: number = user.video_tokens ?? PLAN_LIMITS.free.daily_video_tokens;
    const resetDate = user.token_reset_date ? new Date(user.token_reset_date) : new Date(0);
    const now = new Date();
    const hoursSinceReset = (now.getTime() - resetDate.getTime()) / (1000 * 60 * 60);

    // Reset tokens if 24 hours have elapsed
    if (hoursSinceReset >= 24) {
        tokens = PLAN_LIMITS.free.daily_video_tokens;
        supabase.from("users").update({
            video_tokens: tokens,
            token_reset_date: now.toISOString()
        }).eq("id", userId).then();
    }

    return { canGenerate: tokens > 0, tier, tokens };
}

/**
 * Consume one daily video token for Free tier users.
 * No-op for Basic / Unlimited.
 */
export async function consumeVideoToken(userId: string) {
    const tier = await getUserSubscriptionTier();

    if (PLAN_LIMITS[tier].daily_video_tokens === Infinity) {
        return true; // No consumption needed
    }

    const supabase = createAdminClient();
    const { data: user } = await supabase
        .from("users")
        .select("video_tokens")
        .eq("id", userId)
        .single();

    const currentTokens = user?.video_tokens ?? PLAN_LIMITS.free.daily_video_tokens;

    if (currentTokens > 0) {
        await supabase.from("users").update({
            video_tokens: currentTokens - 1
        }).eq("id", userId);
        return true;
    }

    return false;
}
