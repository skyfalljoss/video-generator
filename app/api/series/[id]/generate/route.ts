import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { inngest } from "@/lib/inngest/client";

import { checkVideoGenerationLimit, consumeVideoToken } from "@/lib/subscription";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { error: "Missing series ID" },
                { status: 400 }
            );
        }

        // --- ENFORCE LIMITS ---
        const limitCheck = await checkVideoGenerationLimit(userId);
        
        if (!limitCheck.canGenerate) {
            return NextResponse.json(
                { error: "You have run out of video generation tokens for today on the Free plan. Please upgrade for unlimited generations." },
                { status: 403 }
            );
        }
        
        // Deduct token (only decreases if not infinite)
        await consumeVideoToken(userId);
        // ----------------------

        // Insert initial processing row so it appears on the dashboard immediately
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(supabaseUrl, supabaseServiceKey, {
            auth: { persistSession: false },
            global: {
                fetch: (url, options) => {
                    return fetch(url, { ...options, cache: "no-store" });
                }
            }
        });

        const { data: videoRow, error: insertError } = await supabase
            .from("video_generations")
            .insert({
                series_id: id,
                user_id: userId,
                status: "processing",
                title: "Generating Video..." // Temporary placeholder
            })
            .select()
            .single();

        if (insertError) {
            console.error("Failed to create initial video row:", insertError);
            return NextResponse.json(
                { error: "Failed to initialize generation" },
                { status: 500 }
            );
        }

        // Trigger the Inngest event
        await inngest.send({
            name: "video/generate",
            data: {
                seriesId: id,
                videoId: videoRow.id // Pass the specific video ID to Inngest
            },
        });

        return NextResponse.json({ 
             success: true, 
             message: "Generation started",
             videoId: videoRow.id 
        });

    } catch (error: unknown) {
        console.error("Generate API error:", error);
         return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
