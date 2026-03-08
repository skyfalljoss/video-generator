"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getVideos, deleteVideo } from "@/app/actions/video";
import { VideoCard } from "./VideoCard";
import type { VideoGeneration } from "./VideoCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Search, Tv } from "lucide-react";

export type { VideoGeneration };

export function VideoList({ initialVideos }: { initialVideos: VideoGeneration[] }) {
    const [videos, setVideos] = useState<VideoGeneration[]>(initialVideos);
    const [selectedSeries, setSelectedSeries] = useState<string>("all");
    const searchParams = useSearchParams();
    const router = useRouter();

    // URL-driven filters
    const urlQuery = searchParams.get("q")?.trim() ?? "";
    const urlSeriesId = searchParams.get("series")?.trim() ?? "";

    // Poll for updates if any video is still processing
    useEffect(() => {
        const hasProcessing = videos.some(v => v.status === "processing");
        if (!hasProcessing) return;

        const interval = setInterval(async () => {
             const updatedVideos = await getVideos();
             setVideos(updatedVideos);
        }, 5000);

        return () => clearInterval(interval);
    }, [videos]);

    const handleDelete = async (id: string) => {
        setVideos(prev => prev.filter(v => v.id !== id));
        const success = await deleteVideo(id);
        if (!success) {
            const updatedVideos = await getVideos();
            setVideos(updatedVideos);
        }
    };

    // Clear the text search filter from the URL
    const handleClearFilter = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("q");
        const newUrl = params.size > 0 ? `?${params.toString()}` : "/dashboard/videos";
        router.replace(newUrl);
    }, [searchParams, router]);

    // Clear the series filter from the URL
    const handleClearSeriesFilter = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("series");
        const newUrl = params.size > 0 ? `?${params.toString()}` : "/dashboard/videos";
        router.replace(newUrl);
    }, [searchParams, router]);

    const uniqueSeries = Array.from(new Set(videos.map(v => v.series_id))).map(id => {
        const video = videos.find(v => v.series_id === id);
        return {
            id,
            name: video?.series_projects?.name || "Unknown Series"
        };
    });

    // 1. Apply ?series= URL filter (from "View Video" button on SeriesCard)
    const seriesFiltered = urlSeriesId
        ? videos.filter(v => v.series_id === urlSeriesId)
        : videos;

    // Name of the filtered series (for the banner)
    const filteredSeriesName = urlSeriesId
        ? (uniqueSeries.find(s => s.id === urlSeriesId)?.name ?? "Selected Series")
        : "";

    // 2. Apply ?q= text search on top of series filter
    const searchFiltered = urlQuery
        ? (() => {
              const words = urlQuery.toLowerCase().split(/\s+/).filter(Boolean);
              return seriesFiltered.filter(v => {
                  const haystack = [
                      v.title || "",
                      v.series_projects?.name || "",
                  ].join(" ").toLowerCase();
                  return words.every(w => haystack.includes(w));
              });
          })()
        : seriesFiltered;

    // 3. Apply series dropdown filter (only when no URL series filter is active)
    const filteredVideos = (!urlSeriesId && selectedSeries !== "all")
        ? searchFiltered.filter(v => v.series_id === selectedSeries)
        : searchFiltered;

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
        <div className="space-y-6">
            {/* ── Active series filter banner (from View Video button) ── */}
            {urlSeriesId && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 w-fit text-sm text-violet-700 dark:text-violet-300 font-medium shadow-sm">
                    <Tv className="h-3.5 w-3.5 shrink-0" />
                    <span>
                        Series:{" "}
                        <span className="font-bold">{filteredSeriesName}</span>
                        {" "}
                        <span className="font-normal text-violet-500">({filteredVideos.length} video{filteredVideos.length !== 1 ? "s" : ""})</span>
                    </span>
                    <button
                        onClick={handleClearSeriesFilter}
                        className="ml-1 p-0.5 rounded-full hover:bg-violet-200 dark:hover:bg-violet-800 transition-colors"
                        title="Show all series"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            )}

            {/* ── Active text search filter banner ── */}
            {urlQuery && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 w-fit text-sm text-indigo-700 dark:text-indigo-300 font-medium shadow-sm">
                    <Search className="h-3.5 w-3.5 shrink-0" />
                    <span>
                        Showing results for{" "}
                        <span className="font-bold">&ldquo;{urlQuery}&rdquo;</span>
                        {" "}
                        <span className="font-normal text-indigo-500">({filteredVideos.length} video{filteredVideos.length !== 1 ? "s" : ""})</span>
                    </span>
                    <button
                        onClick={handleClearFilter}
                        className="ml-1 p-0.5 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                        title="Clear filter"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            )}

            {/* ── Series dropdown filter (hidden when URL filter active with results) ── */}
            {uniqueSeries.length > 0 && !urlQuery && (
                <div className="flex justify-end mb-6">
                    <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full py-1.5 px-2 pr-1.5 shadow-sm transition-all hover:shadow-md max-w-sm w-full sm:w-auto">
                        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pl-3 hidden sm:inline-block">
                            Filter
                        </span>
                        <Select value={selectedSeries} onValueChange={setSelectedSeries}>
                            <SelectTrigger className="w-full sm:w-[220px] h-8 bg-zinc-50 dark:bg-zinc-950 border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 rounded-full text-sm font-medium focus:ring-0 focus:ring-offset-0 shadow-none transition-colors">
                                <SelectValue placeholder="All Series" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px] rounded-xl shadow-lg border-zinc-200 dark:border-zinc-800">
                                <SelectItem value="all" className="font-medium rounded-lg mt-1">All Series</SelectItem>
                                {uniqueSeries.map(series => (
                                    <SelectItem key={series.id} value={series.id} className="rounded-lg">
                                        {series.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}
            
            {/* ── Video grid ── */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {filteredVideos.length > 0 ? (
                    filteredVideos.map((video) => (
                        <VideoCard key={video.id} video={video} onDelete={handleDelete} />
                    ))
                ) : (
                    <div className="col-span-full py-16 text-center text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/20 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
                        {urlQuery
                            ? `No videos match "${urlQuery}". Try a different search term.`
                            : "No videos found for this series."
                        }
                    </div>
                )}
            </div>
        </div>
    );
}
