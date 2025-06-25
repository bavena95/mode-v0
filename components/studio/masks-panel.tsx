"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu"
import {
  Plus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  RotateCcw,
  Paintbrush,
  Square,
  Circle,
  Layers,
  Palette,
  MousePointer,
  Move,
  Scissors,
} from "lucide-react"
import type { Layer, LayerMask, MaskBlendMode } from "@/types/layers"

interface MasksPanelProps {
  selectedLayer: Layer | null
  selectedMaskId: string | null
  maskPreviewMode: "normal" | "mask" | "both"
  brushSize: number
  brushHardness: number
  brushOpacity: number
  onMaskSelect: (maskId: string | null) => void
  onMaskCreate: (type: LayerMask["type"]) => void
  onMaskUpdate: (maskId: string, updates: Partial<LayerMask>) => void
  onMaskDelete: (maskId: string) => void
  onMaskDuplicate: (maskId: string) => void
  onPreviewModeChange: (mode: "normal" | "mask" | "both") => void
  onBrushSizeChange: (size: number) => void
  onBrushHardnessChange: (hardness: number) => void
  onBrushOpacityChange: (opacity: number) => void
}

const MASK_TYPES = [
  { value: "alpha", label: "Alpha Mask", icon: Paintbrush, description: "Paint-based transparency mask" },
  { value: "vector", label: "Vector Mask", icon: Square, description: "Shape-based vector mask" },
  { value: "clipping", label: "Clipping Mask", icon: Scissors, description: "Use layer as clipping mask" },
  { value: "gradient", label: "Gradient Mask", icon: Palette, description: "Gradient-based mask" },
  { value: "selection", label: "Selection Mask", icon: MousePointer, description: "Selection-based mask" },
] as const

const BLEND_MODES: { value: MaskBlendMode; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "multiply", label: "Multiply" },
  { value: "screen", label: "Screen" },
  { value: "overlay", label: "Overlay" },
  { value: "soft-light", label: "Soft Light" },
  { value: "hard-light", label: "Hard Light" },
]

const getMaskIcon = (type: LayerMask["type"]) => {
  const maskType = MASK_TYPES.find((t) => t.value === type)
  return maskType?.icon || Layers
}

