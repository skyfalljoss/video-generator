
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WizardData } from "./CreateSeriesWizard"
import { Youtube, Instagram, Music2, Clock, Mail, Facebook } from "lucide-react"

interface Step5Props {
    data: WizardData
    updateData: (data: Partial<WizardData>) => void
    onBack: () => void
    onFinish: () => void
}

const Durations = [
    "15-30 Seconds",
    "30-50 Seconds",
    "60-70 Seconds",
]

const Platforms = [
    { id: "TikTok", name: "TikTok", icon: <Music2 className="h-6 w-6" /> }, // Music note as proxy for TikTok if no specific icon
    { id: "YouTube", name: "YouTube Shorts", icon: <Youtube className="h-6 w-6" /> },
    { id: "Instagram", name: "Instagram Reels", icon: <Instagram className="h-6 w-6" /> },
    { id: "Facebook", name: "Facebook", icon: <Facebook className="h-6 w-6" /> },
    { id: "Email", name: "Email", icon: <Mail className="h-6 w-6" /> },
]

export function Step5Detail({ data, updateData, onBack, onFinish }: Step5Props) {
    
    const togglePlatform = (platformId: string) => {
        const current = data.platforms || []
        if (current.includes(platformId)) {
            updateData({ platforms: current.filter(p => p !== platformId) })
        } else {
            updateData({ platforms: [...current, platformId] })
        }
    }

    const isValid = data.name && data.duration && data.platforms.length > 0 && data.publishTime

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-6">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                        Final Details
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400">
                        Almost done! diverse name, platforms and schedule.
                    </p>
                </div>

                {/* Series Name */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Series Name
                    </label>
                    <Input 
                        value={data.name}
                        onChange={(e) => updateData({ name: e.target.value })}
                        placeholder="e.g., Daily Tech Facts"
                        className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                    />
                </div>

                {/* Duration */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Video Duration
                    </label>
                    <Select 
                        value={data.duration} 
                        onValueChange={(value) => updateData({ duration: value })}
                    >
                        <SelectTrigger className="w-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                            <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                            {Durations.map((d) => (
                                <SelectItem key={d} value={d}>
                                    {d}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Platforms */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Destination Platforms
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                        {Platforms.map((p) => {
                            const isSelected = data.platforms.includes(p.id)
                            return (
                                <div 
                                    key={p.id}
                                    onClick={() => togglePlatform(p.id)}
                                    className={`
                                        cursor-pointer flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all
                                        ${isSelected 
                                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400" 
                                            : "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                                        }
                                    `}
                                >
                                    {p.icon}
                                    <span className="text-xs font-medium text-center">{p.name}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Publish Time */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Publish Time
                    </label>
                    <Input 
                        type="time"
                        value={data.publishTime}
                        onChange={(e) => updateData({ publishTime: e.target.value })}
                        className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                    />
                    <p className="text-xs text-amber-600 dark:text-amber-500 mt-2 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-md border border-amber-100 dark:border-amber-900">
                        Note: Video will generate 3-6 hours before video publish time.
                    </p>
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
                    onClick={onFinish} 
                    disabled={!isValid}
                    className="bg-indigo-600 px-8 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"
                >
                    Schedule Series
                </Button>
            </div>
        </div>
    )
}
