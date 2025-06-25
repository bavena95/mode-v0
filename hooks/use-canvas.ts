"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"

export interface CanvasState {
  zoom: number
  pan: { x: number; y: number }
  rotation: number
  brightness: number
  contrast: number
  saturation: number
  blur: number
  filters: string[]
}

export function useCanvas() {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    zoom: 100,
    pan: { x: 0, y: 0 },
    rotation: 0,
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    filters: [],
  })

  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)

  const updateCanvas = useCallback((updates: Partial<CanvasState>) => {
    setCanvasState((prev) => ({ ...prev, ...updates }))
  }, [])

  const resetCanvas = useCallback(() => {
    setCanvasState({
      zoom: 100,
      pan: { x: 0, y: 0 },
      rotation: 0,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      filters: [],
    })
  }, [])

  const zoomIn = useCallback(() => {
    setCanvasState((prev) => ({
      ...prev,
      zoom: Math.min(prev.zoom + 25, 500),
    }))
  }, [])

  const zoomOut = useCallback(() => {
    setCanvasState((prev) => ({
      ...prev,
      zoom: Math.max(prev.zoom - 25, 25),
    }))
  }, [])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 0) {
        // Left click for panning
        setIsDragging(true)
        setDragStart({ x: e.clientX - canvasState.pan.x, y: e.clientY - canvasState.pan.y })
      }
    },
    [canvasState.pan],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        setCanvasState((prev) => ({
          ...prev,
          pan: {
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
          },
        }))
      }
    },
    [isDragging, dragStart],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -10 : 10
    setCanvasState((prev) => ({
      ...prev,
      zoom: Math.max(25, Math.min(500, prev.zoom + delta)),
    }))
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "=":
          case "+":
            e.preventDefault()
            zoomIn()
            break
          case "-":
            e.preventDefault()
            zoomOut()
            break
          case "0":
            e.preventDefault()
            updateCanvas({ zoom: 100, pan: { x: 0, y: 0 } })
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [zoomIn, zoomOut, updateCanvas])

  const getCanvasStyle = useCallback(() => {
    const { zoom, pan, rotation, brightness, contrast, saturation, blur, filters } = canvasState

    const filterString = [
      `brightness(${brightness}%)`,
      `contrast(${contrast}%)`,
      `saturate(${saturation}%)`,
      `blur(${blur}px)`,
      ...filters,
    ].join(" ")

    return {
      transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100}) rotate(${rotation}deg)`,
      filter: filterString,
      transition: isDragging ? "none" : "transform 0.2s ease-out",
      cursor: isDragging ? "grabbing" : "grab",
    }
  }, [canvasState, isDragging])

  return {
    canvasState,
    updateCanvas,
    resetCanvas,
    zoomIn,
    zoomOut,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    getCanvasStyle,
    canvasRef,
    isDragging,
  }
}
