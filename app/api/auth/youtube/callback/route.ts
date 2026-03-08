import { NextResponse } from "next/server";
import { google } from "googleapis";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const userId = url.searchParams.get("state"); // User ID we passed earlier
    const error = url.searchParams.get("error");

    if (error) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=${error}`);
    }

    if (!code || !userId) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=MissingCodeOrState`);
    }

    try {
        const oauth2Client = new google.auth.OAuth2(
            process.env.YOUTUBE_CLIENT_ID,
            process.env.YOUTUBE_CLIENT_SECRET,
            `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/youtube/callback`
        );

        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Fetch basic YouTube channel info to save username
        const youtube = google.youtube("v3");
        const channelRes = await youtube.channels.list({
            auth: oauth2Client,
            part: ["snippet"],
            mine: true
        });

        const channelTitle = channelRes.data.items?.[0]?.snippet?.title || "YouTube Channel";

        // Save tokens to Supabase
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const expiresAt = tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null;

        // Fetch existing connection to preserve refresh token if Google doesn't send a new one
        const { data: existingConn } = await supabase
            .from("social_connections")
            .select("refresh_token")
            .eq("user_id", userId)
            .eq("platform", "youtube")
            .single();

        const refreshTokenToSave = tokens.refresh_token || existingConn?.refresh_token;

        const { error: dbError } = await supabase
            .from("social_connections")
            .upsert({
                user_id: userId,
                platform: "youtube",
                username: channelTitle,
                access_token: tokens.access_token,
                refresh_token: refreshTokenToSave, // Preserve if not provided
                expires_at: expiresAt,
                updated_at: new Date().toISOString()
            }, {
                onConflict: "user_id, platform"
            });

        if (dbError) {
            console.error("Supabase Error saving YouTube tokens:", dbError);
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=DatabaseError`);
        }

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?success=youtube`);
    } catch (err) {
        console.error("Error exchanging YouTube code:", err);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=CallbackError`);
    }
}
