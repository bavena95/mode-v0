"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Trash2, Zap, Sun, Moon, Palette, Brush, Settings } from "lucide-react"
import type { Layer, LayerEffect } from "@/types/layers"

interface LayerEffectsPanelProps {
  layer: Layer | null
  onLayerUpdate: (layerId: string, updates: Partial<Layer>) => void
  onEffectAdd: (layerId: string, effect: LayerEffect) => void
  onEffectRemove: (layerId: string, effectId: string) => void
}

const EFFECT_TYPES = [
  { value: "drop-shadow", label: "Drop Shadow", icon: Moon },
  { value: "inner-shadow", label: "Inner Shadow", icon: Sun },
  { value: "glow", label: "Glow", icon: Zap },
  { value: "stroke", label: "Stroke", icon: Brush },
  { value: "gradient-overlay", label: "Gradient Overlay", icon: Palette },
]

export function LayerEffectsPanel({ layer, onLayerUpdate, onEffectAdd, onEffectRemove }: LayerEffectsPanelProps) {
  const [selectedEffectType, setSelectedEffectType] = useState<string>("drop-shadow")

  if (!layer) {
    return (
      <div className="p-6 text-center">
        <Settings className="w-8 h-8 text-gray-500 mx-auto mb-3" />
        <p className="text-sm text-gray-500">Select a layer to edit effects</p>
      </div>
    )
  }

  const addEffect = () => {
    const effectId = `effect_${Date.now()}`
    const defaultSettings = getDefaultEffectSettings(selectedEffectType)

    const newEffect: LayerEffect = {
      id: effectId,
      type: selectedEffectType as LayerEffect["type"],
      enabled: true,
      settings: defaultSettings,
    }

    onEffectAdd(layer.id, newEffect)
  }

  const updateEffect = (effectId: string, updates: Partial<LayerEffect>) => {
    const updatedEffects = layer.effects.map((effect) => (effect.id === effectId ? { ...effect, ...updates } : effect))
    onLayerUpdate(layer.id, { effects: updatedEffects })
  }

  const updateEffectSetting = (effectId: string, key: string, value: any) => {
    const effect = layer.effects.find((e) => e.id === effectId)
    if (!effect) return

    const updatedSettings = { ...effect.settings, [key]: value }
    updateEffect(effectId, { settings: updatedSettings })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-white font-semibold">Layer Effects</Label>
        <div className="flex items-center gap-2">
          <Select value={selectedEffectType} onValueChange={setSelectedEffectType}>
            <SelectTrigger className="w-32 h-8 bg-white/5 border-white/10 text-white text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10">
              {EFFECT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value} className="text-xs">
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="sm"
            onClick={addEffect}
            className="text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 h-8 w-8 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="h-96">
        {layer.effects.length === 0 ? (
          <div className="text-center py-8">
            <Zap className="w-8 h-8 text-gray-500 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No effects applied</p>
            <p className="text-xs text-gray-600 mt-1">Add an effect to enhance your layer</p>
          </div>
        ) : (
          <div className="space-y-4">
            {layer.effects.map((effect) => {
              const EffectIcon = EFFECT_TYPES.find((t) => t.value === effect.type)?.icon || Zap

              return (
                <div key={effect.id} className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-4">
                  {/* Effect Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <EffectIcon className="w-4 h-4 text-teal-400" />
                      <Label className="text-sm text-white font-medium">
                        {EFFECT_TYPES.find((t) => t.value === effect.type)?.label}
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={effect.enabled}
                        onCheckedChange={(enabled) => updateEffect(effect.id, { enabled })}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEffectRemove(layer.id, effect.id)}
                        className="text-gray-400 hover:text-red-400 h-6 w-6 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Effect Settings */}
                  {effect.enabled && (
                    <div className="space-y-3">{renderEffectSettings(effect, updateEffectSetting)}</div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

function getDefaultEffectSettings(effectType: string): Record<string, any> {
  switch (effectType) {
    case "drop-shadow":
      return {
        color: "#000000",
        opacity: 75,
        angle: 135,
        distance: 5,
        spread: 0,
        blur: 5,
      }
    case "inner-shadow":
      return {
        color: "#000000",
        opacity: 75,
        angle: 135,
        distance: 5,
        choke: 0,
        blur: 5,
      }
    case "glow":
      return {
        color: "#ffffff",
        opacity: 75,
        spread: 0,
        blur: 5,
        type: "outer",
      }
    case "stroke":
      return {
        color: "#000000",
        opacity: 100,
        width: 1,
        position: "outside",
      }
    case "gradient-overlay":
      return {
        colors: ["#000000", "#ffffff"],
        angle: 90,
        opacity: 100,
        blendMode: "normal",
      }
    default:
      return {}
  }
}

function renderEffectSettings(effect: LayerEffect, updateSetting: (effectId: string, key: string, value: any) => void) {
  const { id, type, settings } = effect

  switch (type) {
    case "drop-shadow":
    case "inner-shadow":
      return (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Color</Label>
              <Input
                type="color"
                value={settings.color || "#000000"}
                onChange={(e) => updateSetting(id, "color", e.target.value)}
                className="h-8 bg-white/5 border-white/10"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Opacity</Label>
              <Slider
                value={[settings.opacity || 75]}
                onValueChange={([value]) => updateSetting(id, "opacity", value)}
                max={100}
                min={0}
                className="mt-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Distance</Label>
              <Slider
                value={[settings.distance || 5]}
                onValueChange={([value]) => updateSetting(id, "distance", value)}
                max={50}
                min={0}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Blur</Label>
              <Slider
                value={[settings.blur || 5]}
                onValueChange={([value]) => updateSetting(id, "blur", value)}
                max={50}
                min={0}
                className="mt-2"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs text-gray-400 mb-1 block">Angle</Label>
            <Slider
              value={[settings.angle || 135]}
              onValueChange={([value]) => updateSetting(id, "angle", value)}
              max={360}
              min={0}
              className="mt-2"
            />
          </div>
        </>
      )

    case "glow":
      return (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Color</Label>
              <Input
                type="color"
                value={settings.color || "#ffffff"}
                onChange={(e) => updateSetting(id, "color", e.target.value)}
                className="h-8 bg-white/5 border-white/10"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Type</Label>
              <Select value={settings.type || "outer"} onValueChange={(value) => updateSetting(id, "type", value)}>
                <SelectTrigger className="h-8 bg-white/5 border-white/10 text-white text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  <SelectItem value="outer">Outer</SelectItem>
                  <SelectItem value="inner">Inner</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Opacity</Label>
              <Slider
                value={[settings.opacity || 75]}
                onValueChange={([value]) => updateSetting(id, "opacity", value)}
                max={100}
                min={0}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Blur</Label>
              <Slider
                value={[settings.blur || 5]}
                onValueChange={([value]) => updateSetting(id, "blur", value)}
                max={50}
                min={0}
                className="mt-2"
              />
            </div>
          </div>
        </>
      )

    case "stroke":
      return (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Color</Label>
              <Input
                type="color"
                value={settings.color || "#000000"}
                onChange={(e) => updateSetting(id, "color", e.target.value)}
                className="h-8 bg-white/5 border-white/10"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Width</Label>
              <Slider
                value={[settings.width || 1]}
                onValueChange={([value]) => updateSetting(id, "width", value)}
                max={20}
                min={1}
                className="mt-2"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs text-gray-400 mb-1 block">Position</Label>
            <Select
              value={settings.position || "outside"}
              onValueChange={(value) => updateSetting(id, "position", value)}
            >
              <SelectTrigger className="h-8 bg-white/5 border-white/10 text-white text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                <SelectItem value="outside">Outside</SelectItem>
                <SelectItem value="inside">Inside</SelectItem>
                <SelectItem value="center">Center</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )

    default:
      return null
  }
}
