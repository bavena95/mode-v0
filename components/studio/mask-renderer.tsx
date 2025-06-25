"use client"

import { useEffect, useRef } from "react"
import type { Layer, LayerMask } from "@/types/layers"

interface MaskRendererProps {
  layer: Layer
  previewMode: "normal" | "mask" | "both"
  className?: string
}

export function MaskRenderer({ layer, previewMode, className }: MaskRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !layer.masks || layer.masks.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")!

    // Set canvas size
    canvas.width = layer.size.width
    canvas.height = layer.size.height

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (previewMode === "normal") {
      // Don't render masks in normal mode
      return
    }

    // Render each mask
    layer.masks.forEach((mask, index) => {
      if (!mask.enabled) return

      ctx.save()

      // Apply mask opacity
      ctx.globalAlpha = mask.opacity / 100

      // Apply blend mode
      ctx.globalCompositeOperation = getMaskCompositeOperation(mask.blendMode)

      renderMask(ctx, mask, layer.size.width, layer.size.height)

      ctx.restore()
    })
  }, [layer, previewMode])

  const renderMask = (ctx: CanvasRenderingContext2D, mask: LayerMask, width: number, height: number) => {
    switch (mask.type) {
      case "alpha":
        if (mask.data.canvas) {
          ctx.drawImage(mask.data.canvas, 0, 0, width, height)
        }
        break

      case "vector":
        renderVectorMask(ctx, mask, width, height)
        break

      case "gradient":
        renderGradientMask(ctx, mask, width, height)
        break

      case "selection":
        renderSelectionMask(ctx, mask, width, height)
        break

      case "clipping":
        // Clipping masks are handled differently
        break
    }

    // Apply feather effect
    if (mask.feather > 0) {
      applyFeather(ctx, mask.feather, width, height)
    }

    // Apply invert
    if (mask.inverted) {
      invertMask(ctx, width, height)
    }
  }

  const renderVectorMask = (ctx: CanvasRenderingContext2D, mask: LayerMask, width: number, height: number) => {
    if (!mask.data.shapes) return

    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, width, height)

    ctx.fillStyle = "black"
    ctx.globalCompositeOperation = "multiply"

    mask.data.shapes.forEach((shape) => {
      ctx.beginPath()

      switch (shape.type) {
        case "rectangle":
          if (shape.points.length >= 2) {
            const [start, end] = shape.points
            ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y)
          }
          break

        case "ellipse":
          if (shape.points.length >= 2) {
            const [start, end] = shape.points
            const centerX = (start.x + end.x) / 2
            const centerY = (start.y + end.y) / 2
            const radiusX = Math.abs(end.x - start.x) / 2
            const radiusY = Math.abs(end.y - start.y) / 2
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2)
          }
          break

        case "polygon":
          if (shape.points.length >= 3) {
            ctx.moveTo(shape.points[0].x, shape.points[0].y)
            for (let i = 1; i < shape.points.length; i++) {
              ctx.lineTo(shape.points[i].x, shape.points[i].y)
            }
            ctx.closePath()
          }
          break
      }

      if (shape.fill) {
        ctx.fill()
      }
      if (shape.stroke) {
        ctx.stroke()
      }
    })
  }

  const renderGradientMask = (ctx: CanvasRenderingContext2D, mask: LayerMask, width: number, height: number) => {
    if (!mask.data.gradient) return

    const { gradient } = mask.data
    let grad: CanvasGradient

    switch (gradient.type) {
      case "linear":
        const angle = ((gradient.angle || 0) * Math.PI) / 180
        const x1 = width / 2 - (Math.cos(angle) * width) / 2
        const y1 = height / 2 - (Math.sin(angle) * height) / 2
        const x2 = width / 2 + (Math.cos(angle) * width) / 2
        const y2 = height / 2 + (Math.sin(angle) * height) / 2
        grad = ctx.createLinearGradient(x1, y1, x2, y2)
        break

      case "radial":
        const centerX = (gradient.center?.x || 0.5) * width
        const centerY = (gradient.center?.y || 0.5) * height
        const radius = (gradient.radius || 0.5) * Math.max(width, height)
        grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
        break

      case "conic":
        // Conic gradients need special handling
        grad = ctx.createLinearGradient(0, 0, width, 0)
        break

      default:
        return
    }

    gradient.stops.forEach((stop) => {
      const color = `rgba(${hexToRgb(stop.color)}, ${stop.opacity / 100})`
      grad.addColorStop(stop.position, color)
    })

    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)
  }

  const renderSelectionMask = (ctx: CanvasRenderingContext2D, mask: LayerMask, width: number, height: number) => {
    if (!mask.data.selection) return

    const { selection } = mask.data

    // Fill with black first
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, width, height)

    // Draw selection in white
    ctx.fillStyle = "white"
    ctx.beginPath()

    switch (selection.type) {
      case "rectangle":
        ctx.rect(selection.bounds.x, selection.bounds.y, selection.bounds.width, selection.bounds.height)
        break

      case "ellipse":
        const centerX = selection.bounds.x + selection.bounds.width / 2
        const centerY = selection.bounds.y + selection.bounds.height / 2
        const radiusX = selection.bounds.width / 2
        const radiusY = selection.bounds.height / 2
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2)
        break

      case "polygon":
      case "freehand":
        if (selection.points.length >= 3) {
          ctx.moveTo(selection.points[0].x, selection.points[0].y)
          for (let i = 1; i < selection.points.length; i++) {
            ctx.lineTo(selection.points[i].x, selection.points[i].y)
          }
          ctx.closePath()
        }
        break
    }

    ctx.fill()
  }

  const applyFeather = (ctx: CanvasRenderingContext2D, feather: number, width: number, height: number) => {
    if (feather <= 0) return

    // Apply blur filter for feathering effect
    ctx.filter = `blur(${feather}px)`
    const imageData = ctx.getImageData(0, 0, width, height)
    ctx.filter = "none"
    ctx.putImageData(imageData, 0, 0)
  }

  const invertMask = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i] // Red
      data[i + 1] = 255 - data[i + 1] // Green
      data[i + 2] = 255 - data[i + 2] // Blue
      // Alpha stays the same
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const getMaskCompositeOperation = (blendMode: LayerMask["blendMode"]): GlobalCompositeOperation => {
    switch (blendMode) {
      case "multiply":
        return "multiply"
      case "screen":
        return "screen"
      case "overlay":
        return "overlay"
      case "soft-light":
        return "soft-light"
      case "hard-light":
        return "hard-light"
      default:
        return "source-over"
    }
  }

  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? `${Number.parseInt(result[1], 16)}, ${Number.parseInt(result[2], 16)}, ${Number.parseInt(result[3], 16)}`
      : "0, 0, 0"
  }

  if (previewMode === "normal") {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        mixBlendMode: previewMode === "both" ? "multiply" : "normal",
        opacity: previewMode === "both" ? 0.5 : 1,
      }}
    />
  )
}
