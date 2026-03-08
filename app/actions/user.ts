"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export type SocialConnection = {
    id: string;
    platform: "youtube" | "instagram" | "tiktok";
    username: string | null;
    created_at: string;
};

export async function deleteAccountAction(): Promise<{ success: boolean; error?: string }> {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return { success: false, error: "Unauthorized" };
        }

        const client = await clerkClient();
        await client.users.deleteUser(userId);

        // the Supabase db has cascading deletes? Actually our schema doesn't have foreign keys for Clerk users.
        // It's a good idea to tidy up Supabase records, but for now we trust the user is deleted.
        // Option: we could delete their projects and videos in Supabase too.
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        
        await supabase.from("series_projects").delete().eq("user_id", userId);
        await supabase.from("video_generations").delete().eq("user_id", userId);
        await supabase.from("social_connections").delete().eq("user_id", userId);

        return { success: true };
    } catch (error: any) {
        console.error("Error deleting account:", error);
        return { success: false, error: error.message || "Failed to delete account" };
    }
}

export async function getSocialConnectionsAction(): Promise<SocialConnection[]> {
    const { userId } = await auth();

    if (!userId) {
        return [];
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
        .from("social_connections")
        .select("id, platform, username, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching social connections:", error);
        return [];
    }

    return (data as SocialConnection[]) || [];
}

export async function connectSocialAction(platform: "youtube" | "instagram" | "tiktok"): Promise<{ success: boolean; error?: string }> {
    try {
        const { userId } = await auth();

        if (!userId) {
            return { success: false, error: "Unauthorized" };
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // For now, this is a mock implementation. We will insert a dummy connection.
        // In reality, this would initiate an OAuth flow, or save the token returned from OAuth.
        
        const dummyUsername = `${platform}_user_${Math.floor(Math.random() * 1000)}`;

        const { error } = await supabase
            .from("social_connections")
            .upsert({
                user_id: userId,
                platform: platform,
                username: dummyUsername,
                access_token: "mock_access_token",
                updated_at: new Date().toISOString()
            }, {
                onConflict: "user_id, platform"
            });

        if (error) {
            console.error(`Error connecting to ${platform}:`, error);
            return { success: false, error: "Failed to connect account" };
        }

        return { success: true };
    } catch (error: any) {
        console.error(`Exception connecting to ${platform}:`, error);
        return { success: false, error: error.message || "Something went wrong" };
    }
}

export async function disconnectSocialAction(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const { userId } = await auth();

        if (!userId) {
            return { success: false, error: "Unauthorized" };
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const { error } = await supabase
            .from("social_connections")
            .delete()
            .eq("id", id)
            .eq("user_id", userId);

        if (error) {
            console.error("Error disconnecting social account:", error);
            return { success: false, error: "Failed to disconnect account" };
        }

        return { success: true };
    } catch (error: any) {
        console.error("Exception disconnecting social account:", error);
        return { success: false, error: error.message || "Something went wrong" };
    }
}
