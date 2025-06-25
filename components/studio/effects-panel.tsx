"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Palette,
  Filter,
  Brush,
  Square,
  Circle,
  Lightbulb,
  Sun,
  Contrast,
  Droplets,
  CloudyIcon as Blur,
  Zap,
  Eye,
  RotateCcw,
} from "lucide-react"
import type { CanvasState } from "@/hooks/use-canvas"

interface EffectsPanelProps {
  canvasState: CanvasState
  onCanvasUpdate: (updates: Partial<CanvasState>) => void
  selectedResult: any
}

const FILTERS = [
  { name: "None", value: "", icon: Eye },
  { name: "Vintage", value: "sepia(0.8) contrast(1.2)", icon: Palette },
  { name: "B&W", value: "grayscale(1)", icon: Circle },
  { name: "Warm", value: "sepia(0.3) saturate(1.4)", icon: Sun },
  { name: "Cool", value: "hue-rotate(180deg) saturate(1.2)", icon: Droplets },
  { name: "High Contrast", value: "contrast(1.8) saturate(1.5)", icon: Contrast },
  { name: "Soft", value: "blur(1px) brightness(1.1)", icon: Blur },
  { name: "Dramatic", value: "contrast(1.5) brightness(0.9) saturate(1.3)", icon: Zap },
]

const EFFECTS = [
  { name: "Blur", icon: Filter, active: false },
  { name: "Sharp", icon: Brush, active: true },
  { name: "Vintage", icon: Palette, active: false },
  { name: "HDR", icon: Lightbulb, active: false },
  { name: "B&W", icon: Circle, active: false },
  { name: "Sepia", icon: Square, active: false },
]

export function EffectsPanel({ canvasState, onCanvasUpdate, selectedResult }: EffectsPanelProps) {
  const [activeEffects, setActiveEffects] = useState<string[]>([])

  const toggleEffect = (effectName: string) => {
    setActiveEffects((prev) =>
      prev.includes(effectName) ? prev.filter((e) => e !== effectName) : [...prev, effectName],
    )
  }

  const applyFilter = (filterValue: string) => {
    const currentFilters = canvasState.filters.filter((f) => !FILTERS.some((filter) => filter.value === f))
    const newFilters = filterValue ? [...currentFilters, filterValue] : currentFilters
    onCanvasUpdate({ filters: newFilters })
  }

  const resetAdjustments = () => {
    onCanvasUpdate({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      rotation: 0,
      filters: [],
    })
    setActiveEffects([])
  }

  if (!selectedResult) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-50">
          <Palette className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-400 mb-2">No Image Selected</h3>
        <p className="text-sm text-gray-500">Generate or select an image to apply effects</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold text-lg">Effects & Adjustments</h3>
        <Button variant="ghost" size="sm" onClick={resetAdjustments} className="text-gray-400 hover:text-white">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      <Tabs defaultValue="adjustments" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/5 rounded-xl">
          <TabsTrigger value="adjustments" className="data-[state=active]:bg-teal-500 rounded-lg text-xs">
            Adjust
          </TabsTrigger>
          <TabsTrigger value="filters" className="data-[state=active]:bg-teal-500 rounded-lg text-xs">
            Filters
          </TabsTrigger>
          <TabsTrigger value="effects" className="data-[state=active]:bg-teal-500 rounded-lg text-xs">
            Effects
          </TabsTrigger>
        </TabsList>

        <TabsContent value="adjustments" className="space-y-6 mt-6">
          {/* Brightness */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm text-gray-400 font-medium flex items-center gap-2">
                <Sun className="w-4 h-4" />
                Brightness
              </Label>
              <span className="text-sm text-white">{canvasState.brightness}%</span>
            </div>
            <Slider
              value={[canvasState.brightness]}
              onValueChange={([brightness]) => onCanvasUpdate({ brightness })}
              max={200}
              min={0}
              className="w-full"
            />
          </div>

          {/* Contrast */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm text-gray-400 font-medium flex items-center gap-2">
                <Contrast className="w-4 h-4" />
                Contrast
              </Label>
              <span className="text-sm text-white">{canvasState.contrast}%</span>
            </div>
            <Slider
              value={[canvasState.contrast]}
              onValueChange={([contrast]) => onCanvasUpdate({ contrast })}
              max={200}
              min={0}
              className="w-full"
            />
          </div>

          {/* Saturation */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm text-gray-400 font-medium flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                Saturation
              </Label>
              <span className="text-sm text-white">{canvasState.saturation}%</span>
            </div>
            <Slider
              value={[canvasState.saturation]}
              onValueChange={([saturation]) => onCanvasUpdate({ saturation })}
              max={200}
              min={0}
              className="w-full"
            />
          </div>

          {/* Blur */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm text-gray-400 font-medium flex items-center gap-2">
                <Blur className="w-4 h-4" />
                Blur
              </Label>
              <span className="text-sm text-white">{canvasState.blur}px</span>
            </div>
            <Slider
              value={[canvasState.blur]}
              onValueChange={([blur]) => onCanvasUpdate({ blur })}
              max={20}
              min={0}
              className="w-full"
            />
          </div>

          {/* Rotation */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm text-gray-400 font-medium flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Rotation
              </Label>
              <span className="text-sm text-white">{canvasState.rotation}°</span>
            </div>
            <Slider
              value={[canvasState.rotation]}
              onValueChange={([rotation]) => onCanvasUpdate({ rotation })}
              max={360}
              min={-360}
              className="w-full"
            />
          </div>
        </TabsContent>

        <TabsContent value="filters" className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-3">
            {FILTERS.map((filter) => {
              const Icon = filter.icon
              const isActive = canvasState.filters.includes(filter.value)

              return (
                <Button
                  key={filter.name}
                  variant="outline"
                  onClick={() => applyFilter(filter.value)}
                  className={`h-20 flex flex-col gap-2 rounded-xl transition-all ${
                    isActive
                      ? "border-teal-500/50 bg-teal-500/20 text-white"
                      : "border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs font-medium">{filter.name}</span>
                </Button>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="effects" className="space-y-4 mt-6">
          <div className="grid grid-cols-3 gap-3">
            {EFFECTS.map((effect) => {
              const Icon = effect.icon
              const isActive = activeEffects.includes(effect.name)

              return (
                <Button
                  key={effect.name}
                  variant="outline"
                  onClick={() => toggleEffect(effect.name)}
                  className={`h-16 flex flex-col gap-2 rounded-xl transition-all ${
                    isActive
                      ? "border-teal-500/50 bg-teal-500/20 text-white"
                      : "border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{effect.name}</span>
                </Button>
              )
            })}
          </div>

          {/* AI Enhancement Options */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <Label className="text-sm text-gray-400 font-medium">AI Enhancements</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-gray-400 font-medium">AI Upscale</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm text-gray-400 font-medium">Enhance Details</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm text-gray-400 font-medium">Face Enhancement</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm text-gray-400 font-medium">Remove Background</Label>
                <Switch />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
