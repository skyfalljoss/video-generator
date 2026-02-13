
"use client"

import { useState } from "react"
import { Step1Format } from "./Step1Format"
import { Step2Language } from "./Step2Language"
import { Step3Music } from "./Step3Music"
import { Step4Style } from "./Step4Style"
import { Step5Detail } from "./Step5Detail"
import { useRouter } from "next/navigation"

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

export function CreateSeriesWizard() {
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
    publishTime: "00:00"
  })


  const router = useRouter()
  const totalSteps = 5

  const updateWizardData = (data: Partial<WizardData>) => {
    setWizardData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))
  const finish = () => {
    // Submit logic would go here
    console.log("Submitting:", wizardData)
    router.push("/dashboard")
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
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
          />
        )}
      </div>
    </div>
  )
}
