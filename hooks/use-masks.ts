"use client"

import { useState, useCallback, useRef } from "react"
import type { LayerMask, GradientStop } from "@/types/layers"

export function useMasks() {
  const [selectedMaskId, setSelectedMaskId] = useState<string | null>(null)
  const [maskPreviewMode, setMaskPreviewMode] = useState<"normal" | "mask" | "both">("normal")
  const [brushSize, setBrushSize] = useState(20)
  const [brushHardness, setBrushHardness] = useState(100)
  const [brushOpacity, setBrushOpacity] = useState(100)
  const maskIdCounter = useRef(0)

  const generateMaskId = useCallback(() => {
    maskIdCounter.current += 1
    return `mask_${maskIdCounter.current}`
  }, [])

  const createAlphaMask = useCallback(
    (width: number, height: number, fill = "white"): LayerMask => {
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")!

      ctx.fillStyle = fill
      ctx.fillRect(0, 0, width, height)

      return {
        id: generateMaskId(),
        type: "alpha",
        name: "Alpha Mask",
        enabled: true,
        inverted: false,
        opacity: 100,
        feather: 0,
        blendMode: "normal",
        data: {
          canvas,
          imageData: ctx.getImageData(0, 0, width, height),
        },
      }
    },
    [generateMaskId],
  )

  const createVectorMask = useCallback(
    (shapes: any[] = []): LayerMask => {
      return {
        id: generateMaskId(),
        type: "vector",
        name: "Vector Mask",
        enabled: true,
        inverted: false,
        opacity: 100,
        feather: 0,
        blendMode: "normal",
        data: {
          shapes,
          path: "",
        },
      }
    },
    [generateMaskId],
  )

  const createClippingMask = useCallback((): LayerMask => {
    return {
      id: generateMaskId(),
      type: "clipping",
      name: "Clipping Mask",
      enabled: true,
      inverted: false,
      opacity: 100,
      feather: 0,
      blendMode: "normal",
      data: {},
    }
  }, [generateMaskId])

  const createGradientMask = useCallback(
    (
      type: "linear" | "radial" | "conic" = "linear",
      stops: GradientStop[] = [
        { position: 0, color: "#000000", opacity: 100 },
        { position: 1, color: "#ffffff", opacity: 100 },
      ],
    ): LayerMask => {
      return {
        id: generateMaskId(),
        type: "gradient",
        name: "Gradient Mask",
        enabled: true,
        inverted: false,
        opacity: 100,
        feather: 0,
        blendMode: "normal",
        data: {
          gradient: {
            type,
            stops,
            angle: 0,
            center: { x: 0.5, y: 0.5 },
            radius: 0.5,
          },
        },
      }
    },
    [generateMaskId],
  )

  const createSelectionMask = useCallback(
    (
      type: "rectangle" | "ellipse" | "polygon" | "freehand",
      points: { x: number; y: number }[],
      bounds: { x: number; y: number; width: number; height: number },
    ): LayerMask => {
      return {
        id: generateMaskId(),
        type: "selection",
        name: "Selection Mask",
        enabled: true,
        inverted: false,
        opacity: 100,
        feather: 0,
        blendMode: "normal",
        data: {
          selection: {
            type,
            points,
            bounds,
          },
        },
      }
    },
    [generateMaskId],
  )

  const updateMask = useCallback((maskId: string, updates: Partial<LayerMask>) => {
    // Esta função será implementada no componente pai
    console.log("Update mask:", maskId, updates)
  }, [])

  const deleteMask = useCallback((maskId: string) => {
    console.log("Delete mask:", maskId)
  }, [])

  const duplicateMask = useCallback(
    (mask: LayerMask): LayerMask => {
      return {
        ...mask,
        id: generateMaskId(),
        name: `${mask.name} copy`,
      }
    },
    [generateMaskId],
  )

  const invertMask = useCallback(
    (maskId: string) => {
      updateMask(maskId, { inverted: true })
    },
    [updateMask],
  )

  const applyMask = useCallback((maskId: string) => {
    console.log("Apply mask:", maskId)
  }, [])

  const paintOnMask = useCallback(
    (mask: LayerMask, x: number, y: number, color = "white", erase = false) => {
      if (mask.type !== "alpha" || !mask.data.canvas) return

      const canvas = mask.data.canvas
      const ctx = canvas.getContext("2d")!

      ctx.globalCompositeOperation = erase ? "destination-out" : "source-over"
      ctx.fillStyle = color
      ctx.globalAlpha = brushOpacity / 100

      // Create soft brush
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, brushSize / 2)
      const hardness = brushHardness / 100
      gradient.addColorStop(0, color)
      gradient.addColorStop(hardness, color)
      gradient.addColorStop(1, "transparent")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2)
      ctx.fill()

      // Update image data
      mask.data.imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    },
    [brushSize, brushHardness, brushOpacity],
  )

  const generateMaskThumbnail = useCallback((mask: LayerMask): string => {
    if (mask.type === "alpha" && mask.data.canvas) {
      return mask.data.canvas.toDataURL()
    }

    // Generate thumbnail for other mask types
    const canvas = document.createElement("canvas")
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext("2d")!

    switch (mask.type) {
      case "vector":
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, 64, 64)
        ctx.fillStyle = "#000000"
        ctx.fillRect(8, 8, 48, 48)
        break
      case "gradient":
        const gradient = ctx.createLinearGradient(0, 0, 64, 64)
        gradient.addColorStop(0, "#000000")
        gradient.addColorStop(1, "#ffffff")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 64, 64)
        break
      default:
        ctx.fillStyle = "#808080"
        ctx.fillRect(0, 0, 64, 64)
    }

    return canvas.toDataURL()
  }, [])

  return {
    selectedMaskId,
    setSelectedMaskId,
    maskPreviewMode,
    setMaskPreviewMode,
    brushSize,
    setBrushSize,
    brushHardness,
    setBrushHardness,
    brushOpacity,
    setBrushOpacity,
    createAlphaMask,
    createVectorMask,
    createClippingMask,
    createGradientMask,
    createSelectionMask,
    updateMask,
    deleteMask,
    duplicateMask,
    invertMask,
    applyMask,
    paintOnMask,
    generateMaskThumbnail,
  }
}
