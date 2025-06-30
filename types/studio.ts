export interface GenerationRequest {
  prompt: string
  mode: string
  context: string
  selectedSuggestions: string[]
  aspectRatio: string
  quality: number
  numImages: number
  seed?: string
}

export interface GenerationResult {
  id: string
  url: string
  prompt: string
  metadata: {
    model: string
    dimensions: { width: number; height: number }
    seed: number
    inference_time: number
  }
}

export interface CanvasElement {
  id: string
  type: 'image' | 'text' | 'shape' | 'frame'
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  visible: boolean
  locked: boolean
  data: any
}

export interface CanvasState {
  elements: CanvasElement[]
  selectedIds: string[]
  zoom: number
  pan: { x: number; y: number }
  canvasSize: { width: number; height: number }
}

export interface Tool {
  id: string
  name: string
  icon: any
  cursor: string
  active: boolean
}