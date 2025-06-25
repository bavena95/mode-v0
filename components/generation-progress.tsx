"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Zap, Brush, Check } from "lucide-react"

interface GenerationProgressProps {
  isGenerating: boolean
  mode: string
  context: string
  onComplete?: () => void
}

const GENERATION_STEPS = [
  { name: "Analyzing prompt", icon: Sparkles, duration: 1000 },
  { name: "Initializing AI model", icon: Zap, duration: 2000 },
  { name: "Generating image", icon: Brush, duration: 8000 },
  { name: "Finalizing result", icon: Check, duration: 1000 },
]

export function GenerationProgress({ isGenerating, mode, context, onComplete }: GenerationProgressProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isGenerating) {
      setCurrentStep(0)
      setProgress(0)
      return
    }

    let stepIndex = 0
    let stepProgress = 0
    const totalDuration = GENERATION_STEPS.reduce((acc, step) => acc + step.duration, 0)
    let elapsedTime = 0

    const interval = setInterval(() => {
      elapsedTime += 100

      // Calculate which step we're in
      let cumulativeDuration = 0
      for (let i = 0; i < GENERATION_STEPS.length; i++) {
        cumulativeDuration += GENERATION_STEPS[i].duration
        if (elapsedTime <= cumulativeDuration) {
          stepIndex = i
          const stepStart = cumulativeDuration - GENERATION_STEPS[i].duration
          stepProgress = ((elapsedTime - stepStart) / GENERATION_STEPS[i].duration) * 100
          break
        }
      }

      setCurrentStep(stepIndex)
      setProgress((elapsedTime / totalDuration) * 100)

      if (elapsedTime >= totalDuration) {
        clearInterval(interval)
        onComplete?.()
      }
    }, 100)

    return () => clearInterval(interval)
  }, [isGenerating, onComplete])

  if (!isGenerating) return null

  const CurrentIcon = GENERATION_STEPS[currentStep]?.icon || Sparkles

  return (
    <Card className="bg-gradient-to-br from-teal-500/10 to-green-500/10 backdrop-blur-xl border-teal-500/20">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/25">
            <CurrentIcon className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Creating your {context.toLowerCase()}</h3>
          <p className="text-gray-400">Using {mode} mode with AI optimization</p>
        </div>

        <div className="space-y-4">
          <Progress value={progress} className="h-2 bg-white/10" />

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">{GENERATION_STEPS[currentStep]?.name || "Processing..."}</span>
            <span className="text-teal-400 font-medium">{Math.round(progress)}%</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {GENERATION_STEPS.map((step, index) => {
              const StepIcon = step.icon
              const isActive = index === currentStep
              const isCompleted = index < currentStep

              return (
                <div
                  key={index}
                  className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-teal-500/20 border border-teal-500/30"
                      : isCompleted
                        ? "bg-green-500/20 border border-green-500/30"
                        : "bg-white/5 border border-white/10"
                  }`}
                >
                  <StepIcon
                    className={`w-5 h-5 mb-2 ${
                      isActive ? "text-teal-400 animate-pulse" : isCompleted ? "text-green-400" : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`text-xs text-center leading-tight ${
                      isActive ? "text-teal-300" : isCompleted ? "text-green-300" : "text-gray-500"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
