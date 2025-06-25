export interface Layer {
  id: string
  name: string
  type: "image" | "text" | "shape" | "adjustment" | "group"
  visible: boolean
  locked: boolean
  opacity: number
  blendMode: BlendMode
  position: { x: number; y: number }
  size: { width: number; height: number }
  rotation: number
  data: LayerData
  effects: LayerEffect[]
  masks: LayerMask[] // Múltiplas máscaras por camada
  parentId?: string
  children?: string[]
  thumbnail?: string
  zIndex: number
}

export interface LayerData {
  // Image layer
  src?: string
  filters?: string[]

  // Text layer
  text?: string
  fontSize?: number
  fontFamily?: string
  color?: string
  textAlign?: "left" | "center" | "right"

  // Shape layer
  shapeType?: "rectangle" | "circle" | "polygon"
  fill?: string
  stroke?: string
  strokeWidth?: number

  // Adjustment layer
  adjustmentType?: "brightness" | "contrast" | "saturation" | "hue"
  adjustmentValue?: number
}

export interface LayerEffect {
  id: string
  type: "drop-shadow" | "inner-shadow" | "glow" | "stroke" | "gradient-overlay"
  enabled: boolean
  settings: Record<string, any>
}

export interface LayerMask {
  id: string
  type: "alpha" | "vector" | "clipping" | "gradient" | "selection"
  name: string
  enabled: boolean
  inverted: boolean
  opacity: number
  feather: number
  data: MaskData
  blendMode: MaskBlendMode
  thumbnail?: string
}

export interface MaskData {
  // Alpha mask
  imageData?: ImageData
  canvas?: HTMLCanvasElement

  // Vector mask
  path?: string // SVG path
  shapes?: VectorShape[]

  // Gradient mask
  gradient?: {
    type: "linear" | "radial" | "conic"
    stops: GradientStop[]
    angle?: number
    center?: { x: number; y: number }
    radius?: number
  }

  // Selection mask
  selection?: {
    type: "rectangle" | "ellipse" | "polygon" | "freehand"
    points: { x: number; y: number }[]
    bounds: { x: number; y: number; width: number; height: number }
  }
}

export interface VectorShape {
  id: string
  type: "rectangle" | "ellipse" | "polygon" | "path"
  points: { x: number; y: number }[]
  fill: boolean
  stroke: boolean
}

export interface GradientStop {
  position: number // 0-1
  color: string
  opacity: number
}

export type MaskBlendMode = "normal" | "multiply" | "screen" | "overlay" | "soft-light" | "hard-light"

export type BlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "soft-light"
  | "hard-light"
  | "color-dodge"
  | "color-burn"
  | "darken"
  | "lighten"
  | "difference"
  | "exclusion"
  | "hue"
  | "saturation"
  | "color"
  | "luminosity"

export interface LayerGroup {
  id: string
  name: string
  visible: boolean
  locked: boolean
  opacity: number
  blendMode: BlendMode
  children: string[]
  expanded: boolean
}
