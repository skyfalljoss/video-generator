
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Play, Pause, Check, AlertTriangle } from "lucide-react"
import { WizardData } from "./CreateSeriesWizard"
import { useState, useRef, useEffect } from "react"

interface Step2Props {
    data: WizardData
    updateData: (data: Partial<WizardData>) => void
    onNext: () => void
    onBack: () => void
}

export const Languages = [
    {
        "language": "English",
        "countryCode": "US",
        "countryFlag": "🇺🇸",
        "modelName": "deepgram",
        "modelLangCode": "en-US"
    },
    {
        "language": "Spanish",
        "countryCode": "MX",
        "countryFlag": "🇲🇽",
        "modelName": "deepgram",
        "modelLangCode": "es-MX"
    },
    {
        "language": "German",
        "countryCode": "DE",
        "countryFlag": "🇩🇪",
        "modelName": "deepgram",
        "modelLangCode": "de-DE"
    },
    {
        "language": "French",
        "countryCode": "FR",
        "countryFlag": "🇫🇷",
        "modelName": "deepgram",
        "modelLangCode": "fr-FR"
    },
    {
        "language": "Dutch",
        "countryCode": "NL",
        "countryFlag": "🇳🇱",
        "modelName": "deepgram",
        "modelLangCode": "nl-NL"
    },
    {
        "language": "Italian",
        "countryCode": "IT",
        "countryFlag": "🇮🇹",
        "modelName": "deepgram",
        "modelLangCode": "it-IT"
    },
    {
        "language": "Japanese",
        "countryCode": "JP",
        "countryFlag": "🇯🇵",
        "modelName": "deepgram",
        "modelLangCode": "ja-JP"
    },
    // {
    //     "language": "Vietnamese",
    //     "countryCode": "VN",
    //     "countryFlag": "🇻🇳",
    //     "modelName": "deepgram",
    //     "modelLangCode": "vi-VN"
    // }
];



