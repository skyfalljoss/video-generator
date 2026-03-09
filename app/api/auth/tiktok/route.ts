import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    const { userId } = await auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { NEXT_PUBLIC_APP_URL, TIKTOK_CLIENT_KEY } = process.env;
    const redirectUri = `${NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/tiktok/callback`;
    
    // Scopes needed for publishing and basic info
    const scopes = "user.info.basic,video.upload";

    // TikTok Authorization URL
    const authorizeUrl = `https://www.tiktok.com/v2/auth/authorize/` +
        `?client_key=${TIKTOK_CLIENT_KEY}` +
        `&response_type=code` +
        `&scope=${scopes}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&state=${userId}`; // Pass user ID to associate later

    return NextResponse.redirect(authorizeUrl);
}
