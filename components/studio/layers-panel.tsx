"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu"
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Copy,
  Folder,
  ImageIcon,
  Type,
  Square,
  Settings,
  Layers3,
} from "lucide-react"
import type { Layer, LayerGroup, BlendMode } from "@/types/layers"

interface LayersPanelProps {
  layers: Layer[]
  groups: LayerGroup[]
  selectedLayerIds: string[]
  onLayerSelect: (layerId: string, multiSelect?: boolean) => void
  onLayerUpdate: (layerId: string, updates: Partial<Layer>) => void
  onLayerRemove: (layerId: string) => void
  onLayerDuplicate: (layerId: string) => void
  onLayerReorder: (draggedId: string, targetId: string, position: "above" | "below") => void
  onLayerAdd: (type: Layer["type"]) => void
  onGroupCreate: (layerIds: string[]) => void
  onGroupUngroup: (groupId: string) => void
}

const BLEND_MODES: { value: BlendMode; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "multiply", label: "Multiply" },
  { value: "screen", label: "Screen" },
  { value: "overlay", label: "Overlay" },
  { value: "soft-light", label: "Soft Light" },
  { value: "hard-light", label: "Hard Light" },
  { value: "color-dodge", label: "Color Dodge" },
  { value: "color-burn", label: "Color Burn" },
  { value: "darken", label: "Darken" },
  { value: "lighten", label: "Lighten" },
  { value: "difference", label: "Difference" },
  { value: "exclusion", label: "Exclusion" },
]

const getLayerIcon = (type: Layer["type"]) => {
  switch (type) {
    case "image":
      return ImageIcon
    case "text":
      return Type
    case "shape":
      return Square
    case "adjustment":
      return Settings
    default:
      return Layers3
  }
}

