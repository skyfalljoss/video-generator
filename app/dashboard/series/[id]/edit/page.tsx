
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { CreateSeriesWizard, WizardData } from "@/components/dashboard/wizard/CreateSeriesWizard";
import { redirect } from "next/navigation";

export default async function EditSeriesPage({ params }: { params: Promise<{ id: string }> }) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const { id } = await params;

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: series, error } = await supabase
        .from("series_projects")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !series) {
        console.error("Error fetching series for edit:", error);
        redirect("/dashboard");
    }

    if (series.user_id !== userId) {
        redirect("/dashboard");
    }

    // Transform data
    const initialData: Partial<WizardData> = {
        format: series.format as any,
        niche: series.niche,
        customTopic: series.custom_topic || "",
        customPrompt: series.custom_prompt || "",
        language: series.language,
        voice: series.voice,
        music: series.music || [],
        videoStyle: series.video_style,
        captionStyle: series.caption_style,
        aspectRatio: series.aspect_ratio,
        fontWeight: series.font_weight,
        name: series.name,
        duration: series.duration,
        platforms: series.platforms || [],
        publishTime: series.publish_time,
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-zinc-50 dark:bg-zinc-950">
            <CreateSeriesWizard initialData={initialData} mode="edit" seriesId={id} />
        </div>
    );
}
