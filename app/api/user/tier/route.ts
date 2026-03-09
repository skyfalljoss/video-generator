import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserSubscriptionTier, PLAN_LIMITS } from "@/lib/subscription";

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const tier = await getUserSubscriptionTier();
        const limits = PLAN_LIMITS[tier];

        return NextResponse.json({
            tier,
            tokens: limits.daily_video_tokens === Infinity ? null : limits.daily_video_tokens,
            seriesLimit: limits.series === Infinity ? null : limits.series,
        });

    } catch (error: unknown) {
        console.error("Tier API error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
