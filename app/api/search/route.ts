import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

const createAdminClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    return createClient(supabaseUrl, supabaseServiceKey);
};

export async function GET(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q")?.trim() || "";

        if (!query) {
            return NextResponse.json({ series: [], videos: [] });
        }

        const supabase = createAdminClient();

        // Split into individual words, build OR filter: name.ilike.%word1%, name.ilike.%word2%, ...
        const words = query.split(/\s+/).filter(Boolean).slice(0, 5); // cap at 5 tokens
        const seriesFilter = words.map(w => `name.ilike.%${w}%`).join(",");
        const videosFilter = words.map(w => `title.ilike.%${w}%`).join(",");

        const [seriesRes, videosRes] = await Promise.all([
            supabase
                .from("series_projects")
                .select("id, name, video_style, status, created_at, platforms")
                .eq("user_id", userId)
                .or(seriesFilter)
                .limit(6),
            supabase
                .from("video_generations")
                .select("id, series_id, title, status, created_at, final_video_url, series_projects(id, name)")
                .eq("user_id", userId)
                .or(videosFilter)
                .limit(6),
        ]);

        return NextResponse.json({
            series: seriesRes.data || [],
            videos: videosRes.data || [],
        });
    } catch (error: unknown) {
        console.error("Search API error:", error);
        const message = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
