import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const userId = url.searchParams.get("state");
    const error = url.searchParams.get("error");
    const errorDescription = url.searchParams.get("error_description");

    if (error) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=${errorDescription || error}`);
    }

    if (!code || !userId) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=MissingCodeOrState`);
    }

    const { TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, NEXT_PUBLIC_APP_URL } = process.env;
    const redirectUri = `${NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/tiktok/callback`;

    try {
        // Exchange code for access token according to TikTok API v2
        const tokenRes = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Cache-Control": "no-cache",
            },
            body: new URLSearchParams({
                client_key: TIKTOK_CLIENT_KEY!,
                client_secret: TIKTOK_CLIENT_SECRET!,
                code,
                grant_type: "authorization_code",
                redirect_uri: redirectUri,
            }),
        });

        const tokenData = await tokenRes.json();

        if (tokenData.error || !tokenData.access_token) {
            console.error("TikTok token error:", tokenData);
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=TokenExchangeFailed`);
        }

        // Fetch basic user info
        const userRes = await fetch("https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${tokenData.access_token}`,
            },
        });

        const userData = await userRes.json();
        const username = userData.data?.user?.display_name || "TikTok User";

        // Save tokens to Supabase
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const expiresAt = tokenData.expires_in 
            ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString() 
            : null;

        const { error: dbError } = await supabase
            .from("social_connections")
            .upsert({
                user_id: userId,
                platform: "tiktok",
                username: username,
                access_token: tokenData.access_token,
                refresh_token: tokenData.refresh_token,
                expires_at: expiresAt,
                updated_at: new Date().toISOString()
            }, {
                onConflict: "user_id, platform"
            });

        if (dbError) {
            console.error("Supabase Error saving TikTok tokens:", dbError);
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=DatabaseError`);
        }

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?success=tiktok`);
    } catch (err) {
        console.error("Error exchanging TikTok code:", err);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=CallbackError`);
    }
}
