
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Pause, Check } from "lucide-react"
import { WizardData } from "./CreateSeriesWizard"
import { useState, useRef, useEffect } from "react"

interface Step3Props {
    data: WizardData
    updateData: (data: Partial<WizardData>) => void
    onNext: () => void
    onBack: () => void
}

const MusicTracks = [
    {
        id: "mountain",
        title: "The Mountain",
        url: "https://ik.imagekit.io/0fkflxaif/bgMusic/the_mountain-background-music-159125.mp3",
        duration: "2:39" 
    },
    {
        id: "lofi-jazz",
        title: "Sentimental Jazzy Love",
        url: "https://ik.imagekit.io/0fkflxaif/bgMusic/sonican-lo-fi-music-loop-sentimental-jazzy-love-473154.mp3",
        duration: "1:12"
    },
    {
        id: "nastelbom",
        title: "Nastelbom Background",
        url: "https://ik.imagekit.io/0fkflxaif/bgMusic/nastelbom-background-music-463062.mp3",
        duration: "1:45"
    },
    {
        id: "mfcc",
        title: "MFCC Background",
        url: "https://ik.imagekit.io/0fkflxaif/bgMusic/mfcc-background-music-484362.mp3",
        duration: "2:10"
    },
    {
        id: "no-sleep",
        title: "No Sleep",
        url: "https://ik.imagekit.io/0fkflxaif/bgMusic/kontraa-no-sleep-hiphop-music-473847.mp3",
        duration: "2:46"
    },
    {
        id: "nature",
        title: "Nature",
        url: "https://ik.imagekit.io/0fkflxaif/bgMusic/vkroxstarsinger-nature-music-vkroxstarsinger-226067.mp3",
        duration: "2:00"
    }
]

export function Step3Music({ data, updateData, onNext, onBack }: Step3Props) {
    const [playingTrack, setPlayingTrack] = useState<string | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const handlePlayPreview = (trackId: string) => {
        if (playingTrack === trackId) {
            audioRef.current?.pause()
            setPlayingTrack(null)
            return
        }

        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }

        const track = MusicTracks.find(t => t.id === trackId)
        if (!track) return

        const audio = new Audio(track.url)
        audioRef.current = audio

        audio.onended = () => {
            setPlayingTrack(null)
        }

        audio.onerror = () => {
            console.error("Error playing audio:", track.url)
            setPlayingTrack(null)
        }

        audio.play().catch(e => console.error("Error playing audio:", e))
        setPlayingTrack(trackId)
    }

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
            }
        }
    }, [])

    const toggleSelection = (trackId: string) => {
        const currentSelection = Array.isArray(data.music) ? data.music : []
        let newSelection: string[]

        if (currentSelection.includes(trackId)) {
            newSelection = currentSelection.filter(id => id !== trackId)
        } else {
            newSelection = [...currentSelection, trackId]
        }
        
        // WizardData is updated to string[], so we can pass the array directly
        updateData({ music: newSelection })
    }

    const selectedTracks = data.music

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                    Background Music
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400">
                    Select background music for your video series. You can select multiple tracks.
                </p>

                <div className="grid gap-4 sm:grid-cols-1">
                    {MusicTracks.map((track) => {
                        const isSelected = selectedTracks.includes(track.id)
                        const isPlaying = playingTrack === track.id

                        return (
                            <Card
                                key={track.id}
                                onClick={() => toggleSelection(track.id)}
                                className={`
                                    relative cursor-pointer overflow-hidden transition-all duration-200 border-2
                                    ${isSelected 
                                        ? "border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/20 shadow-md" 
                                        : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                                    }
                                `}
                            >
                                <div className="p-4 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handlePlayPreview(track.id)
                                            }}
                                            className={`
                                                h-10 w-10 rounded-full shrink-0 transition-colors
                                                ${isPlaying 
                                                    ? "bg-indigo-600 text-white hover:bg-indigo-700" 
                                                    : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
                                                }
                                            `}
                                        >
                                            {isPlaying ? (
                                                <Pause className="h-4 w-4 fill-current" />
                                            ) : (
                                                <Play className="h-4 w-4 fill-current ml-0.5" />
                                            )}
                                        </Button>
                                        
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-zinc-900 dark:text-white">
                                                    {track.title}
                                                </p>
                                                {isSelected && (
                                                    <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                                )}
                                            </div>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                                                {track.duration}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
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
                    disabled={selectedTracks.length === 0}
                    className="bg-indigo-600 px-8 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"
                >
                    Continue
                </Button>
            </div>
        </div>
    )
}
