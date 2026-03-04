"use client";

import { useState, useEffect } from "react";
import { getVideos, deleteVideo } from "@/app/actions/video";
import { VideoCard } from "./VideoCard";
import type { VideoGeneration } from "./VideoCard";

export type { VideoGeneration };

export function VideoList({ initialVideos }: { initialVideos: VideoGeneration[] }) {
    const [videos, setVideos] = useState<VideoGeneration[]>(initialVideos);

    // Poll for updates if any video is still processing
    useEffect(() => {
        const hasProcessing = videos.some(v => v.status === "processing");
        if (!hasProcessing) return;

        const interval = setInterval(async () => {
             const updatedVideos = await getVideos();
             setVideos(updatedVideos);
        }, 5000); // Check every 5 seconds

        return () => clearInterval(interval);
    }, [videos]);

    const handleDelete = async (id: string) => {
        // Optimistically remove from UI
        setVideos(prev => prev.filter(v => v.id !== id));
        
        const success = await deleteVideo(id);
        if (!success) {
            // Revert if failed
            const updatedVideos = await getVideos();
            setVideos(updatedVideos);
        }
    };

    if (!videos || videos.length === 0) {
        return (
            <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
                <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">No videos generated yet</h3>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                    Go to your Series library and click &quot;Generate&quot; on a series to create your first video.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {videos.map((video) => (
                <VideoCard key={video.id} video={video} onDelete={handleDelete} />
            ))}
        </div>
    );
}
