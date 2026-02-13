
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { WizardData } from "./CreateSeriesWizard"
import Image from "next/image"

interface Step4Props {
    data: WizardData
    updateData: (data: Partial<WizardData>) => void
    onNext: () => void
    onBack: () => void
}

const VideoStyles = [
    { id: "realistic", name: "Realistic", image: "/video-style/realistic.png" },
    { id: "3d-render", name: "3D Render", image: "/video-style/3d-render.png" },
    { id: "anime", name: "Anime", image: "/video-style/anime.png" },
    { id: "cinematic", name: "Cinematic", image: "/video-style/cinematic.png" },
    { id: "cyberpunk", name: "Cyberpunk", image: "/video-style/cyberpunk.png" },
    { id: "gta", name: "GTA Style", image: "/video-style/gta.png" },
]

const CaptionStyles = [
    { id: "fade", name: "Fade In" },
    { id: "pop", name: "Pop Up" }, 
    { id: "typewriter", name: "Typewriter" },
    { id: "scale", name: "Scale Up" },
    { id: "slide", name: "Slide In" },
    { id: "karaoke", name: "Karaoke" },
]

const CaptionPreview = ({ style, isSelected }: { style: string, isSelected: boolean }) => {
    // This is a simplified preview. In a real app, we'd use Framer Motion or CSS animations matching Remotion.
    // For now, we'll use Tailwind classes to approximate the look.
    
    let animationClass = ""
    switch (style) {
        case "fade": animationClass = "animate-in fade-in duration-1000 repeat-infinite"; break;
        case "pop": animationClass = "animate-in zoom-in-50 duration-500"; break;
        case "scale": animationClass = "animate-in zoom-in-0 duration-1000"; break;
        case "slide": animationClass = "animate-in slide-in-from-bottom duration-1000"; break;
        // Typewriter and Karaoke are harder to do with just utility classes without custom keyframes or JS
        // We will just use a generic pulse for now for those complex ones to indicate 'activity'
        default: animationClass = "animate-pulse"; 
    }

    return (
        <div className={`h-24 flex items-center justify-center rounded-md border-2 transition-all overflow-hidden relative ${
            isSelected 
            ? "border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/20" 
            : "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
        }`}>
            <span className={`text-lg font-bold text-zinc-900 dark:text-white ${animationClass}`}>
                Preview Text
            </span>
            {isSelected && (
                <div className="absolute top-2 right-2">
                    <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
            )}
        </div>
    )
}

export function Step4Style({ data, updateData, onNext, onBack }: Step4Props) {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Video Style Section */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                    Video Style
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400">
                    Choose the visual style for your video generation.
                </p>
                
                <div className="relative">
                    {/* Horizontal Scroll Container */}
                    <div className="flex gap-4 overflow-x-auto pb-6 pt-2 px-1 snap-x scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
                        {VideoStyles.map((style) => {
                            const isSelected = data.videoStyle === style.id
                            return (
                                <div 
                                    key={style.id}
                                    onClick={() => updateData({ videoStyle: style.id })}
                                    className={`
                                        relative flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-300 snap-center group
                                        w-[160px] aspect-[9/16] 
                                        ${isSelected 
                                            ? "border-indigo-600 ring-4 ring-indigo-500/20 scale-105 shadow-xl" 
                                            : "border-zinc-200 hover:border-zinc-300 hover:scale-105 hover:shadow-lg dark:border-zinc-800"
                                        }
                                    `}
                                >
                                    <Image 
                                        src={style.image} 
                                        alt={style.name}
                                        fill
                                        className="object-cover"
                                        sizes="160px"
                                    />
                                    
                                    {/* Overlay Gradient */}
                                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity ${isSelected ? 'opacity-80' : 'group-hover:opacity-70'}`} />
                                    
                                    <div className="absolute bottom-0 left-0 right-0 p-3">
                                        <p className="text-white font-medium text-sm text-center shadow-black/50 drop-shadow-md">
                                            {style.name}
                                        </p>
                                    </div>

                                    {isSelected && (
                                        <div className="absolute top-3 right-3 bg-indigo-600 rounded-full p-1 shadow-lg">
                                            <Check className="h-3 w-3 text-white" />
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Caption Style Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                    Caption Style
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {CaptionStyles.map((style) => (
                        <div 
                            key={style.id}
                            onClick={() => updateData({ captionStyle: style.id })}
                            className="cursor-pointer group"
                        >
                            <CaptionPreview 
                                style={style.id} 
                                isSelected={data.captionStyle === style.id} 
                            />
                            <p className={`mt-2 text-center text-sm font-medium transition-colors ${
                                data.captionStyle === style.id 
                                ? "text-indigo-600 dark:text-indigo-400" 
                                : "text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200"
                            }`}>
                                {style.name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between pt-8 border-t border-zinc-100 dark:border-zinc-800">
                <Button 
                    variant="ghost" 
                    onClick={onBack}
                    className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                >
                    Back
                </Button>
                <Button 
                    onClick={onNext} 
                    disabled={!data.videoStyle || !data.captionStyle} // Require both selection
                    className="bg-indigo-600 px-8 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"
                >
                    Continue
                </Button>
            </div>
        </div>
    )
}
