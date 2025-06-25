"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Zap, Palette, RefreshCw } from "lucide-react"
import type { ColorValue, ColorHarmony } from "@/types/colors"

interface ColorHarmonyProps {
  baseColor: ColorValue
  currentHarmony: ColorHarmony | null
  onGenerateHarmony: (type: ColorHarmony["type"], baseColor?: ColorValue) => ColorHarmony
  onColorSelect: (color: ColorValue) => void
  onCreatePalette?: (name: string, colors: ColorValue[]) => void
}

const HARMONY_TYPES: Array<{
  value: ColorHarmony["type"]
  label: string
  description: string
}> = [
  {
    value: "complementary",
    label: "Complementary",
    description: "Colors opposite on the color wheel",
  },
  {
    value: "analogous",
    label: "Analogous",
    description: "Colors adjacent on the color wheel",
  },
  {
    value: "triadic",
    label: "Triadic",
    description: "Three colors evenly spaced on the wheel",
  },
  {
    value: "tetradic",
    label: "Tetradic",
    description: "Four colors forming a rectangle",
  },
  {
    value: "split-complementary",
    label: "Split Complementary",
    description: "Base color plus two adjacent to its complement",
  },
  {
    value: "monochromatic",
    label: "Monochromatic",
    description: "Different shades of the same hue",
  },
]

export function ColorHarmony({
  baseColor,
  currentHarmony,
  onGenerateHarmony,
  onColorSelect,
  onCreatePalette,
}: ColorHarmonyProps) {
  const [selectedHarmonyType, setSelectedHarmonyType] = useState<ColorHarmony["type"]>("complementary")

  const generateHarmony = () => {
    onGenerateHarmony(selectedHarmonyType, baseColor)
  }

  const createPaletteFromHarmony = () => {
    if (currentHarmony && onCreatePalette) {
      const harmonyName = HARMONY_TYPES.find((t) => t.value === currentHarmony.type)?.label || "Harmony"
      onCreatePalette(`${harmonyName} Harmony`, currentHarmony.colors)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Label className="text-white font-semibold text-lg flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Color Harmony
        </Label>
        {currentHarmony && onCreatePalette && (
          <Button
            variant="ghost"
            size="sm"
            onClick={createPaletteFromHarmony}
            className="text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 h-8"
          >
            <Palette className="w-4 h-4 mr-2" />
            Save as Palette
          </Button>
        )}
      </div>

      {/* Base Color */}
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <Label className="text-sm text-gray-400 mb-3 block">Base Color</Label>
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl border-2 border-white/20 shadow-lg"
            style={{ backgroundColor: baseColor.hex }}
          />
          <div>
            <p className="text-sm font-medium text-white">{baseColor.hex}</p>
            <p className="text-xs text-gray-400">
              HSL({Math.round(baseColor.hsl.h)}, {Math.round(baseColor.hsl.s)}%, {Math.round(baseColor.hsl.l)}%)
            </p>
          </div>
        </div>
      </div>

      {/* Harmony Type Selection */}
      <div className="space-y-3">
        <Label className="text-sm text-gray-400 font-medium">Harmony Type</Label>
        <Select
          value={selectedHarmonyType}
          onValueChange={(value: ColorHarmony["type"]) => setSelectedHarmonyType(value)}
        >
          <SelectTrigger className="bg-white/5 border-white/10 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10">
            {HARMONY_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div>
                  <div className="font-medium">{type.label}</div>
                  <div className="text-xs text-gray-400">{type.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={generateHarmony}
          className="w-full h-12 bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 rounded-xl shadow-lg shadow-teal-500/25"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate Harmony
        </Button>
      </div>

      {/* Generated Harmony */}
      {currentHarmony && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-gray-400 font-medium">
              {HARMONY_TYPES.find((t) => t.value === currentHarmony.type)?.label} Colors
            </Label>
            <span className="text-xs text-gray-500">{currentHarmony.colors.length} colors</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {currentHarmony.colors.map((color, index) => (
              <button
                key={index}
                onClick={() => onColorSelect(color)}
                className="group p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all hover:scale-105"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg border border-white/20 shadow-sm group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">{color.hex}</p>
                    <p className="text-xs text-gray-400">
                      {Math.round(color.hsl.h)}°, {Math.round(color.hsl.s)}%, {Math.round(color.hsl.l)}%
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Color Relationships */}
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <Label className="text-sm text-gray-400 mb-3 block">Color Relationships</Label>
            <div className="space-y-2">
              {currentHarmony.colors.map((color, index) => {
                const angleDiff = Math.abs(color.hsl.h - baseColor.hsl.h)
                const relationship =
                  index === 0
                    ? "Base Color"
                    : angleDiff === 180
                      ? "Complementary"
                      : angleDiff <= 30
                        ? "Analogous"
                        : angleDiff === 120
                          ? "Triadic"
                          : angleDiff === 90
                            ? "Square"
                            : `${Math.round(angleDiff)}° apart`

                return (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border border-white/20" style={{ backgroundColor: color.hex }} />
                      <span className="text-white">{color.hex}</span>
                    </div>
                    <span className="text-gray-400">{relationship}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Harmony Examples */}
      <div className="space-y-3">
        <Label className="text-sm text-gray-400 font-medium">Quick Harmonies</Label>
        <div className="grid grid-cols-2 gap-2">
          {HARMONY_TYPES.slice(0, 4).map((type) => (
            <Button
              key={type.value}
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedHarmonyType(type.value)
                onGenerateHarmony(type.value, baseColor)
              }}
              className="h-10 border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/10 rounded-lg text-xs"
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