export const DeepgramVoices = [
    // English (US)
    {
        "model": "deepgram",
        "modelName": "aura-asteria-en",
        "gender": "female",
        "previewUrl": "/voice/us/deepgram-aura-asteria-en-10d18b87-9422-46ae-a9bc-58f9f5da2718.wav"
    },
    {
        "model": "deepgram",
        "modelName": "aura-luna-en",
        "gender": "female",
        "previewUrl": "/voice/us/deepgram-aura-luna-en-f84c52c8-f48d-4ea2-ad34-bdfb7e2ca922.wav"
    },
    {
        "model": "deepgram",
        "modelName": "aura-stella-en",
        "gender": "female",
        "previewUrl": "/voice/us/deepgram-aura-stella-en-48200d83-4789-45a2-bf38-0aab838e3ec2.wav"
    },
    {
        "model": "deepgram",
        "modelName": "aura-athena-en",
        "gender": "female",
        "previewUrl": "/voice/us/deepgram-aura-athena-en-2a513c92-dba8-4198-a34a-56cc77a99490.wav"
    },
    {
        "model": "deepgram",
        "modelName": "aura-hera-en",
        "gender": "female",
        "previewUrl": "/voice/us/deepgram-aura-hera-en-6957d4fb-658d-435a-bb81-1af618bc3059.wav"
    },
    {
        "model": "deepgram",
        "modelName": "aura-orion-en",
        "gender": "male",
        "previewUrl": "/voice/us/deepgram-aura-orion-en-1fec281e-72bd-4ba4-8489-e2abb6ebd35e.wav"
    },
    {
        "model": "deepgram",
        "modelName": "aura-arcas-en",
        "gender": "male",
        "previewUrl": "/voice/us/deepgram-aura-arcas-en-1297d1d5-87b4-4005-af7c-7dc8a8472023.wav"
    },
    {
        "model": "deepgram",
        "modelName": "aura-perseus-en",
        "gender": "male",
        "previewUrl": "/voice/us/deepgram-aura-perseus-en-09abc5bb-8890-4695-a851-b82341db9a74.wav"
    },
    {
        "model": "deepgram",
        "modelName": "aura-angus-en",
        "gender": "male",
        "previewUrl": "/voice/us/deepgram-aura-angus-en-a5f061b7-515c-4fa4-9c94-a29ecbdb1da2.wav"
    },
    {
        "model": "deepgram",
        "modelName": "aura-orpheus-en",
        "gender": "male",
        "previewUrl": "/voice/us/deepgram-aura-orpheus-en-b9d4b6ad-faf9-489c-a108-db93d53ccb2a.wav"
    },
    {
        "model": "deepgram",
        "modelName": "aura-helios-en",
        "gender": "male",
        "previewUrl": "/voice/us/deepgram-aura-helios-en-63a13952-4c07-4a03-b247-8aab2bd86753.wav"
    },
    {
        "model": "deepgram",
        "modelName": "aura-zeus-en",
        "gender": "male",
        "previewUrl": "/voice/us/deepgram-aura-zeus-en-42a59bcf-59d3-4af8-b084-49ae829ed4a8.wav"
    },
    // Spanish
    {
        "model": "deepgram",
        "modelName": "aura-2-agustina-es",
        "gender": "female",
        "previewUrl": "/voice/es/deepgram-aura-2-agustina-es-2bf652e1-05f4-4ba7-b206-f5ab34e784db.wav"
    },
    {
        "model": "deepgram",
        "modelName": "aura-2-alvaro-es",
        "gender": "male",
        "previewUrl": "/voice/es/deepgram-aura-2-alvaro-es-06963ec4-dd33-4c6f-9354-f40b668545b6.wav"
    },
    {
        "model": "deepgram",
        "modelName": "aura-2-aquila-es",
        "gender": "male",
        "previewUrl": "/voice/es/deepgram-aura-2-aquila-es-d41da07c-cc5a-4642-bc1e-762b81fa49cf.wav"
    },
    {
        "model": "deepgram",
        "modelName": "aura-2-celeste-es",
        "gender": "female",
        "previewUrl": "/voice/es/deepgram-aura-2-celeste-es-4e21a768-b42b-44ae-a548-570b655e95ab.wav"
    },
    // French
    {
        "model": "deepgram",
        "modelName": "aura-2-agathe-fr",
        "gender": "female",
        "previewUrl": "/voice/fr/deepgram-aura-2-agathe-fr-b6a5a9b7-953a-4a3a-826b-c96478ab2ba5.wav"
    },
    {
        "model": "deepgram",
        "modelName": "aura-2-hector-fr",
        "gender": "male",
        "previewUrl": "/voice/fr/deepgram-aura-2-hector-fr-f96cc764-3a4a-47c6-ac77-a6bbc0024520.wav"
    },
    // German
    {
        "model": "deepgram",
        "modelName": "aura-2-julius-de",
        "gender": "male",
        "previewUrl": "/voice/de/deepgram-aura-2-julius-de-2e348806-7e1f-4de2-a002-c512b425c883.wav"
    },
    {
        "model": "deepgram",
        "modelName": "aura-2-lara-de",
        "gender": "female",
        "previewUrl": "/voice/de/deepgram-aura-2-lara-de-f727cefb-16d6-43ef-8387-12bb327e5e68.wav"
    },
    // Italian
    {
        "model": "deepgram",
        "modelName": "aura-2-dionisio-it",
        "gender": "male",
        "previewUrl": "/voice/it/deepgram-aura-2-dionisio-it-c9ba309c-c1b5-4bd6-8401-365f06b6080a.wav"
    },
    {
        "model": "deepgram",
        "modelName": "aura-2-livia-it",
        "gender": "female",
        "previewUrl": "/voice/it/deepgram-aura-2-livia-it-cafdf5c0-ebb4-4ce6-a8b9-ae994d481ba6.wav"
    },
    // Japanese
    {
        "model": "deepgram",
        "modelName": "aura-2-fujin-ja",
        "gender": "male",
        "previewUrl": "/voice/ja/deepgram-aura-2-fujin-ja-8bc490cf-d3d7-496d-bb10-4328374471eb.wav"
    },
    {
        "model": "deepgram",
        "modelName": "aura-2-izanami-ja",
        "gender": "female",
        "previewUrl": "/voice/ja/deepgram-aura-2-izanami-ja-9c06af9c-d6da-4b40-97c5-912d9f105cdd.wav"
    },
];

