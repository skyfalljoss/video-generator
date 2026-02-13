import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Clock, Film, BookOpen, AlertTriangle } from "lucide-react"
import { WizardData } from "./CreateSeriesWizard"

interface Step1Props {
  data: WizardData
  updateData: (data: Partial<WizardData>) => void
  onNext: () => void
}

export function Step1Format({ data, updateData, onNext }: Step1Props) {
  const niches = [
    { id: "scary", title: "Scary stories", description: "Spinetingling horror tales", icon: AlertTriangle },
    { id: "history", title: "History", description: "Fascinating historical facts", icon: Clock },
    { id: "crime", title: "True Crime", description: "Real unsolved mysteries", icon: Film },
    { id: "facts", title: "Fun Facts", description: "Did you know?", icon: BookOpen },
  ]

  const isValid = data.format === "niche" ? !!data.niche : !!data.customTopic && !!data.customPrompt

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Choose format & Niche</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Select the type of content you want to generate.</p>
        </div>
        <div className="flex shrink-0 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800 self-start sm:self-auto">
          <button
            onClick={() => updateData({ format: "niche" })}
            className={`rounded-md px-3 py-1 text-sm font-medium transition-all ${
              data.format === "niche"
                ? "bg-white text-zinc-900 shadow-sm dark:bg-black dark:text-white"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            Niche
          </button>
          <button
            onClick={() => updateData({ format: "custom" })}
            className={`rounded-md px-3 py-1 text-sm font-medium transition-all ${
              data.format === "custom"
                ? "bg-white text-zinc-900 shadow-sm dark:bg-black dark:text-white"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            Custom
          </button>
        </div>
      </div>

      {data.format === "niche" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {niches.map((niche) => (
            <Card
              key={niche.id}
              onClick={() => updateData({ niche: niche.id })}
              className={`cursor-pointer border p-3 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900 ${
                data.niche === niche.id
                  ? "border-indigo-600 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-950/20"
                  : "border-zinc-200 bg-white shadow-sm hover:border-zinc-300 dark:bg-black dark:border-zinc-800"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`rounded-lg p-2 ${data.niche === niche.id ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                  <niche.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white">{niche.title}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{niche.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
           <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Niche Name</label>
              <Input 
                placeholder="e.g. Space Exploration" 
                value={data.customTopic}
                onChange={(e) => updateData({ customTopic: e.target.value })}
                className="bg-white dark:bg-black"
              />
           </div>
           <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
              <Textarea 
                placeholder="Describe the type of content you want to generate. e.g. Interesting facts about the solar system and beyond." 
                value={data.customPrompt}
                onChange={(e) => updateData({ customPrompt: e.target.value })}
                className="bg-white dark:bg-black min-h-[100px]"
              />
           </div>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button 
            onClick={onNext} 
            disabled={!isValid}
            className="bg-indigo-600 px-8 text-white hover:bg-indigo-700"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
