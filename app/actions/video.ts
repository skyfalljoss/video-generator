"use server";

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { VideoGeneration } from "@/components/dashboard/VideoList";

export async function getVideos(): Promise<VideoGeneration[]> {
    const { userId } = await auth();

    if (!userId) {
        return [];
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: videos, error } = await supabase
        .from("video_generations")
        .select(`
            *,
            series_projects (
                id,
                name,
                format,
                niche,
                custom_topic,
                duration
            )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching videos:", error);
        return [];
    }

    return (videos as VideoGeneration[]) || [];
}

export async function deleteVideo(videoId: string): Promise<boolean> {
    const { userId } = await auth();

    if (!userId) {
        return false;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabase
        .from("video_generations")
        .delete()
        .eq("id", videoId)
        .eq("user_id", userId);

    if (error) {
        console.error("Error deleting video:", error);
        return false;
    }

    return true;
}
