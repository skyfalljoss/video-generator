
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
    MoreVertical, 
    Pause, 
    Trash2, 
    Edit, 
    Video, 
    Zap,
    Youtube,
    Instagram,
    Music2, // TikTok proxy
    Facebook,
    Mail,
    Play
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

// Map video styles to static images (same as Step 4)
const StyleImages: Record<string, string> = {
    "realistic": "/video-style/realistic.png",
    "3d-render": "/video-style/3d-render.png",
    "anime": "/video-style/anime.png",
    "cinematic": "/video-style/cinematic.png",
    "cyberpunk": "/video-style/cyberpunk.png",
    "gta": "/video-style/gta.png",
}

export interface Series {
    id: string
    name: string
    video_style: string
    status: "pending" | "processing" | "completed" | "failed" | "paused"
    created_at: string
    platforms?: string[]
    duration?: string
}

interface SeriesCardProps {
    series: Series
    onEdit?: (id: string) => void
    onDelete?: (id: string) => void
    onPauseResume?: (id: string) => void
    onGenerate?: (id: string) => void
    onViewVideo?: (id: string) => void
}

const PlatformConfig: Record<string, { className: string, label: string, icon: React.ElementType }> = {
    "TikTok": { className: "bg-black text-white hover:bg-black/90 dark:bg-zinc-800", label: "TikTok", icon: Music2 },
    "YouTube": { className: "bg-red-600 text-white hover:bg-red-700", label: "YouTube", icon: Youtube },
    "Instagram": { className: "bg-pink-600 text-white hover:bg-pink-700", label: "Instagram", icon: Instagram },
    "Facebook": { className: "bg-blue-600 text-white hover:bg-blue-700", label: "Facebook", icon: Facebook },
    "Email": { className: "bg-red-600 text-white hover:bg-red-700", label: "Email", icon: Mail },
}

export function SeriesCard({ 
    series, 
    onEdit, 
    onDelete, 
    onPauseResume, 
    onGenerate, 
    onViewVideo 
}: SeriesCardProps) {
    
    const thumbnailSrc = StyleImages[series.video_style] || "/video-style/realistic.png"

    return (
        <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-zinc-200 dark:border-zinc-800">
            {/* Thumbnail Section */}
            <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                <Image
                    src={thumbnailSrc}
                    alt={series.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                    <Badge className={`capitalize shadow-sm text-white border-0 ${
                        series.status === 'completed' ? 'bg-emerald-500 hover:bg-emerald-600' : 
                        series.status === 'processing' ? 'bg-blue-500 hover:bg-blue-600' : 
                        series.status === 'failed' ? 'bg-red-500 hover:bg-red-600' : 
                        series.status === 'paused' ? 'bg-red-500 hover:bg-red-600' : // Paused is Red
                        'bg-amber-500 hover:bg-amber-600' // Pending
                    }`}>
                        {series.status}
                    </Badge>
                </div>

                {/* Edit Button (Top Right) */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                        size="icon"
                        variant="ghost" 
                        className="h-8 w-8 text-white hover:bg-black/40 hover:text-white rounded-full bg-black/20 backdrop-blur-sm"
                        onClick={() => onEdit?.(series.id)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                </div>

                {/* Duration Badge (Bottom Right) */}
                {series.duration && (
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-sm text-white text-[10px] font-medium rounded">
                        {series.duration}
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-4 space-y-4">
                <div className="flex items-start justify-between gap-2">
                    <div className="space-y-2 flex-1">
                         {/* Platform Tags (Moved above title) */}
                        {series.platforms && series.platforms.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {series.platforms.map(p => {
                                    const config = PlatformConfig[p]
                                    // Use configured color or default
                                    const badgeClass = config ? config.className : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                                    const label = config ? config.label : p
                                    const Icon = config ? config.icon : Video
                                    
                                    return (
                                        <Badge key={p} className={`${badgeClass} border-0 px-2 py-0.5 text-[10px] font-medium flex items-center gap-1`}>
                                            <Icon className="h-3 w-3" />
                                            {label}
                                        </Badge>
                                    )
                                })}
                            </div>
                        )}

                        <div className="space-y-1">
                            <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 line-clamp-1" title={series.name}>
                                {series.name}
                            </h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                {new Date(series.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* Popover / Dropdown Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit?.(series.id)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit Series
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onPauseResume?.(series.id)}>
                                {series.status === 'paused' ? (
                                    <>
                                        <Play className="mr-2 h-4 w-4" /> Resume Series
                                    </>
                                ) : (
                                    <>
                                        <Pause className="mr-2 h-4 w-4" /> Pause Series
                                    </>
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => onDelete?.(series.id)}
                                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Series
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Bottom Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-xs h-8"
                        onClick={() => onViewVideo?.(series.id)}
                    >
                        <Video className="mr-1.5 h-3.5 w-3.5" />
                        View Video
                    </Button>
                    <Button 
                        size="sm" 
                        className="w-full text-xs h-8 bg-indigo-600 hover:bg-indigo-700 text-white"
                        onClick={() => onGenerate?.(series.id)}
                    >
                        <Zap className="mr-1.5 h-3.5 w-3.5 fill-current" />
                        Generate
                    </Button>
                </div>
            </div>
        </Card>
    )
}
