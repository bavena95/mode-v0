"use client"

import type React from "react"

import { useRef, useState } from "react"
import type { Layer } from "@/types/layers"
import { MaskRenderer } from "./mask-renderer"

interface LayerCanvasProps {
  layers: Layer[]
  selectedLayerIds: string[]
  canvasState: any
  maskPreviewMode?: "normal" | "mask" | "both"
  onLayerSelect: (layerId: string, multiSelect?: boolean) => void
  onLayerUpdate: (layerId: string, updates: Partial<Layer>) => void
}

export function LayerCanvas({
  layers,
  selectedLayerIds,
  canvasState,
  maskPreviewMode = "normal",
  onLayerSelect,
  onLayerUpdate,
}: LayerCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [draggedLayer, setDraggedLayer] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const visibleLayers = layers.filter((layer) => layer.visible).sort((a, b) => a.zIndex - b.zIndex)

  const handleLayerMouseDown = (e: React.MouseEvent, layerId: string) => {
    e.stopPropagation()

    const layer = layers.find((l) => l.id === layerId)
    if (!layer || layer.locked) return

    onLayerSelect(layerId, e.ctrlKey || e.metaKey)

    const rect = e.currentTarget.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setDraggedLayer(layerId)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedLayer || !canvasRef.current) return

    const canvasRect = canvasRef.current.getBoundingClientRect()
    const newPosition = {
      x: e.clientX - canvasRect.left - dragOffset.x,
      y: e.clientY - canvasRect.top - dragOffset.y,
    }

    onLayerUpdate(draggedLayer, { position: newPosition })
  }

  const handleMouseUp = () => {
    setDraggedLayer(null)
  }

  const getLayerStyle = (layer: Layer) => {
    const transform = `translate(${layer.position.x}px, ${layer.position.y}px) rotate(${layer.rotation}deg)`

    let filter = ""
    if (layer.data.filters) {
      filter = layer.data.filters.join(" ")
    }

    return {
      position: "absolute" as const,
      left: 0,
      top: 0,
      width: layer.size.width,
      height: layer.size.height,
      transform,
      opacity: layer.opacity / 100,
      mixBlendMode: layer.blendMode as any,
      filter,
      cursor: layer.locked ? "not-allowed" : "move",
      zIndex: layer.zIndex,
    }
  }

  const renderLayer = (layer: Layer) => {
    const isSelected = selectedLayerIds.includes(layer.id)

    switch (layer.type) {
      case "image":
        return (
          <div
            key={layer.id}
            style={getLayerStyle(layer)}
            onMouseDown={(e) => handleLayerMouseDown(e, layer.id)}
            className={`border-2 transition-all ${
              isSelected ? "border-teal-500" : "border-transparent hover:border-white/30"
            }`}
          >
            {layer.data.src && (
              <img
                src={layer.data.src || "/placeholder.svg"}
                alt={layer.name}
                className="w-full h-full object-cover pointer-events-none"
                draggable={false}
              />
            )}
            {isSelected && (
              <>
                {/* Selection handles */}
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-teal-500 border border-white rounded-sm"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-teal-500 border border-white rounded-sm"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-teal-500 border border-white rounded-sm"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-teal-500 border border-white rounded-sm"></div>
              </>
            )}
            {/* Mask Overlay */}
            {layer.masks && layer.masks.length > 0 && (
              <MaskRenderer layer={layer} previewMode={maskPreviewMode || "normal"} className="absolute inset-0" />
            )}
          </div>
        )

      case "text":
        return (
          <div
            key={layer.id}
            style={{
              ...getLayerStyle(layer),
              fontSize: layer.data.fontSize || 16,
              fontFamily: layer.data.fontFamily || "Inter",
              color: layer.data.color || "#ffffff",
              textAlign: layer.data.textAlign || "left",
            }}
            onMouseDown={(e) => handleLayerMouseDown(e, layer.id)}
            className={`border-2 transition-all flex items-center justify-center ${
              isSelected ? "border-teal-500" : "border-transparent hover:border-white/30"
            }`}
          >
            <span className="pointer-events-none select-none">{layer.data.text || "Text Layer"}</span>
            {isSelected && (
              <>
                {/* Selection handles */}
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-teal-500 border border-white rounded-sm"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-teal-500 border border-white rounded-sm"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-teal-500 border border-white rounded-sm"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-teal-500 border border-white rounded-sm"></div>
              </>
            )}
            {/* Mask Overlay */}
            {layer.masks && layer.masks.length > 0 && (
              <MaskRenderer layer={layer} previewMode={maskPreviewMode || "normal"} className="absolute inset-0" />
            )}
          </div>
        )

      case "shape":
        return (
          <div
            key={layer.id}
            style={getLayerStyle(layer)}
            onMouseDown={(e) => handleLayerMouseDown(e, layer.id)}
            className={`border-2 transition-all ${
              isSelected ? "border-teal-500" : "border-transparent hover:border-white/30"
            }`}
          >
            <div
              className="w-full h-full"
              style={{
                backgroundColor: layer.data.fill || "#ffffff",
                border: layer.data.stroke ? `${layer.data.strokeWidth || 1}px solid ${layer.data.stroke}` : "none",
                borderRadius: layer.data.shapeType === "circle" ? "50%" : "0",
              }}
            />
            {isSelected && (
              <>
                {/* Selection handles */}
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-teal-500 border border-white rounded-sm"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-teal-500 border border-white rounded-sm"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-teal-500 border border-white rounded-sm"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-teal-500 border border-white rounded-sm"></div>
              </>
            )}
            {/* Mask Overlay */}
            {layer.masks && layer.masks.length > 0 && (
              <MaskRenderer layer={layer} previewMode={maskPreviewMode || "normal"} className="absolute inset-0" />
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full overflow-hidden bg-transparent"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {visibleLayers.map(renderLayer)}
    </div>
  )
}
