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

    const { INSTAGRAM_CLIENT_ID, INSTAGRAM_CLIENT_SECRET, NEXT_PUBLIC_APP_URL } = process.env;
    const redirectUri = `${NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/instagram/callback`;

    try {
        // 1. Exchange code for short-lived access token via Facebook Graph API
        const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token` +
            `?client_id=${INSTAGRAM_CLIENT_ID}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&client_secret=${INSTAGRAM_CLIENT_SECRET}` +
            `&code=${code}`;

        const tokenRes = await fetch(tokenUrl);
        const tokenData = await tokenRes.json();

        if (tokenData.error || !tokenData.access_token) {
            console.error("Facebook short-lived token error:", tokenData);
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=TokenExchangeFailed`);
        }

        const shortLivedToken = tokenData.access_token;

        // 2. Exchange short-lived token for long-lived user token
        const longLivedUrl = `https://graph.facebook.com/v19.0/oauth/access_token` +
            `?grant_type=fb_exchange_token` +
            `&client_id=${INSTAGRAM_CLIENT_ID}` +
            `&client_secret=${INSTAGRAM_CLIENT_SECRET}` +
            `&fb_exchange_token=${shortLivedToken}`;

        const longLivedRes = await fetch(longLivedUrl);
        const longLivedData = await longLivedRes.json();
        
        const finalAccessToken = longLivedData.access_token || shortLivedToken;
        // Facebook long-lived tokens typically expire in 60 days
        const expiresIn = longLivedData.expires_in || 5184000; 

        // 3. Fetch user profile to get Facebook name (fallback)
        const userRes = await fetch(`https://graph.facebook.com/v19.0/me?access_token=${finalAccessToken}`);
        const userData = await userRes.json();
        let displayUsername = userData.name || `fb_user_${userData.id}`;

        // 4. Try to find connected Instagram Business Account
        const accountsRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${finalAccessToken}`);
        const accountsData = await accountsRes.json();
        
        if (accountsData.data && accountsData.data.length > 0) {
            for (const page of accountsData.data) {
                const igRes = await fetch(`https://graph.facebook.com/v19.0/${page.id}?fields=instagram_business_account{username}&access_token=${finalAccessToken}`);
                const igData = await igRes.json();
                
                if (igData.instagram_business_account?.username) {
                    displayUsername = igData.instagram_business_account.username;
                    break;
                }
            }
        }

        // 5. Save to Supabase
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

        const { error: dbError } = await supabase
            .from("social_connections")
            .upsert({
                user_id: userId,
                platform: "instagram",
                username: displayUsername,
                access_token: finalAccessToken,
                refresh_token: null, // Facebook uses long-lived tokens rather than refresh tokens
                expires_at: expiresAt,
                updated_at: new Date().toISOString()
            }, {
                onConflict: "user_id, platform"
            });

        // Also optionally save Facebook connection just in case they want to publish there
        await supabase
            .from("social_connections")
            .upsert({
                user_id: userId,
                platform: "facebook",
                username: userData.name || "Facebook Page",
                access_token: finalAccessToken,
                refresh_token: null,
                expires_at: expiresAt,
                updated_at: new Date().toISOString()
            }, {
                onConflict: "user_id, platform"
            });

        if (dbError) {
            console.error("Supabase Error saving IG/FB tokens:", dbError);
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=DatabaseError`);
        }

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?success=instagram`);
    } catch (err) {
        console.error("Error exchanging Meta code:", err);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=CallbackError`);
    }
}