export function Step2Language({ data, updateData, onNext, onBack }: Step2Props) {
    const [playingVoice, setPlayingVoice] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handlePlayPreview = (modelName: string) => {
        if (playingVoice === modelName) {
            audioRef.current?.pause();
            setPlayingVoice(null);
            return;
        }

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        const voice = DeepgramVoices.find(v => v.modelName === modelName);
        if (!voice || !voice.previewUrl) {
            console.error("Voice preview not found for:", modelName);
            return;
        }

        const audio = new Audio(voice.previewUrl);
        audioRef.current = audio;

        audio.onended = () => {
            setPlayingVoice(null);
        };

        audio.onerror = () => {
            console.error("Error playing audio:", voice.previewUrl);
            setPlayingVoice(null);
        };

        audio.play().catch(e => console.error("Error playing audio:", e));
        setPlayingVoice(modelName);
    };

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);


    // Filter voices based on language code
    // data.language is like "en-US", "es-MX", "vi-VN"
    // Deepgram voices end with "-en", "-es", "-ja", "-fr", "-de", "-nl", "-it"
    const langCode = data.language.split("-")[0]; // "en", "es", "vi"
    
    // Map of language code to Deepgram suffix
    const langSuffixMap: Record<string, string> = {
        "en": "en",
        "es": "es",
        "de": "de",
        "fr": "fr",
        "nl": "nl",
        "it": "it",
        "ja": "ja",
        "vi": "vi" 
    };
    
    const suffix = langSuffixMap[langCode] || "en";
    
    let filteredVoices = DeepgramVoices.filter(v => 
        v.modelName.endsWith("-" + suffix) || 
        (suffix === "en" && v.modelName.includes("-en")) // Handle different English suffixes if needed
    );

    let showFallbackWarning = false;
    // If no voices found for the language (e.g. Vietnamese), fallback to English
    if (filteredVoices.length === 0) {
        filteredVoices = DeepgramVoices.filter(v => v.modelName.endsWith("-en"));
        showFallbackWarning = true;
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                    Language & Voice
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400">
                    Select the language and voice for your video series.
                </p>
                
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Language
                    </label>
                    <Select 
                        value={data.language} 
                        onValueChange={(value) => updateData({ language: value })}
                    >
                        <SelectTrigger className="w-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 h-12">
                            <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                            {Languages.map((lang) => (
                                <SelectItem key={lang.modelLangCode} value={lang.modelLangCode}>
                                    <span className="flex items-center gap-2">
                                        <span className="text-lg">{lang.countryFlag}</span>
                                        <span>{lang.language}</span>
                                        <span className="text-xs text-zinc-400 ml-1">({lang.modelLangCode})</span>
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-4">
                {showFallbackWarning && (
                     <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-start gap-3 mb-4">
                        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-900 dark:text-amber-200">
                            <p className="font-medium">Voice localization not available</p>
                            <p className="opacity-90 mt-0.5">
                                Speech synthesis is not yet available for this language. English voices will be used as a fallback.
                            </p>
                        </div>
                    </div>
                )}
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Voice Selection
                    </label>
                    <span className="text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full">
                        {filteredVoices.length} available
                    </span>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                    {filteredVoices.map((voice) => {
                        const isSelected = data.voice === voice.modelName;
                        const isPlaying = playingVoice === voice.modelName;

                        return (
                            <Card
                                key={voice.modelName}
                                onClick={() => updateData({ voice: voice.modelName })}
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
                                                e.stopPropagation();
                                                handlePlayPreview(voice.modelName);
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
                                                    {/* Parse model name to be more readable if standard format */}
                                                    {voice.modelName
                                                        .replace(/^aura-(2-)?/, "")
                                                        .replace(/-[a-z]{2}$/, "")
                                                        .replace(/^\w/, c => c.toUpperCase())}
                                                </p>
                                                {isSelected && (
                                                    <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                                                <span className="capitalize">{voice.gender}</span>
                                                <span>•</span>
                                                <span className="font-mono opacity-75 text-[10px]">{voice.modelName}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
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
                    disabled={!data.voice}
                    className="bg-indigo-600 px-8 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"
                >
                    Continue
                </Button>
            </div>
        </div>
    )
}
