import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    const { userId } = await auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { NEXT_PUBLIC_APP_URL, INSTAGRAM_CLIENT_ID } = process.env;
    const redirectUri = `${NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/instagram/callback`;
    
    // Using Facebook Login for Business to access the Instagram Graph API
    // This is required to actually publish videos (Basic Display API cannot publish).
    const scopes = "instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement";

    const authorizeUrl = `https://www.facebook.com/v19.0/dialog/oauth` +
        `?client_id=${INSTAGRAM_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=${scopes}` +
        `&response_type=code` +
        `&state=${userId}`;

    return NextResponse.redirect(authorizeUrl);
}
