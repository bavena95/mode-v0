"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Trash2, Copy, Lock, Unlock, Eye, EyeOff } from 'lucide-react'
import type { CanvasElement } from '@/types/studio'

interface PropertiesPanelProps {
  selectedElements: CanvasElement[]
  onElementUpdate: (id: string, updates: Partial<CanvasElement>) => void
  onElementDelete: (id: string) => void
  onElementDuplicate: (id: string) => void
}

export function PropertiesPanel({ 
  selectedElements, 
  onElementUpdate, 
  onElementDelete,
  onElementDuplicate 
}: PropertiesPanelProps) {
  if (selectedElements.length === 0) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <div className="text-center text-gray-500 py-8">
          <p className="text-sm">Select an element to edit properties</p>
        </div>
      </div>
    )
  }

  const element = selectedElements[0] // For now, edit first selected element
  const isMultiSelect = selectedElements.length > 1

  const updateElement = (updates: Partial<CanvasElement>) => {
    onElementUpdate(element.id, updates)
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">
          {isMultiSelect ? `${selectedElements.length} Elements` : element.type}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Basic Properties */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Transform</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Position */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">X</Label>
                <Input
                  type="number"
                  value={Math.round(element.x)}
                  onChange={(e) => updateElement({ x: Number(e.target.value) })}
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-xs">Y</Label>
                <Input
                  type="number"
                  value={Math.round(element.y)}
                  onChange={(e) => updateElement({ y: Number(e.target.value) })}
                  className="h-8"
                />
              </div>
            </div>

            {/* Size */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Width</Label>
                <Input
                  type="number"
                  value={Math.round(element.width)}
                  onChange={(e) => updateElement({ width: Number(e.target.value) })}
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-xs">Height</Label>
                <Input
                  type="number"
                  value={Math.round(element.height)}
                  onChange={(e) => updateElement({ height: Number(e.target.value) })}
                  className="h-8"
                />
              </div>
            </div>

            {/* Rotation */}
            <div>
              <Label className="text-xs">Rotation: {element.rotation}°</Label>
              <Slider
                value={[element.rotation]}
                onValueChange={([value]) => updateElement({ rotation: value })}
                min={-180}
                max={180}
                step={1}
                className="mt-2"
              />
            </div>

            {/* Opacity */}
            <div>
              <Label className="text-xs">Opacity: {Math.round(element.opacity * 100)}%</Label>
              <Slider
                value={[element.opacity * 100]}
                onValueChange={([value]) => updateElement({ opacity: value / 100 })}
                min={0}
                max={100}
                step={1}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Type-specific Properties */}
        {element.type === 'text' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Text</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs">Content</Label>
                <Input
                  value={element.data.text || ''}
                  onChange={(e) => updateElement({ 
                    data: { ...element.data, text: e.target.value }
                  })}
                  className="h-8"
                />
              </div>
              
              <div>
                <Label className="text-xs">Font Size</Label>
                <Input
                  type="number"
                  value={element.data.fontSize || 16}
                  onChange={(e) => updateElement({ 
                    data: { ...element.data, fontSize: Number(e.target.value) }
                  })}
                  className="h-8"
                />
              </div>

              <div>
                <Label className="text-xs">Color</Label>
                <Input
                  type="color"
                  value={element.data.color || '#000000'}
                  onChange={(e) => updateElement({ 
                    data: { ...element.data, color: e.target.value }
                  })}
                  className="h-8"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {element.type === 'shape' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Shape</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs">Fill</Label>
                <Input
                  type="color"
                  value={element.data.fill || '#3B82F6'}
                  onChange={(e) => updateElement({ 
                    data: { ...element.data, fill: e.target.value }
                  })}
                  className="h-8"
                />
              </div>

              <div>
                <Label className="text-xs">Stroke</Label>
                <Input
                  type="color"
                  value={element.data.stroke || '#000000'}
                  onChange={(e) => updateElement({ 
                    data: { ...element.data, stroke: e.target.value }
                  })}
                  className="h-8"
                />
              </div>
            </CardContent>
          </Card>
        )}

        <Separator />

        {/* Actions */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateElement({ visible: !element.visible })}
              className="flex-1"
            >
              {element.visible ? <Eye className="w-4 h-4 mr-1" /> : <EyeOff className="w-4 h-4 mr-1" />}
              {element.visible ? 'Hide' : 'Show'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateElement({ locked: !element.locked })}
              className="flex-1"
            >
              {element.locked ? <Unlock className="w-4 h-4 mr-1" /> : <Lock className="w-4 h-4 mr-1" />}
              {element.locked ? 'Unlock' : 'Lock'}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onElementDuplicate(element.id)}
              className="flex-1"
            >
              <Copy className="w-4 h-4 mr-1" />
              Duplicate
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onElementDelete(element.id)}
              className="flex-1"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}