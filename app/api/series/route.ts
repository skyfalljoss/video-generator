
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";
// Use Service Role Key for Admin Access - bypasses RLS for insertion
// This removes the need for Clerk JWT templates for this specific write operation
const createAdminClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    return createClient(supabaseUrl, supabaseServiceKey);
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Use admin client to insert data on behalf of the user
        const supabase = createAdminClient();
        const data = await req.json();

        if (!data.name || !data.format) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const { error } = await supabase.from("series_projects").insert({
            user_id: userId,
            format: data.format,
            niche: data.niche || null,
            custom_topic: data.customTopic || null,
            custom_prompt: data.customPrompt || null,
            aspect_ratio: data.aspectRatio || "9:16",
            
            language: data.language,
            voice: data.voice || null,
            
            music: data.music || [],
            
            video_style: data.videoStyle || null,
            caption_style: data.captionStyle || null,
            font_weight: data.fontWeight || "bold",
            
            name: data.name,
            duration: data.duration,
            platforms: data.platforms || [],
            publish_time: data.publishTime
        });

        if (error) {
            console.error("Supabase insert error:", error);
            return NextResponse.json(
                { error: error.message || "Failed to save series" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error: unknown) {
        console.error("Series API fatal error:", error);
        const message = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
