import { auth } from "@clerk/nextjs/server";
import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET() {
    const { userId } = await auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.YOUTUBE_CLIENT_ID,
        process.env.YOUTUBE_CLIENT_SECRET,
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/youtube/callback`
    );

    // Define the scopes we need
    const scopes = [
        "https://www.googleapis.com/auth/youtube.upload",
        "https://www.googleapis.com/auth/youtube.readonly"
    ];

    const authorizeUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
        prompt: "consent", // Force to get refresh token
        state: userId, // Pass user ID to associate later
    });

    return NextResponse.redirect(authorizeUrl);
}