export function LayersPanel({
  layers,
  groups,
  selectedLayerIds,
  onLayerSelect,
  onLayerUpdate,
  onLayerRemove,
  onLayerDuplicate,
  onLayerReorder,
  onLayerAdd,
  onGroupCreate,
  onGroupUngroup,
}: LayersPanelProps) {
  const [draggedLayer, setDraggedLayer] = useState<string | null>(null)
  const [dragOverLayer, setDragOverLayer] = useState<string | null>(null)
  const [dragPosition, setDragPosition] = useState<"above" | "below">("below")
  const dragCounter = useRef(0)

  const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex)

  const handleDragStart = (e: React.DragEvent, layerId: string) => {
    setDraggedLayer(layerId)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", layerId)
  }

  const handleDragOver = (e: React.DragEvent, layerId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"

    const rect = e.currentTarget.getBoundingClientRect()
    const y = e.clientY - rect.top
    const position = y < rect.height / 2 ? "above" : "below"

    setDragOverLayer(layerId)
    setDragPosition(position)
  }

  const handleDragLeave = () => {
    dragCounter.current -= 1
    if (dragCounter.current === 0) {
      setDragOverLayer(null)
    }
  }

  const handleDragEnter = () => {
    dragCounter.current += 1
  }

  const handleDrop = (e: React.DragEvent, targetLayerId: string) => {
    e.preventDefault()
    const draggedLayerId = e.dataTransfer.getData("text/plain")

    if (draggedLayerId && draggedLayerId !== targetLayerId) {
      onLayerReorder(draggedLayerId, targetLayerId, dragPosition)
    }

    setDraggedLayer(null)
    setDragOverLayer(null)
    dragCounter.current = 0
  }

  const handleLayerClick = (e: React.MouseEvent, layerId: string) => {
    onLayerSelect(layerId, e.ctrlKey || e.metaKey)
  }

  const selectedLayer = selectedLayerIds.length === 1 ? layers.find((l) => l.id === selectedLayerIds[0]) : null

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Label className="text-white font-semibold text-lg flex items-center gap-2">
          <Layers3 className="w-5 h-5" />
          Layers
        </Label>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLayerAdd("image")}
            className="text-gray-400 hover:text-white h-8 w-8 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => selectedLayerIds.length > 1 && onGroupCreate(selectedLayerIds)}
            disabled={selectedLayerIds.length < 2}
            className="text-gray-400 hover:text-white h-8 w-8 p-0 disabled:opacity-50"
          >
            <Folder className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Layer Properties */}
      {selectedLayer && (
        <div className="space-y-4 p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-gray-400 font-medium">Layer Properties</Label>
            <span className="text-xs text-gray-500 capitalize">{selectedLayer.type}</span>
          </div>

          {/* Opacity */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-gray-400">Opacity</Label>
              <span className="text-xs text-white">{selectedLayer.opacity}%</span>
            </div>
            <Slider
              value={[selectedLayer.opacity]}
              onValueChange={([opacity]) => onLayerUpdate(selectedLayer.id, { opacity })}
              max={100}
              min={0}
              className="w-full"
            />
          </div>

          {/* Blend Mode */}
          <div>
            <Label className="text-xs text-gray-400 mb-2 block">Blend Mode</Label>
            <Select
              value={selectedLayer.blendMode}
              onValueChange={(blendMode: BlendMode) => onLayerUpdate(selectedLayer.id, { blendMode })}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white text-xs h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                {BLEND_MODES.map((mode) => (
                  <SelectItem key={mode.value} value={mode.value} className="text-xs">
                    {mode.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Layers List */}
      <div className="space-y-1">
        <ScrollArea className="h-96">
          {sortedLayers.length === 0 ? (
            <div className="text-center py-8">
              <Layers3 className="w-8 h-8 text-gray-500 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No layers yet</p>
              <p className="text-xs text-gray-600 mt-1">Add a layer to get started</p>
            </div>
          ) : (
            <div className="space-y-1">
              {sortedLayers.map((layer) => {
                const Icon = getLayerIcon(layer.type)
                const isSelected = selectedLayerIds.includes(layer.id)
                const isDragged = draggedLayer === layer.id
                const isDragOver = dragOverLayer === layer.id

                return (
                  <ContextMenu key={layer.id}>
                    <ContextMenuTrigger>
                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, layer.id)}
                        onDragOver={(e) => handleDragOver(e, layer.id)}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, layer.id)}
                        onClick={(e) => handleLayerClick(e, layer.id)}
                        className={`group flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? "border-teal-500/50 bg-teal-500/10"
                            : "border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10"
                        } ${isDragged ? "opacity-50 scale-95" : ""} ${
                          isDragOver
                            ? dragPosition === "above"
                              ? "border-t-teal-500 border-t-2"
                              : "border-b-teal-500 border-b-2"
                            : ""
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {layer.thumbnail ? (
                            <img
                              src={layer.thumbnail || "/placeholder.svg"}
                              alt={layer.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Icon className="w-5 h-5 text-gray-300" />
                          )}
                        </div>

                        {/* Layer Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm text-white font-medium truncate">{layer.name}</p>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onLayerUpdate(layer.id, { visible: !layer.visible })
                                }}
                                className="text-gray-400 hover:text-white h-6 w-6 p-0"
                              >
                                {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onLayerUpdate(layer.id, { locked: !layer.locked })
                                }}
                                className="text-gray-400 hover:text-white h-6 w-6 p-0"
                              >
                                {layer.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400 capitalize">{layer.type}</span>
                              {layer.blendMode !== "normal" && (
                                <span className="text-xs text-teal-400 bg-teal-500/20 px-1 rounded">
                                  {layer.blendMode}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">{layer.opacity}%</span>
                          </div>
                        </div>

                        {/* Layer Status Indicators */}
                        <div className="flex flex-col gap-1">
                          {!layer.visible && <EyeOff className="w-3 h-3 text-gray-500" />}
                          {layer.locked && <Lock className="w-3 h-3 text-gray-500" />}
                          {layer.effects.length > 0 && (
                            <div className="w-2 h-2 bg-yellow-400 rounded-full" title="Has effects" />
                          )}
                        </div>
                      </div>
                    </ContextMenuTrigger>

                    <ContextMenuContent className="bg-slate-900 border-slate-700">
                      <ContextMenuItem onClick={() => onLayerDuplicate(layer.id)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate Layer
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => onLayerRemove(layer.id)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Layer
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem onClick={() => onLayerUpdate(layer.id, { visible: !layer.visible })}>
                        {layer.visible ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                        {layer.visible ? "Hide" : "Show"} Layer
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => onLayerUpdate(layer.id, { locked: !layer.locked })}>
                        {layer.locked ? <Unlock className="w-4 h-4 mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                        {layer.locked ? "Unlock" : "Lock"} Layer
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Add Layer Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onLayerAdd("image")}
          className="h-10 border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/10 rounded-lg"
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Image
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onLayerAdd("text")}
          className="h-10 border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/10 rounded-lg"
        >
          <Type className="w-4 h-4 mr-2" />
          Text
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onLayerAdd("shape")}
          className="h-10 border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/10 rounded-lg"
        >
          <Square className="w-4 h-4 mr-2" />
          Shape
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onLayerAdd("adjustment")}
          className="h-10 border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/10 rounded-lg"
        >
          <Settings className="w-4 h-4 mr-2" />
          Adjustment
        </Button>
      </div>
    </div>
  )
}
