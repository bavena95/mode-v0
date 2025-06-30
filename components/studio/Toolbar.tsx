"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  MousePointer, 
  Hand, 
  Type, 
  Square, 
  Circle, 
  Image,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react'

interface ToolbarProps {
  activeTool: string
  onToolChange: (tool: string) => void
  onZoomIn: () => void
  onZoomOut: () => void
  onResetZoom: () => void
  zoom: number
}

const tools = [
  { id: 'select', name: 'Select', icon: MousePointer },
  { id: 'pan', name: 'Pan', icon: Hand },
  { id: 'text', name: 'Text', icon: Type },
  { id: 'rectangle', name: 'Rectangle', icon: Square },
  { id: 'circle', name: 'Circle', icon: Circle },
  { id: 'image', name: 'Image', icon: Image },
]

export function Toolbar({ 
  activeTool, 
  onToolChange, 
  onZoomIn, 
  onZoomOut, 
  onResetZoom,
  zoom 
}: ToolbarProps) {
  return (
    <div className="flex items-center gap-2 p-3 bg-white border-b border-gray-200">
      {/* Tools */}
      <div className="flex items-center gap-1">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <Button
              key={tool.id}
              variant={activeTool === tool.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onToolChange(tool.id)}
              className="w-9 h-9 p-0"
              title={tool.name}
            >
              <Icon className="w-4 h-4" />
            </Button>
          )
        })}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Zoom Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomOut}
          className="w-9 h-9 p-0"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetZoom}
          className="min-w-16 h-9 text-xs"
          title="Reset Zoom"
        >
          {zoom}%
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomIn}
          className="w-9 h-9 p-0"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetZoom}
          className="w-9 h-9 p-0"
          title="Fit to Screen"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}