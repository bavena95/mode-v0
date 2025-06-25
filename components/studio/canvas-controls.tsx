"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ZoomIn, ZoomOut, Maximize2, Grid3X3, Layers, Download, Share2, Copy } from "lucide-react"
import type { CanvasState } from "@/hooks/use-canvas"

interface CanvasControlsProps {
  canvasState: CanvasState
  onCanvasUpdate: (updates: Partial<CanvasState>) => void
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
  onExport: () => void
  onShare: () => void
}

export function CanvasControls({
  canvasState,
  onCanvasUpdate,
  onZoomIn,
  onZoomOut,
  onReset,
  onExport,
  onShare,
}: CanvasControlsProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-black/10 backdrop-blur-sm border-b border-white/5">
      {/* Left Controls */}
      <div className="flex items-center gap-4">
        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onZoomOut} className="text-gray-400 hover:text-white rounded-lg">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2 min-w-[120px]">
            <Slider
              value={[canvasState.zoom]}
              onValueChange={([zoom]) => onCanvasUpdate({ zoom })}
              max={500}
              min={25}
              step={25}
              className="w-20"
            />
            <span className="text-sm text-gray-400 font-medium w-12">{canvasState.zoom}%</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onZoomIn} className="text-gray-400 hover:text-white rounded-lg">
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-white/10"></div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onReset} className="text-gray-400 hover:text-white rounded-lg">
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white rounded-lg">
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white rounded-lg">
            <Layers className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Center Info */}
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <span>
          Pan: {Math.round(canvasState.pan.x)}, {Math.round(canvasState.pan.y)}
        </span>
        <span>Rotation: {canvasState.rotation}°</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white rounded-lg">
          <Copy className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onShare} className="text-gray-400 hover:text-white rounded-lg">
          <Share2 className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          onClick={onExport}
          className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 rounded-lg shadow-lg shadow-teal-500/25"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  )
}
