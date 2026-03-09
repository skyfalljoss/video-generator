import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { VideoList } from "@/components/dashboard/VideoList";

export const metadata = {
    title: "Generated Videos | V Gen",
    description: "View and manage your AI-generated videos.",
};

export default async function VideosPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const { getVideos } = await import("@/app/actions/video");
    const videos = await getVideos();

    return (
        <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Generated Videos</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">
                        View and manage all your generated content.
                    </p>
                </div>
            </div>

            <div className="mt-8">
                <Suspense fallback={null}>
                    <VideoList initialVideos={videos} />
                </Suspense>
            </div>
        </div>
    );
}

