import type { ColorValue, ColorHarmony } from "@/types/colors"

export class ColorUtils {
  // Convert hex to RGB
  static hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 }
  }

  // Convert RGB to hex
  static rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  }

  // Convert RGB to HSL
  static rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h: number, s: number
    const l = (max + min) / 2

    if (max === min) {
      h = s = 0 // achromatic
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
        default:
          h = 0
      }
      h /= 6
    }

    return { h: h * 360, s: s * 100, l: l * 100 }
  }

  // Convert HSL to RGB
  static hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    h /= 360
    s /= 100
    l /= 100

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    let r: number, g: number, b: number

    if (s === 0) {
      r = g = b = l // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    }
  }

  // Convert RGB to HSV
  static rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const diff = max - min

    let h: number
    const s = max === 0 ? 0 : diff / max
    const v = max

    if (diff === 0) {
      h = 0
    } else {
      switch (max) {
        case r:
          h = ((g - b) / diff + (g < b ? 6 : 0)) / 6
          break
        case g:
          h = ((b - r) / diff + 2) / 6
          break
        case b:
          h = ((r - g) / diff + 4) / 6
          break
        default:
          h = 0
      }
    }

    return { h: h * 360, s: s * 100, v: v * 100 }
  }

  // Convert RGB to CMYK
  static rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
    r /= 255
    g /= 255
    b /= 255

    const k = 1 - Math.max(r, Math.max(g, b))
    const c = k === 1 ? 0 : (1 - r - k) / (1 - k)
    const m = k === 1 ? 0 : (1 - g - k) / (1 - k)
    const y = k === 1 ? 0 : (1 - b - k) / (1 - k)

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100),
    }
  }

  // Convert RGB to LAB
  static rgbToLab(r: number, g: number, b: number): { l: number; a: number; b: number } {
    // Convert RGB to XYZ first
    r /= 255
    g /= 255
    b /= 255

    // Apply gamma correction
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92

    // Convert to XYZ using sRGB matrix
    let x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375
    let y = r * 0.2126729 + g * 0.7151522 + b * 0.072175
    let z = r * 0.0193339 + g * 0.119192 + b * 0.9503041

    // Normalize for D65 illuminant
    x /= 0.95047
    y /= 1.0
    z /= 1.08883

    // Convert XYZ to LAB
    x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116
    y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116
    z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116

    const l = 116 * y - 16
    const a = 500 * (x - y)
    const bValue = 200 * (y - z)

    return { l: Math.round(l), a: Math.round(a), b: Math.round(bValue) }
  }

  // Create a complete ColorValue object
  static createColorValue(hex: string, alpha = 1): ColorValue {
    const rgb = this.hexToRgb(hex)
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b)
    const hsv = this.rgbToHsv(rgb.r, rgb.g, rgb.b)
    const cmyk = this.rgbToCmyk(rgb.r, rgb.g, rgb.b)
    const lab = this.rgbToLab(rgb.r, rgb.g, rgb.b)

    return {
      hex,
      rgb,
      hsl,
      hsv,
      cmyk,
      lab,
      alpha,
    }
  }

  // Generate color harmonies
  static generateHarmony(baseColor: ColorValue, type: ColorHarmony["type"]): ColorHarmony {
    const { h, s, l } = baseColor.hsl
    const colors: ColorValue[] = [baseColor]

    switch (type) {
      case "complementary":
        colors.push(this.createColorValue(this.hslToHex((h + 180) % 360, s, l)))
        break

      case "analogous":
        colors.push(this.createColorValue(this.hslToHex((h + 30) % 360, s, l)))
        colors.push(this.createColorValue(this.hslToHex((h - 30 + 360) % 360, s, l)))
        break

      case "triadic":
        colors.push(this.createColorValue(this.hslToHex((h + 120) % 360, s, l)))
        colors.push(this.createColorValue(this.hslToHex((h + 240) % 360, s, l)))
        break

      case "tetradic":
        colors.push(this.createColorValue(this.hslToHex((h + 90) % 360, s, l)))
        colors.push(this.createColorValue(this.hslToHex((h + 180) % 360, s, l)))
        colors.push(this.createColorValue(this.hslToHex((h + 270) % 360, s, l)))
        break

      case "split-complementary":
        colors.push(this.createColorValue(this.hslToHex((h + 150) % 360, s, l)))
        colors.push(this.createColorValue(this.hslToHex((h + 210) % 360, s, l)))
        break

      case "monochromatic":
        colors.push(this.createColorValue(this.hslToHex(h, s, Math.max(0, l - 20))))
        colors.push(this.createColorValue(this.hslToHex(h, s, Math.max(0, l - 40))))
        colors.push(this.createColorValue(this.hslToHex(h, s, Math.min(100, l + 20))))
        colors.push(this.createColorValue(this.hslToHex(h, s, Math.min(100, l + 40))))
        break
    }

    return {
      type,
      baseColor,
      colors,
    }
  }

  // Helper to convert HSL to hex
  static hslToHex(h: number, s: number, l: number): string {
    const rgb = this.hslToRgb(h, s, l)
    return this.rgbToHex(rgb.r, rgb.g, rgb.b)
  }

  // Calculate color contrast ratio
  static getContrastRatio(color1: ColorValue, color2: ColorValue): number {
    const getLuminance = (color: ColorValue) => {
      const { r, g, b } = color.rgb
      const [rs, gs, bs] = [r, g, b].map((c) => {
        c /= 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
    }

    const lum1 = getLuminance(color1)
    const lum2 = getLuminance(color2)
    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)

    return (brightest + 0.05) / (darkest + 0.05)
  }

  // Extract colors from image
  static async extractColorsFromImage(imageUrl: string, maxColors = 8): Promise<ColorValue[]> {
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")!

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const colors = this.quantizeColors(imageData.data, maxColors)

        resolve(colors.map((color) => this.createColorValue(color)))
      }
      img.src = imageUrl
    })
  }

  // Simple color quantization algorithm
  private static quantizeColors(data: Uint8ClampedArray, maxColors: number): string[] {
    const colorMap = new Map<string, number>()

    // Sample every 4th pixel for performance
    for (let i = 0; i < data.length; i += 16) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const alpha = data[i + 3]

      if (alpha > 128) {
        // Skip transparent pixels
        const hex = this.rgbToHex(r, g, b)
        colorMap.set(hex, (colorMap.get(hex) || 0) + 1)
      }
    }

    // Sort by frequency and return top colors
    return Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxColors)
      .map(([color]) => color)
  }
}
