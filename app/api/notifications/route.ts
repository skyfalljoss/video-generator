import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

// Admin client for reading notifications bypassing RLS
const createAdminClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false },
        global: {
            fetch: (url, options) => {
                return fetch(url, { ...options, cache: "no-store" });
            }
        }
    });
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();

    // Fetch the 10 most recent video generations for the user
    const { data: notifications, error } = await supabase
      .from("video_generations")
      .select("id, title, status, error_message, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
        console.error("Error fetching notifications:", JSON.stringify(error));
        return NextResponse.json({ error: "Failed to fetch notifications", detail: error.message }, { status: 500 });
    }

    // Expose created_at as updated_at so the frontend can use it for unread logic
    const shaped = (notifications || []).map(n => ({
        ...n,
        updated_at: n.created_at,
    }));

    return NextResponse.json({ notifications: shaped }, {
        headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
        }
    });
  } catch (error) {
    console.error("Error in /api/notifications GET route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
