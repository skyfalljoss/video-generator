
"use client"

import { useState } from "react"
import { Step1Format } from "./Step1Format"
import { Step2Language } from "./Step2Language"
import { Step3Music } from "./Step3Music"
import { Step4Style } from "./Step4Style"
import { Step5Detail } from "./Step5Detail"
import { useRouter } from "next/navigation"
import { PlanUpgradeDialog } from "../PlanUpgradeDialog"

export type WizardData = {
  format: "niche" | "custom"
  niche: string | null
  customTopic: string
  customPrompt: string
  language: string
  voice: string | null
  music: string[]
  videoStyle: string | null
  captionStyle: string | null
  aspectRatio: string
  fontWeight: string
  name: string
  duration: string
  platforms: string[]
  publishTime: string
}


interface CreateSeriesWizardProps {
    initialData?: Partial<WizardData>
    mode?: 'create' | 'edit'
    seriesId?: string
}

export function CreateSeriesWizard({ 
    initialData, 
    mode = 'create', 
    seriesId 
}: CreateSeriesWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [wizardData, setWizardData] = useState<WizardData>({
    format: "niche",
    niche: null,
    customTopic: "",
    customPrompt: "",
    language: "en-US",
    voice: null,
    music: [],
    videoStyle: null,
    captionStyle: null,
    aspectRatio: "9:16",
    fontWeight: "bold",
    name: "",
    duration: "",
    platforms: [],
    publishTime: "00:00",
    ...initialData // Override with initial data
  })


  const router = useRouter()
  const totalSteps = 5

  const [loading, setLoading] = useState(false)
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
  const [upgradeMessage, setUpgradeMessage] = useState("")

  const updateWizardData = (data: Partial<WizardData>) => {
    setWizardData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  const finish = async () => {
    try {
        setLoading(true)
        
        const url = mode === 'edit' && seriesId 
            ? `/api/series/${seriesId}` 
            : "/api/series"
            
        const method = mode === 'edit' ? "PATCH" : "POST"

        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(wizardData),
        })

        if (response.status === 403) {
             const data = await response.json()
             setUpgradeMessage(data.error || "You have reached your plan limits.")
             setShowUpgradeDialog(true)
             return // exit early
        }

        if (!response.ok) {
            throw new Error(mode === 'edit' ? "Failed to update series" : "Failed to save series")
        }
        
        // Success
        router.push("/dashboard")
        router.refresh()
    } catch (error) {
        console.error("Error saving series:", error)
        // Optionally show toast here
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PlanUpgradeDialog 
           isOpen={showUpgradeDialog} 
           onOpenChange={setShowUpgradeDialog} 
           description={upgradeMessage} 
      />
      {/* Progress Indicator */}
      <div className="mb-10 flex gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1
          const isActive = stepNum === currentStep
          const isCompleted = stepNum < currentStep

          return (
            <div 
                key={stepNum} 
                className={`h-2 flex-1 rounded-full transition-all ${
                    isActive 
                        ? "bg-blue-500" 
                        : isCompleted 
                            ? "bg-blue-200 dark:bg-blue-900" 
                            : "bg-zinc-200 dark:bg-zinc-800"
                }`}
            />
          )
        })}
      </div>

      {/* Steps Content */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-black">
        {currentStep === 1 && (
          <Step1Format 
            data={wizardData} 
            updateData={updateWizardData} 
            onNext={nextStep} 
          />
        )}
        {currentStep === 2 && (
          <Step2Language 
            data={wizardData} 
            updateData={updateWizardData} 
            onNext={nextStep} 
            onBack={prevStep} 
          />
        )}
        {currentStep === 3 && (
          <Step3Music 
            data={wizardData} 
            updateData={updateWizardData} 
            onNext={nextStep} 
            onBack={prevStep} 
          />
        )}
        {currentStep === 4 && (
          <Step4Style 
            data={wizardData} 
            updateData={updateWizardData} 
            onNext={nextStep} 
            onBack={prevStep} 
          />
        )}
        {currentStep === 5 && (
          <Step5Detail 
            data={wizardData} 
            updateData={updateWizardData} 
            onBack={prevStep} 
            onFinish={finish} 
            loading={loading}
          />
        )}
      </div>
    </div>
  )
}
