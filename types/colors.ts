export interface ColorValue {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
  hsv: { h: number; s: number; v: number }
  cmyk: { c: number; m: number; y: number; k: number }
  lab: { l: number; a: number; b: number }
  alpha: number
}

export interface ColorPalette {
  id: string
  name: string
  colors: ColorValue[]
  type: "custom" | "predefined" | "extracted" | "harmony"
  createdAt: Date
  tags: string[]
  description?: string
}

export interface ColorHarmony {
  type: "complementary" | "analogous" | "triadic" | "tetradic" | "monochromatic" | "split-complementary"
  baseColor: ColorValue
  colors: ColorValue[]
}

export interface GradientStop {
  position: number // 0-1
  color: ColorValue
}

export interface Gradient {
  id: string
  name: string
  type: "linear" | "radial" | "conic"
  stops: GradientStop[]
  angle?: number // for linear
  center?: { x: number; y: number } // for radial/conic
  radius?: number // for radial
  repeating?: boolean
}

export interface ColorHistory {
  colors: ColorValue[]
  maxSize: number
}

export type ColorModel = "hex" | "rgb" | "hsl" | "hsv" | "cmyk" | "lab"

export interface ColorPickerState {
  currentColor: ColorValue
  colorModel: ColorModel
  showEyedropper: boolean
  showPalettes: boolean
  showHarmony: boolean
  showGradients: boolean
}
