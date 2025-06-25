"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download } from "lucide-react"

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedResult: any
  onExport: (options: ExportOptions) => void
}

interface ExportOptions {
  format: string
  quality: number
  resolution: string
  includeMetadata: boolean
  watermark: boolean
}

const FORMATS = [
  { value: "png", label: "PNG", description: "Best for graphics with transparency" },
  { value: "jpg", label: "JPEG", description: "Best for photos, smaller file size" },
  { value: "webp", label: "WebP", description: "Modern format, great compression" },
  { value: "svg", label: "SVG", description: "Vector format, infinitely scalable" },
  { value: "pdf", label: "PDF", description: "Document format, print-ready" },
]

const RESOLUTIONS = [
  { value: "original", label: "Original", description: "Keep original dimensions" },
  { value: "1080p", label: "1080p", description: "1920×1080 (Full HD)" },
  { value: "4k", label: "4K", description: "3840×2160 (Ultra HD)" },
  { value: "print", label: "Print", description: "300 DPI for printing" },
  { value: "web", label: "Web", description: "Optimized for web use" },
]

export function ExportDialog({ open, onOpenChange, selectedResult, onExport }: ExportDialogProps) {
  const [options, setOptions] = useState<ExportOptions>({
    format: "png",
    quality: 95,
    resolution: "original",
    includeMetadata: true,
    watermark: false,
  })

  const handleExport = () => {
    onExport(options)
    onOpenChange(false)
  }

  const getEstimatedSize = () => {
    const baseSize = 2.5 // MB
    const qualityMultiplier = options.quality / 100
    const formatMultiplier = options.format === "png" ? 1.5 : options.format === "jpg" ? 0.8 : 1
    return (baseSize * qualityMultiplier * formatMultiplier).toFixed(1)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-teal-400" />
            Export Image
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Format</Label>
            <Select value={options.format} onValueChange={(format) => setOptions({ ...options, format })}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {FORMATS.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    <div>
                      <div className="font-medium">{format.label}</div>
                      <div className="text-xs text-gray-400">{format.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Resolution */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Resolution</Label>
            <Select value={options.resolution} onValueChange={(resolution) => setOptions({ ...options, resolution })}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {RESOLUTIONS.map((resolution) => (
                  <SelectItem key={resolution.value} value={resolution.value}>
                    <div>
                      <div className="font-medium">{resolution.label}</div>
                      <div className="text-xs text-gray-400">{resolution.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quality */}
          {options.format !== "svg" && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium">Quality</Label>
                <span className="text-sm text-gray-400">{options.quality}%</span>
              </div>
              <Slider
                value={[options.quality]}
                onValueChange={([quality]) => setOptions({ ...options, quality })}
                max={100}
                min={10}
                className="w-full"
              />
            </div>
          )}

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Include Metadata</Label>
              <Switch
                checked={options.includeMetadata}
                onCheckedChange={(includeMetadata) => setOptions({ ...options, includeMetadata })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Add Watermark</Label>
              <Switch
                checked={options.watermark}
                onCheckedChange={(watermark) => setOptions({ ...options, watermark })}
              />
            </div>
          </div>

          {/* Preview Info */}
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Estimated Size:</span>
                <span className="text-white ml-2">{getEstimatedSize()} MB</span>
              </div>
              <div>
                <span className="text-gray-400">Format:</span>
                <span className="text-white ml-2 uppercase">{options.format}</span>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <Button onClick={handleExport} className="w-full h-12 bg-gradient-to-r from-teal-500 to-green-500">
            <Download className="w-4 h-4 mr-2" />
            Export Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
