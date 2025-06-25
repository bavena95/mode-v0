"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pipette, Copy, Check } from "lucide-react"
import type { ColorValue, ColorModel } from "@/types/colors"
import { ColorUtils } from "@/lib/color-utils"

interface ColorPickerProps {
  color: ColorValue
  colorModel: ColorModel
  onColorChange: (color: ColorValue) => void
  onColorModelChange: (model: ColorModel) => void
  onEyedropper?: () => void
  showEyedropper?: boolean
  className?: string
}

export function ColorPicker({
  color,
  colorModel,
  onColorChange,
  onColorModelChange,
  onEyedropper,
  showEyedropper = false,
  className,
}: ColorPickerProps) {
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hueCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    drawColorWheel()
    drawHueBar()
  }, [color])

  const drawColorWheel = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")!
    const size = 200
    canvas.width = size
    canvas.height = size

    // Draw saturation/lightness square
    const imageData = ctx.createImageData(size, size)
    const data = imageData.data

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const s = (x / size) * 100
        const l = ((size - y) / size) * 100
        const rgb = ColorUtils.hslToRgb(color.hsl.h, s, l)

        const index = (y * size + x) * 4
        data[index] = rgb.r
        data[index + 1] = rgb.g
        data[index + 2] = rgb.b
        data[index + 3] = 255
      }
    }

    ctx.putImageData(imageData, 0, 0)

    // Draw current position indicator
    const x = (color.hsl.s / 100) * size
    const y = size - (color.hsl.l / 100) * size

    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(x, y, 8, 0, Math.PI * 2)
    ctx.stroke()

    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(x, y, 8, 0, Math.PI * 2)
    ctx.stroke()
  }

  const drawHueBar = () => {
    const canvas = hueCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")!
    const width = 200
    const height = 20
    canvas.width = width
    canvas.height = height

    // Draw hue gradient
    const gradient = ctx.createLinearGradient(0, 0, width, 0)
    for (let i = 0; i <= 360; i += 60) {
      const rgb = ColorUtils.hslToRgb(i, 100, 50)
      const hex = ColorUtils.rgbToHex(rgb.r, rgb.g, rgb.b)
      gradient.addColorStop(i / 360, hex)
    }

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Draw current hue indicator
    const x = (color.hsl.h / 360) * width
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()

    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const s = (x / canvas.width) * 100
    const l = ((canvas.height - y) / canvas.height) * 100

    const rgb = ColorUtils.hslToRgb(color.hsl.h, s, l)
    const hex = ColorUtils.rgbToHex(rgb.r, rgb.g, rgb.b)
    const newColor = ColorUtils.createColorValue(hex, color.alpha)

    onColorChange(newColor)
  }

  const handleHueClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = hueCanvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const h = (x / canvas.width) * 360

    const rgb = ColorUtils.hslToRgb(h, color.hsl.s, color.hsl.l)
    const hex = ColorUtils.rgbToHex(rgb.r, rgb.g, rgb.b)
    const newColor = ColorUtils.createColorValue(hex, color.alpha)

    onColorChange(newColor)
  }

  const copyColorValue = () => {
    let value = ""
    switch (colorModel) {
      case "hex":
        value = color.hex
        break
      case "rgb":
        value = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`
        break
      case "hsl":
        value = `hsl(${Math.round(color.hsl.h)}, ${Math.round(color.hsl.s)}%, ${Math.round(color.hsl.l)}%)`
        break
      case "hsv":
        value = `hsv(${Math.round(color.hsv.h)}, ${Math.round(color.hsv.s)}%, ${Math.round(color.hsv.v)}%)`
        break
      case "cmyk":
        value = `cmyk(${color.cmyk.c}%, ${color.cmyk.m}%, ${color.cmyk.y}%, ${color.cmyk.k}%)`
        break
      case "lab":
        value = `lab(${color.lab.l}, ${color.lab.a}, ${color.lab.b})`
        break
    }

    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const updateColorValue = (value: string) => {
    try {
      if (colorModel === "hex") {
        const newColor = ColorUtils.createColorValue(value, color.alpha)
        onColorChange(newColor)
      } else if (colorModel === "rgb") {
        const match = value.match(/rgb$$(\d+),\s*(\d+),\s*(\d+)$$/)
        if (match) {
          const [, r, g, b] = match.map(Number)
          const hex = ColorUtils.rgbToHex(r, g, b)
          const newColor = ColorUtils.createColorValue(hex, color.alpha)
          onColorChange(newColor)
        }
      }
      // Add other color model parsing as needed
    } catch (error) {
      console.error("Invalid color value:", error)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Color Preview */}
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-xl border-2 border-white/20 shadow-lg"
          style={{ backgroundColor: color.hex }}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Select value={colorModel} onValueChange={(value: ColorModel) => onColorModelChange(value)}>
              <SelectTrigger className="w-20 h-8 bg-white/5 border-white/10 text-white text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                <SelectItem value="hex">HEX</SelectItem>
                <SelectItem value="rgb">RGB</SelectItem>
                <SelectItem value="hsl">HSL</SelectItem>
                <SelectItem value="hsv">HSV</SelectItem>
                <SelectItem value="cmyk">CMYK</SelectItem>
                <SelectItem value="lab">LAB</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyColorValue}
              className="text-gray-400 hover:text-white h-8 w-8 p-0"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </Button>
            {onEyedropper && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onEyedropper}
                disabled={showEyedropper}
                className="text-gray-400 hover:text-white h-8 w-8 p-0"
              >
                <Pipette className="w-3 h-3" />
              </Button>
            )}
          </div>
          <Input
            value={
              colorModel === "hex"
                ? color.hex
                : colorModel === "rgb"
                  ? `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`
                  : colorModel === "hsl"
                    ? `hsl(${Math.round(color.hsl.h)}, ${Math.round(color.hsl.s)}%, ${Math.round(color.hsl.l)}%)`
                    : colorModel === "hsv"
                      ? `hsv(${Math.round(color.hsv.h)}, ${Math.round(color.hsv.s)}%, ${Math.round(color.hsv.v)}%)`
                      : colorModel === "cmyk"
                        ? `cmyk(${color.cmyk.c}%, ${color.cmyk.m}%, ${color.cmyk.y}%, ${color.cmyk.k}%)`
                        : `lab(${color.lab.l}, ${color.lab.a}, ${color.lab.b})`
            }
            onChange={(e) => updateColorValue(e.target.value)}
            className="h-8 bg-white/5 border-white/10 text-white text-xs"
          />
        </div>
      </div>

      {/* Color Picker Canvas */}
      <div className="space-y-3">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-48 rounded-xl border border-white/10 cursor-crosshair"
        />
        <canvas
          ref={hueCanvasRef}
          onClick={handleHueClick}
          className="w-full h-5 rounded-lg border border-white/10 cursor-crosshair"
        />
      </div>

      {/* Alpha Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-xs text-gray-400">Opacity</Label>
          <span className="text-xs text-white">{Math.round(color.alpha * 100)}%</span>
        </div>
        <Slider
          value={[color.alpha * 100]}
          onValueChange={([value]) => {
            const newColor = { ...color, alpha: value / 100 }
            onColorChange(newColor)
          }}
          max={100}
          min={0}
          className="w-full"
        />
      </div>

      {/* Color Values */}
      <Tabs defaultValue="rgb" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/5 rounded-xl">
          <TabsTrigger value="rgb" className="data-[state=active]:bg-teal-500 rounded-lg text-xs">
            RGB
          </TabsTrigger>
          <TabsTrigger value="hsl" className="data-[state=active]:bg-teal-500 rounded-lg text-xs">
            HSL
          </TabsTrigger>
          <TabsTrigger value="cmyk" className="data-[state=active]:bg-teal-500 rounded-lg text-xs">
            CMYK
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rgb" className="space-y-3 mt-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">R</Label>
              <Input
                type="number"
                value={color.rgb.r}
                onChange={(e) => {
                  const r = Math.max(0, Math.min(255, Number.parseInt(e.target.value) || 0))
                  const hex = ColorUtils.rgbToHex(r, color.rgb.g, color.rgb.b)
                  const newColor = ColorUtils.createColorValue(hex, color.alpha)
                  onColorChange(newColor)
                }}
                className="h-8 bg-white/5 border-white/10 text-white text-xs"
                min={0}
                max={255}
              />
            </div>
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">G</Label>
              <Input
                type="number"
                value={color.rgb.g}
                onChange={(e) => {
                  const g = Math.max(0, Math.min(255, Number.parseInt(e.target.value) || 0))
                  const hex = ColorUtils.rgbToHex(color.rgb.r, g, color.rgb.b)
                  const newColor = ColorUtils.createColorValue(hex, color.alpha)
                  onColorChange(newColor)
                }}
                className="h-8 bg-white/5 border-white/10 text-white text-xs"
                min={0}
                max={255}
              />
            </div>
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">B</Label>
              <Input
                type="number"
                value={color.rgb.b}
                onChange={(e) => {
                  const b = Math.max(0, Math.min(255, Number.parseInt(e.target.value) || 0))
                  const hex = ColorUtils.rgbToHex(color.rgb.r, color.rgb.g, b)
                  const newColor = ColorUtils.createColorValue(hex, color.alpha)
                  onColorChange(newColor)
                }}
                className="h-8 bg-white/5 border-white/10 text-white text-xs"
                min={0}
                max={255}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="hsl" className="space-y-3 mt-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">H</Label>
              <Input
                type="number"
                value={Math.round(color.hsl.h)}
                onChange={(e) => {
                  const h = Math.max(0, Math.min(360, Number.parseInt(e.target.value) || 0))
                  const rgb = ColorUtils.hslToRgb(h, color.hsl.s, color.hsl.l)
                  const hex = ColorUtils.rgbToHex(rgb.r, rgb.g, rgb.b)
                  const newColor = ColorUtils.createColorValue(hex, color.alpha)
                  onColorChange(newColor)
                }}
                className="h-8 bg-white/5 border-white/10 text-white text-xs"
                min={0}
                max={360}
              />
            </div>
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">S</Label>
              <Input
                type="number"
                value={Math.round(color.hsl.s)}
                onChange={(e) => {
                  const s = Math.max(0, Math.min(100, Number.parseInt(e.target.value) || 0))
                  const rgb = ColorUtils.hslToRgb(color.hsl.h, s, color.hsl.l)
                  const hex = ColorUtils.rgbToHex(rgb.r, rgb.g, rgb.b)
                  const newColor = ColorUtils.createColorValue(hex, color.alpha)
                  onColorChange(newColor)
                }}
                className="h-8 bg-white/5 border-white/10 text-white text-xs"
                min={0}
                max={100}
              />
            </div>
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">L</Label>
              <Input
                type="number"
                value={Math.round(color.hsl.l)}
                onChange={(e) => {
                  const l = Math.max(0, Math.min(100, Number.parseInt(e.target.value) || 0))
                  const rgb = ColorUtils.hslToRgb(color.hsl.h, color.hsl.s, l)
                  const hex = ColorUtils.rgbToHex(rgb.r, rgb.g, rgb.b)
                  const newColor = ColorUtils.createColorValue(hex, color.alpha)
                  onColorChange(newColor)
                }}
                className="h-8 bg-white/5 border-white/10 text-white text-xs"
                min={0}
                max={100}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cmyk" className="space-y-3 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">C</Label>
              <span className="text-xs text-white">{color.cmyk.c}%</span>
            </div>
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">M</Label>
              <span className="text-xs text-white">{color.cmyk.m}%</span>
            </div>
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Y</Label>
              <span className="text-xs text-white">{color.cmyk.y}%</span>
            </div>
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">K</Label>
              <span className="text-xs text-white">{color.cmyk.k}%</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
