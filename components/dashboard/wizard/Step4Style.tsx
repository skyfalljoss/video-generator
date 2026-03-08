
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
    
    let animationStyle: React.CSSProperties = {}
    switch (style) {
        case "fade": animationStyle = { animation: "fade-preview 1.5s ease-in-out infinite alternate" }; break;
        case "pop": animationStyle = { animation: "pop-preview 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite alternate" }; break;
        case "scale": animationStyle = { animation: "scale-preview 1.5s ease-in-out infinite alternate" }; break;
        case "slide": animationStyle = { animation: "slide-preview 1.5s ease-in-out infinite alternate" }; break;
        case "typewriter": animationStyle = { 
            overflow: "hidden", 
            whiteSpace: "nowrap",
            borderRight: "2px solid white",
            animation: "typing-preview 2s steps(12, end) infinite" 
        }; break;
        case "karaoke": animationStyle = {
             background: "linear-gradient(90deg, #fbbf24 50%, #ffffff 50%)",
             backgroundSize: "200% 100%",
             backgroundClip: "text",
             WebkitBackgroundClip: "text",
             color: "transparent",
             animation: "karaoke-preview 2s linear infinite"
        }; break;
        default: animationStyle = {}; 
    }

    return (
        <div className={`h-24 flex items-center justify-center rounded-xl border-2 transition-all overflow-hidden relative group ${
            isSelected 
            ? "border-indigo-600 ring-4 ring-indigo-500/20 shadow-xl scale-105 bg-indigo-50 dark:bg-indigo-950/20" 
            : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 hover:scale-105 hover:shadow-lg bg-zinc-100 dark:bg-zinc-900"
        }`}>
            {/* Inject custom keyframes just for this component */}
            <style jsx>{`
                @keyframes fade-preview { from { opacity: 0; } to { opacity: 1; } }
                @keyframes pop-preview { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                @keyframes scale-preview { from { transform: scale(1); } to { transform: scale(1.15); } }
                @keyframes slide-preview { from { transform: translateY(15px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                @keyframes typing-preview { from { width: 0; } 50% { width: 100%; } 100% { width: 0; } }
                @keyframes karaoke-preview { from { background-position: 100% 0; } to { background-position: -100% 0; } }
            `}</style>

            <span 
                className={`relative z-10 text-xl md:text-2xl font-black text-black dark:text-white px-2 uppercase tracking-wide inline-block`}
                style={{
                    fontFamily: "Arial, sans-serif",
                    ...animationStyle
                }}
            >
                Preview
            </span>
            
            {isSelected && (
                <div className="absolute top-2 right-2 bg-indigo-600 rounded-full p-1 shadow-md z-20">
                    <Check className="h-3 w-3 text-white" />
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
