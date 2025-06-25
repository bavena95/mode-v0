"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2, Copy, Download } from "lucide-react"
import type { Gradient, GradientStop, ColorValue } from "@/types/colors"

interface GradientEditorProps {
  gradients: Gradient[]
  currentColor: ColorValue
  onGradientCreate: (name: string, type: Gradient["type"], stops: GradientStop[]) => Gradient
  onGradientUpdate: (gradientId: string, updates: Partial<Gradient>) => void
  onGradientDelete: (gradientId: string) => void
  onColorSelect?: (color: ColorValue) => void
}

export function GradientEditor({
  gradients,
  currentColor,
  onGradientCreate,
  onGradientUpdate,
  onGradientDelete,
  onColorSelect,
}: GradientEditorProps) {
  const [selectedGradient, setSelectedGradient] = useState<Gradient | null>(null)
  const [selectedStop, setSelectedStop] = useState<number | null>(null)
  const [newGradientName, setNewGradientName] = useState("")
  const [newGradientType, setNewGradientType] = useState<Gradient["type"]>("linear")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (selectedGradient) {
      drawGradientPreview()
    }
  }, [selectedGradient])

  const drawGradientPreview = () => {
    const canvas = canvasRef.current
    if (!canvas || !selectedGradient) return

    const ctx = canvas.getContext("2d")!
    const width = canvas.width
    const height = canvas.height

    ctx.clearRect(0, 0, width, height)

    let gradient: CanvasGradient

    switch (selectedGradient.type) {
      case "linear":
        const angle = (selectedGradient.angle || 0) * (Math.PI / 180)
        const x1 = width / 2 - (Math.cos(angle) * width) / 2
        const y1 = height / 2 - (Math.sin(angle) * height) / 2
        const x2 = width / 2 + (Math.cos(angle) * width) / 2
        const y2 = height / 2 + (Math.sin(angle) * height) / 2
        gradient = ctx.createLinearGradient(x1, y1, x2, y2)
        break

      case "radial":
        const centerX = (selectedGradient.center?.x || 0.5) * width
        const centerY = (selectedGradient.center?.y || 0.5) * height
        const radius = (selectedGradient.radius || 0.5) * Math.max(width, height)
        gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
        break

      case "conic":
        // Conic gradients need special handling in canvas
        gradient = ctx.createLinearGradient(0, 0, width, 0)
        break

      default:
        return
    }

    selectedGradient.stops.forEach((stop) => {
      const color = `rgba(${stop.color.rgb.r}, ${stop.color.rgb.g}, ${stop.color.rgb.b}, ${stop.color.alpha})`
      gradient.addColorStop(stop.position, color)
    })

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }

  const createGradient = () => {
    if (newGradientName.trim()) {
      const defaultStops: GradientStop[] = [
        { position: 0, color: currentColor },
        { position: 1, color: { ...currentColor, hex: "#ffffff", rgb: { r: 255, g: 255, b: 255 } } as ColorValue },
      ]
      const gradient = onGradientCreate(newGradientName.trim(), newGradientType, defaultStops)
      setSelectedGradient(gradient)
      setNewGradientName("")
    }
  }

  const addStop = () => {
    if (!selectedGradient) return

    const newPosition =
      selectedGradient.stops.length > 0 ? selectedGradient.stops[selectedGradient.stops.length - 1].position + 0.1 : 0.5

    const newStop: GradientStop = {
      position: Math.min(1, newPosition),
      color: currentColor,
    }

    const updatedStops = [...selectedGradient.stops, newStop].sort((a, b) => a.position - b.position)
    onGradientUpdate(selectedGradient.id, { stops: updatedStops })
    setSelectedGradient({ ...selectedGradient, stops: updatedStops })
  }

  const removeStop = (index: number) => {
    if (!selectedGradient || selectedGradient.stops.length <= 2) return

    const updatedStops = selectedGradient.stops.filter((_, i) => i !== index)
    onGradientUpdate(selectedGradient.id, { stops: updatedStops })
    setSelectedGradient({ ...selectedGradient, stops: updatedStops })
    setSelectedStop(null)
  }

  const updateStop = (index: number, updates: Partial<GradientStop>) => {
    if (!selectedGradient) return

    const updatedStops = selectedGradient.stops.map((stop, i) => (i === index ? { ...stop, ...updates } : stop))
    onGradientUpdate(selectedGradient.id, { stops: updatedStops })
    setSelectedGradient({ ...selectedGradient, stops: updatedStops })
  }

  const exportGradient = (gradient: Gradient) => {
    let cssGradient = ""
    const colorStops = gradient.stops.map((stop) => `${stop.color.hex} ${(stop.position * 100).toFixed(1)}%`).join(", ")

    switch (gradient.type) {
      case "linear":
        cssGradient = `linear-gradient(${gradient.angle || 0}deg, ${colorStops})`
        break
      case "radial":
        cssGradient = `radial-gradient(circle at ${((gradient.center?.x || 0.5) * 100).toFixed(1)}% ${((gradient.center?.y || 0.5) * 100).toFixed(1)}%, ${colorStops})`
        break
      case "conic":
        cssGradient = `conic-gradient(from ${gradient.angle || 0}deg at ${((gradient.center?.x || 0.5) * 100).toFixed(1)}% ${((gradient.center?.y || 0.5) * 100).toFixed(1)}%, ${colorStops})`
        break
    }

    navigator.clipboard.writeText(`background: ${cssGradient};`)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Label className="text-white font-semibold text-lg">Gradient Editor</Label>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 h-8 w-8 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle>Create New Gradient</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-gray-400 mb-2 block">Gradient Name</Label>
                <Input
                  value={newGradientName}
                  onChange={(e) => setNewGradientName(e.target.value)}
                  placeholder="Enter gradient name..."
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="text-sm text-gray-400 mb-2 block">Type</Label>
                <Select value={newGradientType} onValueChange={(value: Gradient["type"]) => setNewGradientType(value)}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="linear">Linear</SelectItem>
                    <SelectItem value="radial">Radial</SelectItem>
                    <SelectItem value="conic">Conic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setNewGradientName("")}>
                  Cancel
                </Button>
                <Button onClick={createGradient} disabled={!newGradientName.trim()}>
                  Create Gradient
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Gradient List */}
      <div className="space-y-2">
        <Label className="text-sm text-gray-400 font-medium">Saved Gradients ({gradients.length})</Label>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {gradients.map((gradient) => (
            <button
              key={gradient.id}
              onClick={() => setSelectedGradient(gradient)}
              className={`w-full p-3 rounded-xl border transition-all text-left ${
                selectedGradient?.id === gradient.id
                  ? "border-teal-500/50 bg-teal-500/10"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">{gradient.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 capitalize">{gradient.type}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      exportGradient(gradient)
                    }}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Gradient Editor */}
      {selectedGradient && (
        <div className="space-y-4 p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">{selectedGradient.name}</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => exportGradient(selectedGradient)}
                className="h-8 text-gray-400 hover:text-white"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onGradientDelete(selectedGradient.id)}
                className="h-8 text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Preview */}
          <canvas ref={canvasRef} width={300} height={100} className="w-full h-24 rounded-lg border border-white/10" />

          {/* Gradient Controls */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Type</Label>
                <Select
                  value={selectedGradient.type}
                  onValueChange={(value: Gradient["type"]) => {
                    onGradientUpdate(selectedGradient.id, { type: value })
                    setSelectedGradient({ ...selectedGradient, type: value })
                  }}
                >
                  <SelectTrigger className="h-8 bg-white/5 border-white/10 text-white text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="linear">Linear</SelectItem>
                    <SelectItem value="radial">Radial</SelectItem>
                    <SelectItem value="conic">Conic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedGradient.type === "linear" && (
                <div>
                  <Label className="text-xs text-gray-400 mb-1 block">Angle</Label>
                  <Slider
                    value={[selectedGradient.angle || 0]}
                    onValueChange={([angle]) => {
                      onGradientUpdate(selectedGradient.id, { angle })
                      setSelectedGradient({ ...selectedGradient, angle })
                    }}
                    max={360}
                    min={0}
                    className="mt-2"
                  />
                </div>
              )}
            </div>

            {/* Color Stops */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-gray-400">Color Stops</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={addStop}
                  className="h-6 w-6 p-0 text-teal-400 hover:text-teal-300"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>

              <div className="space-y-2">
                {selectedGradient.stops.map((stop, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-2 rounded-lg border transition-all ${
                      selectedStop === index ? "border-teal-500/50 bg-teal-500/10" : "border-white/10 bg-white/5"
                    }`}
                  >
                    <button
                      onClick={() => setSelectedStop(selectedStop === index ? null : index)}
                      className="w-8 h-8 rounded border border-white/20 hover:scale-110 transition-transform"
                      style={{ backgroundColor: stop.color.hex }}
                    />
                    <div className="flex-1">
                      <Slider
                        value={[stop.position * 100]}
                        onValueChange={([position]) => updateStop(index, { position: position / 100 })}
                        max={100}
                        min={0}
                        className="w-full"
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-12">{(stop.position * 100).toFixed(0)}%</span>
                    {selectedGradient.stops.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStop(index)}
                        className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