export function MasksPanel({
  selectedLayer,
  selectedMaskId,
  maskPreviewMode,
  brushSize,
  brushHardness,
  brushOpacity,
  onMaskSelect,
  onMaskCreate,
  onMaskUpdate,
  onMaskDelete,
  onMaskDuplicate,
  onPreviewModeChange,
  onBrushSizeChange,
  onBrushHardnessChange,
  onBrushOpacityChange,
}: MasksPanelProps) {
  const [selectedMaskType, setSelectedMaskType] = useState<LayerMask["type"]>("alpha")

  const selectedMask = selectedLayer?.masks?.find((m) => m.id === selectedMaskId)

  if (!selectedLayer) {
    return (
      <div className="p-6 text-center">
        <Layers className="w-8 h-8 text-gray-500 mx-auto mb-3" />
        <p className="text-sm text-gray-500">Select a layer to manage masks</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Label className="text-white font-semibold text-lg flex items-center gap-2">
          <Layers className="w-5 h-5" />
          Layer Masks
        </Label>
        <div className="flex items-center gap-1">
          <Select value={selectedMaskType} onValueChange={(value: LayerMask["type"]) => setSelectedMaskType(value)}>
            <SelectTrigger className="w-24 h-8 bg-white/5 border-white/10 text-white text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10">
              {MASK_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value} className="text-xs">
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMaskCreate(selectedMaskType)}
            className="text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 h-8 w-8 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Preview Mode Controls */}
      <div className="space-y-3">
        <Label className="text-sm text-gray-400 font-medium">Preview Mode</Label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "normal", label: "Normal", icon: Eye },
            { value: "mask", label: "Mask", icon: Layers },
            { value: "both", label: "Both", icon: Copy },
          ].map(({ value, label, icon: Icon }) => (
            <Button
              key={value}
              variant="outline"
              size="sm"
              onClick={() => onPreviewModeChange(value as any)}
              className={`h-10 flex flex-col gap-1 rounded-xl transition-all ${
                maskPreviewMode === value
                  ? "border-teal-500/50 bg-teal-500/20 text-white"
                  : "border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/10"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs">{label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Masks List */}
      <div className="space-y-2">
        <Label className="text-sm text-gray-400 font-medium">Masks ({selectedLayer.masks?.length || 0})</Label>

        {!selectedLayer.masks || selectedLayer.masks.length === 0 ? (
          <div className="text-center py-8">
            <Layers className="w-8 h-8 text-gray-500 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No masks applied</p>
            <p className="text-xs text-gray-600 mt-1">Add a mask to get started</p>
          </div>
        ) : (
          <ScrollArea className="h-48">
            <div className="space-y-2">
              {selectedLayer.masks.map((mask) => {
                const Icon = getMaskIcon(mask.type)
                const isSelected = selectedMaskId === mask.id

                return (
                  <ContextMenu key={mask.id}>
                    <ContextMenuTrigger>
                      <div
                        onClick={() => onMaskSelect(isSelected ? null : mask.id)}
                        className={`group flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? "border-teal-500/50 bg-teal-500/10"
                            : "border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {/* Mask Thumbnail */}
                        <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {mask.thumbnail ? (
                            <img
                              src={mask.thumbnail || "/placeholder.svg"}
                              alt={mask.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Icon className="w-5 h-5 text-gray-300" />
                          )}
                        </div>

                        {/* Mask Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm text-white font-medium truncate">{mask.name}</p>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onMaskUpdate(mask.id, { enabled: !mask.enabled })
                                }}
                                className="text-gray-400 hover:text-white h-6 w-6 p-0"
                              >
                                {mask.enabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400 capitalize">{mask.type}</span>
                              {mask.inverted && (
                                <span className="text-xs text-orange-400 bg-orange-500/20 px-1 rounded">Inverted</span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">{mask.opacity}%</span>
                          </div>
                        </div>

                        {/* Status Indicators */}
                        <div className="flex flex-col gap-1">
                          {!mask.enabled && <EyeOff className="w-3 h-3 text-gray-500" />}
                          {mask.feather > 0 && <div className="w-2 h-2 bg-blue-400 rounded-full" title="Feathered" />}
                        </div>
                      </div>
                    </ContextMenuTrigger>

                    <ContextMenuContent className="bg-slate-900 border-slate-700">
                      <ContextMenuItem onClick={() => onMaskDuplicate(mask.id)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate Mask
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => onMaskUpdate(mask.id, { inverted: !mask.inverted })}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        {mask.inverted ? "Remove Invert" : "Invert Mask"}
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem onClick={() => onMaskUpdate(mask.id, { enabled: !mask.enabled })}>
                        {mask.enabled ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                        {mask.enabled ? "Disable" : "Enable"} Mask
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem onClick={() => onMaskDelete(mask.id)} className="text-red-400">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Mask
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Mask Properties */}
      {selectedMask && (
        <div className="space-y-4 p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-gray-400 font-medium">Mask Properties</Label>
            <span className="text-xs text-gray-500 capitalize">{selectedMask.type}</span>
          </div>

          <Tabs defaultValue="properties" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 rounded-xl">
              <TabsTrigger value="properties" className="data-[state=active]:bg-teal-500 rounded-lg text-xs">
                Properties
              </TabsTrigger>
              <TabsTrigger value="tools" className="data-[state=active]:bg-teal-500 rounded-lg text-xs">
                Tools
              </TabsTrigger>
            </TabsList>

            <TabsContent value="properties" className="space-y-4 mt-4">
              {/* Opacity */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs text-gray-400">Opacity</Label>
                  <span className="text-xs text-white">{selectedMask.opacity}%</span>
                </div>
                <Slider
                  value={[selectedMask.opacity]}
                  onValueChange={([opacity]) => onMaskUpdate(selectedMask.id, { opacity })}
                  max={100}
                  min={0}
                  className="w-full"
                />
              </div>

              {/* Feather */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs text-gray-400">Feather</Label>
                  <span className="text-xs text-white">{selectedMask.feather}px</span>
                </div>
                <Slider
                  value={[selectedMask.feather]}
                  onValueChange={([feather]) => onMaskUpdate(selectedMask.id, { feather })}
                  max={50}
                  min={0}
                  className="w-full"
                />
              </div>

              {/* Blend Mode */}
              <div>
                <Label className="text-xs text-gray-400 mb-2 block">Blend Mode</Label>
                <Select
                  value={selectedMask.blendMode}
                  onValueChange={(blendMode: MaskBlendMode) => onMaskUpdate(selectedMask.id, { blendMode })}
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

              {/* Invert */}
              <div className="flex items-center justify-between">
                <Label className="text-xs text-gray-400">Invert Mask</Label>
                <Switch
                  checked={selectedMask.inverted}
                  onCheckedChange={(inverted) => onMaskUpdate(selectedMask.id, { inverted })}
                />
              </div>
            </TabsContent>

            <TabsContent value="tools" className="space-y-4 mt-4">
              {selectedMask.type === "alpha" && (
                <>
                  {/* Brush Size */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs text-gray-400">Brush Size</Label>
                      <span className="text-xs text-white">{brushSize}px</span>
                    </div>
                    <Slider
                      value={[brushSize]}
                      onValueChange={([size]) => onBrushSizeChange(size)}
                      max={200}
                      min={1}
                      className="w-full"
                    />
                  </div>

                  {/* Brush Hardness */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs text-gray-400">Hardness</Label>
                      <span className="text-xs text-white">{brushHardness}%</span>
                    </div>
                    <Slider
                      value={[brushHardness]}
                      onValueChange={([hardness]) => onBrushHardnessChange(hardness)}
                      max={100}
                      min={0}
                      className="w-full"
                    />
                  </div>

                  {/* Brush Opacity */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs text-gray-400">Brush Opacity</Label>
                      <span className="text-xs text-white">{brushOpacity}%</span>
                    </div>
                    <Slider
                      value={[brushOpacity]}
                      onValueChange={([opacity]) => onBrushOpacityChange(opacity)}
                      max={100}
                      min={1}
                      className="w-full"
                    />
                  </div>

                  {/* Brush Tools */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/10 rounded-lg"
                    >
                      <Paintbrush className="w-4 h-4 mr-2" />
                      Paint
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/10 rounded-lg"
                    >
                      <Circle className="w-4 h-4 mr-2" />
                      Erase
                    </Button>
                  </div>
                </>
              )}

              {selectedMask.type === "vector" && (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/10 rounded-lg"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Rectangle
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/10 rounded-lg"
                  >
                    <Circle className="w-4 h-4 mr-2" />
                    Ellipse
                  </Button>
                </div>
              )}

              {selectedMask.type === "selection" && (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/10 rounded-lg"
                  >
                    <MousePointer className="w-4 h-4 mr-2" />
                    Select
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/10 rounded-lg"
                  >
                    <Move className="w-4 h-4 mr-2" />
                    Transform
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Quick Actions */}
      <div className="pt-4 border-t border-white/10">
        <Label className="text-sm text-gray-400 mb-3 block">Quick Actions</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMaskCreate("alpha")}
            className="h-10 border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/10 rounded-lg"
          >
            <Paintbrush className="w-4 h-4 mr-2" />
            Paint Mask
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMaskCreate("vector")}
            className="h-10 border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/10 rounded-lg"
          >
            <Square className="w-4 h-4 mr-2" />
            Shape Mask
          </Button>
        </div>
      </div>
    </div>
  )
}
