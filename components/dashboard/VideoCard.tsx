import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock, PlayCircle, Download } from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


export interface VideoGeneration {
    id: string;
    series_id: string;
    title: string | null;
    status: string;
    created_at: string;
    image_urls: string[] | null;
    final_video_url: string | null;
    error_message: string | null;
    series_projects?: {
        id: string;
        name: string | null;
        format: string;
        niche: string | null;
        custom_topic: string | null;
        duration: string | null;
    };
}

export function VideoCard({ video, onDelete }: { video: VideoGeneration, onDelete?: (id: string) => void }) {
    const isProcessing = video.status === "processing";
    const isFailed = video.status === "failed";
    const thumbnail = video.image_urls?.[0] || (isFailed ? "/placeholder-error.jpg" : "/placeholder-image.jpg"); 
    
    // Extract metadata
    const duration = video.series_projects?.duration || "Unknown length";
    const format = video.series_projects?.format === "custom" 
        ? "Custom Story" 
        : (video.series_projects?.format || "Unknown Format").replace("_", " ");
    const nicheDetail = video.series_projects?.format === "custom" 
        ? video.series_projects.custom_topic 
        : video.series_projects?.niche;
    
    return (
        <Card className="overflow-hidden group flex flex-col hover:shadow-lg transition-all duration-300 border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-xl">
            {/* Thumbnail Area */}
            <div className="relative aspect-[4/5] w-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                {isProcessing ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/10 dark:bg-white/5 backdrop-blur-sm z-10">
                        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mb-3"></div>
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Generating...</span>
                    </div>
                ) : isFailed ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/10 dark:bg-red-900/20 backdrop-blur-sm z-10 px-4 text-center">
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center mb-2">
                            <span className="text-red-600 dark:text-red-400 font-bold">!</span>
                        </div>
                        <span className="text-xs font-medium text-red-600 dark:text-red-400 line-clamp-3">
                            {video.error_message || "Generation failed"}
                        </span>
                    </div>
                ) : (
                    <Image
                        src={thumbnail}
                        alt={video.title || "Generated Video thumbnail"}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority
                    />
                )}
                
                {/* Play overlay on hover (only if finished) */}
                {!isProcessing && !isFailed && video.final_video_url && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer z-30">
                                <PlayCircle className="w-12 h-12 text-white drop-shadow-lg" />
                            </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-black border-zinc-800">
                            <DialogHeader className="absolute top-0 z-50 w-full p-4 bg-gradient-to-b from-black/80 to-transparent">
                                <DialogTitle className="text-white drop-shadow-md pr-8">{video.title || "Generated Video"}</DialogTitle>
                            </DialogHeader>
                            <div className="relative w-full aspect-[9/16] max-h-[80vh] bg-black mt-0 flex items-center justify-center">
                                <video 
                                    src={video.final_video_url} 
                                    controls 
                                    autoPlay 
                                    className="w-full h-full object-contain"
                                    controlsList="nodownload"
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
                
                {/* Status Badge & Top Actions */}
                <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-40">
                    <Badge variant="secondary" className={`shadow-sm backdrop-blur-md w-fit ${
                        isProcessing ? 'bg-amber-100/90 text-amber-700 dark:bg-amber-900/60 dark:text-amber-400' : 
                        isFailed ? 'bg-red-100/90 text-red-700 dark:bg-red-900/60 dark:text-red-400' :
                        'bg-emerald-100/90 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-400'
                    }`}>
                        {isProcessing ? "Processing" : isFailed ? "Failed" : "Completed"}
                    </Badge>
                    
                    {!isProcessing && !isFailed && video.final_video_url && (
                        <a 
                            href={video.final_video_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            download
                            className="p-1.5 rounded-full bg-black/40 hover:bg-indigo-600 text-white backdrop-blur transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center"
                            title="Download Video"
                        >
                            <Download className="w-3.5 h-3.5" />
                        </a>
                    )}
                </div>

                {/* Bottom Badges & Actions */}
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end z-40">
                    {onDelete && (
                        <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(video.id); }}
                            className="p-1.5 rounded-full bg-black/40 hover:bg-red-500/80 text-white backdrop-blur transition-colors opacity-0 group-hover:opacity-100"
                            title="Delete Video"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                    )}
                    <div className="px-2 py-1 rounded bg-black/70 backdrop-blur text-white text-[10px] font-semibold tracking-wide ml-auto">
                        {duration}
                    </div>
                </div>
            </div>

            <CardHeader className="p-3 pb-1">
                {video.series_projects?.name && (
                    <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
                        {video.series_projects.name}
                    </div>
                )}
                <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                    {video.title || "Untitled Video"}
                </h3>
            </CardHeader>
            <CardContent className="p-3 pt-1 flex-1 flex flex-col justify-end gap-2">
                <div className="flex flex-col gap-1 text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                    <div className="flex items-center gap-1.5 line-clamp-1">
                        <Badge variant="outline" className="text-[9px] uppercase px-1.5 py-0 h-4 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-300">
                            {format}
                        </Badge>
                        <span className="truncate">{nicheDetail}</span>
                    </div>
                    <div className="flex items-center pt-1 mt-1 border-t border-zinc-100 dark:border-zinc-800/50">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
