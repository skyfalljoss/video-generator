
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

// Use Service Role Key for Admin Access - bypasses RLS
const createAdminClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    return createClient(supabaseUrl, supabaseServiceKey);
}

export async function DELETE(
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

        const supabase = createAdminClient();

        // Security Check: Verify user owns the series before deleting
        // We use .single() because ID should be unique.
        // If not found or user_id doesn't match, this will fail or return null.
        const { data: existingSeries, error: fetchError } = await supabase
            .from("series_projects")
            .select("user_id")
            .eq("id", id)
            .single();

        if (fetchError || !existingSeries) {
             return NextResponse.json(
                { error: "Series not found" },
                { status: 404 }
            );
        }

        if (existingSeries.user_id !== userId) {
             return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            );
        }

        // Proceed to delete
        const { error: deleteError } = await supabase
            .from("series_projects")
            .delete()
            .eq("id", id);

        if (deleteError) {
            console.error("Delete error:", deleteError);
            return NextResponse.json(
                { error: "Failed to delete series" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error: unknown) {
        console.error("Delete API fatal error:", error);
        const message = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}

export async function PATCH(
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
        const body = await req.json();
        
        // Remove id and created_at/user_id from update payload if present
        const { id: _, created_at, user_id, ...updates } = body;

        if (!id) {
             return NextResponse.json(
                { error: "Missing series ID" },
                { status: 400 }
            );
        }

        const supabase = createAdminClient();

        // 1. Verify ownership
        const { data: existingSeries, error: fetchError } = await supabase
            .from("series_projects")
            .select("user_id")
            .eq("id", id)
            .single();

        if (fetchError || !existingSeries) {
             return NextResponse.json(
                { error: "Series not found" },
                { status: 404 }
            );
        }

        if (existingSeries.user_id !== userId) {
             return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            );
        }

        // 2. Prepare update object (map frontend camelCase to DB snake_case if needed)
        // Since we are reusing the wizard, the body keys match the WizardData type
        // We need to map them to the DB columns.
        const dbUpdates: any = {};
        
        if (updates.status) dbUpdates.status = updates.status;
        if (updates.name) dbUpdates.name = updates.name;
        if (updates.format) dbUpdates.format = updates.format;
        if (updates.niche) dbUpdates.niche = updates.niche;
        if (updates.customTopic) dbUpdates.custom_topic = updates.customTopic;
        if (updates.customPrompt) dbUpdates.custom_prompt = updates.customPrompt;
        if (updates.aspectRatio) dbUpdates.aspect_ratio = updates.aspectRatio;
        if (updates.language) dbUpdates.language = updates.language;
        if (updates.voice) dbUpdates.voice = updates.voice;
        if (updates.music) dbUpdates.music = updates.music;
        if (updates.videoStyle) dbUpdates.video_style = updates.videoStyle;
        if (updates.captionStyle) dbUpdates.caption_style = updates.captionStyle;
        if (updates.fontWeight) dbUpdates.font_weight = updates.fontWeight;
        if (updates.duration) dbUpdates.duration = updates.duration;
        if (updates.platforms) dbUpdates.platforms = updates.platforms;
        if (updates.publishTime) dbUpdates.publish_time = updates.publishTime;


        // 3. Update data
        const { error: updateError } = await supabase
            .from("series_projects")
            .update(dbUpdates)
            .eq("id", id);

        if (updateError) {
            console.error("Update error:", updateError);
             return NextResponse.json(
                { error: "Failed to update series" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error: unknown) {
        console.error("PATCH API error:", error);
         return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
