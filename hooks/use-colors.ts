"use client"

import { useState, useCallback, useRef } from "react"
import type { ColorValue, ColorPalette, ColorHarmony, Gradient, ColorHistory, ColorModel } from "@/types/colors"
import { ColorUtils } from "@/lib/color-utils"

export function useColors() {
  const [currentColor, setCurrentColor] = useState<ColorValue>(
    ColorUtils.createColorValue("#3B82F6"), // Default blue
  )
  const [colorModel, setColorModel] = useState<ColorModel>("hex")
  const [colorHistory, setColorHistory] = useState<ColorHistory>({
    colors: [],
    maxSize: 20,
  })
  const [palettes, setPalettes] = useState<ColorPalette[]>([])
  const [currentHarmony, setCurrentHarmony] = useState<ColorHarmony | null>(null)
  const [gradients, setGradients] = useState<Gradient[]>([])
  const [showEyedropper, setShowEyedropper] = useState(false)
  const paletteIdCounter = useRef(0)
  const gradientIdCounter = useRef(0)

  const generatePaletteId = useCallback(() => {
    paletteIdCounter.current += 1
    return `palette_${paletteIdCounter.current}`
  }, [])

  const generateGradientId = useCallback(() => {
    gradientIdCounter.current += 1
    return `gradient_${gradientIdCounter.current}`
  }, [])

  const updateCurrentColor = useCallback((color: ColorValue) => {
    setCurrentColor(color)

    // Add to history
    setColorHistory((prev) => {
      const newColors = [color, ...prev.colors.filter((c) => c.hex !== color.hex)]
      return {
        ...prev,
        colors: newColors.slice(0, prev.maxSize),
      }
    })
  }, [])

  const setColorFromHex = useCallback(
    (hex: string) => {
      const color = ColorUtils.createColorValue(hex, currentColor.alpha)
      updateCurrentColor(color)
    },
    [currentColor.alpha, updateCurrentColor],
  )

  const setColorFromRgb = useCallback(
    (r: number, g: number, b: number) => {
      const hex = ColorUtils.rgbToHex(r, g, b)
      const color = ColorUtils.createColorValue(hex, currentColor.alpha)
      updateCurrentColor(color)
    },
    [currentColor.alpha, updateCurrentColor],
  )

  const setColorFromHsl = useCallback(
    (h: number, s: number, l: number) => {
      const rgb = ColorUtils.hslToRgb(h, s, l)
      const hex = ColorUtils.rgbToHex(rgb.r, rgb.g, rgb.b)
      const color = ColorUtils.createColorValue(hex, currentColor.alpha)
      updateCurrentColor(color)
    },
    [currentColor.alpha, updateCurrentColor],
  )

  const setAlpha = useCallback(
    (alpha: number) => {
      const color = { ...currentColor, alpha }
      updateCurrentColor(color)
    },
    [currentColor, updateCurrentColor],
  )

  const generateHarmony = useCallback(
    (type: ColorHarmony["type"], baseColor?: ColorValue) => {
      const color = baseColor || currentColor
      const harmony = ColorUtils.generateHarmony(color, type)
      setCurrentHarmony(harmony)
      return harmony
    },
    [currentColor],
  )

  const createPalette = useCallback(
    (name: string, colors: ColorValue[], type: ColorPalette["type"] = "custom") => {
      const palette: ColorPalette = {
        id: generatePaletteId(),
        name,
        colors,
        type,
        createdAt: new Date(),
        tags: [],
      }
      setPalettes((prev) => [...prev, palette])
      return palette
    },
    [generatePaletteId],
  )

  const updatePalette = useCallback((paletteId: string, updates: Partial<ColorPalette>) => {
    setPalettes((prev) => prev.map((p) => (p.id === paletteId ? { ...p, ...updates } : p)))
  }, [])

  const deletePalette = useCallback((paletteId: string) => {
    setPalettes((prev) => prev.filter((p) => p.id !== paletteId))
  }, [])

  const addColorToPalette = useCallback((paletteId: string, color: ColorValue) => {
    setPalettes((prev) => prev.map((p) => (p.id === paletteId ? { ...p, colors: [...p.colors, color] } : p)))
  }, [])

  const removeColorFromPalette = useCallback((paletteId: string, colorIndex: number) => {
    setPalettes((prev) =>
      prev.map((p) => (p.id === paletteId ? { ...p, colors: p.colors.filter((_, i) => i !== colorIndex) } : p)),
    )
  }, [])

  const createGradient = useCallback(
    (name: string, type: Gradient["type"], stops: Gradient["stops"]) => {
      const gradient: Gradient = {
        id: generateGradientId(),
        name,
        type,
        stops,
        angle: type === "linear" ? 0 : undefined,
        center: type !== "linear" ? { x: 0.5, y: 0.5 } : undefined,
        radius: type === "radial" ? 0.5 : undefined,
      }
      setGradients((prev) => [...prev, gradient])
      return gradient
    },
    [generateGradientId],
  )

  const updateGradient = useCallback((gradientId: string, updates: Partial<Gradient>) => {
    setGradients((prev) => prev.map((g) => (g.id === gradientId ? { ...g, ...updates } : g)))
  }, [])

  const deleteGradient = useCallback((gradientId: string) => {
    setGradients((prev) => prev.filter((g) => g.id !== gradientId))
  }, [])

  const extractColorsFromImage = useCallback(
    async (imageUrl: string, maxColors = 8) => {
      try {
        const colors = await ColorUtils.extractColorsFromImage(imageUrl, maxColors)
        const palette = createPalette(`Extracted from image`, colors, "extracted")
        return palette
      } catch (error) {
        console.error("Failed to extract colors:", error)
        return null
      }
    },
    [createPalette],
  )

  const startEyedropper = useCallback(async () => {
    if (!("EyeDropper" in window)) {
      console.warn("EyeDropper API not supported")
      return
    }

    try {
      setShowEyedropper(true)
      // @ts-ignore - EyeDropper is not in TypeScript types yet
      const eyeDropper = new EyeDropper()
      const result = await eyeDropper.open()

      if (result.sRGBHex) {
        setColorFromHex(result.sRGBHex)
      }
    } catch (error) {
      console.error("Eyedropper failed:", error)
    } finally {
      setShowEyedropper(false)
    }
  }, [setColorFromHex])

  const getContrastRatio = useCallback((color1: ColorValue, color2: ColorValue) => {
    return ColorUtils.getContrastRatio(color1, color2)
  }, [])

  const clearHistory = useCallback(() => {
    setColorHistory((prev) => ({ ...prev, colors: [] }))
  }, [])

  return {
    // Current color state
    currentColor,
    colorModel,
    colorHistory,
    showEyedropper,

    // Color manipulation
    updateCurrentColor,
    setColorFromHex,
    setColorFromRgb,
    setColorFromHsl,
    setAlpha,
    setColorModel,

    // Harmony
    currentHarmony,
    generateHarmony,

    // Palettes
    palettes,
    createPalette,
    updatePalette,
    deletePalette,
    addColorToPalette,
    removeColorFromPalette,

    // Gradients
    gradients,
    createGradient,
    updateGradient,
    deleteGradient,

    // Tools
    extractColorsFromImage,
    startEyedropper,
    getContrastRatio,
    clearHistory,
  }
}
