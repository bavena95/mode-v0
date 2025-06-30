"use client"

import { useState, useCallback, useRef } from "react"
import type { CanvasElement, CanvasState, GenerationResult, GenerationRequest } from "@/types/studio"

export function useStudio() {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    elements: [],
    selectedIds: [],
    zoom: 100,
    pan: { x: 0, y: 0 },
    canvasSize: { width: 1920, height: 1080 }
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [generationHistory, setGenerationHistory] = useState<GenerationResult[]>([])
  const [activeTool, setActiveTool] = useState('select')
  const elementIdCounter = useRef(0)

  const generateId = useCallback(() => {
    elementIdCounter.current += 1
    return `element_${elementIdCounter.current}`
  }, [])

  // Canvas Operations
  const addElement = useCallback((element: Omit<CanvasElement, 'id'>) => {
    const newElement: CanvasElement = {
      ...element,
      id: generateId()
    }
    
    setCanvasState(prev => ({
      ...prev,
      elements: [...prev.elements, newElement],
      selectedIds: [newElement.id]
    }))
    
    return newElement.id
  }, [generateId])

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    setCanvasState(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === id ? { ...el, ...updates } : el
      )
    }))
  }, [])

  const deleteElement = useCallback((id: string) => {
    setCanvasState(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== id),
      selectedIds: prev.selectedIds.filter(selectedId => selectedId !== id)
    }))
  }, [])

  const selectElement = useCallback((id: string, multiSelect = false) => {
    setCanvasState(prev => ({
      ...prev,
      selectedIds: multiSelect 
        ? prev.selectedIds.includes(id)
          ? prev.selectedIds.filter(selectedId => selectedId !== id)
          : [...prev.selectedIds, id]
        : [id]
    }))
  }, [])

  const clearSelection = useCallback(() => {
    setCanvasState(prev => ({
      ...prev,
      selectedIds: []
    }))
  }, [])

  // Generation
  const generateImage = useCallback(async (request: GenerationRequest): Promise<GenerationResult | null> => {
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        throw new Error('Generation failed')
      }

      const data = await response.json()
      
      if (data.success && data.images?.[0]) {
        const result: GenerationResult = {
          id: generateId(),
          url: data.images[0].url,
          prompt: data.metadata.prompt,
          metadata: data.metadata
        }

        setGenerationHistory(prev => [result, ...prev])
        
        // Auto-add to canvas
        addElement({
          type: 'image',
          x: 100,
          y: 100,
          width: data.metadata.dimensions.width / 2,
          height: data.metadata.dimensions.height / 2,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          data: { src: result.url, originalPrompt: result.prompt }
        })

        return result
      }
      
      return null
    } catch (error) {
      console.error('Generation error:', error)
      return null
    } finally {
      setIsGenerating(false)
    }
  }, [generateId, addElement])

  // Canvas Controls
  const zoomIn = useCallback(() => {
    setCanvasState(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom + 25, 500)
    }))
  }, [])

  const zoomOut = useCallback(() => {
    setCanvasState(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom - 25, 25)
    }))
  }, [])

  const resetZoom = useCallback(() => {
    setCanvasState(prev => ({
      ...prev,
      zoom: 100,
      pan: { x: 0, y: 0 }
    }))
  }, [])

  const updatePan = useCallback((pan: { x: number; y: number }) => {
    setCanvasState(prev => ({ ...prev, pan }))
  }, [])

  // Tools
  const setTool = useCallback((tool: string) => {
    setActiveTool(tool)
  }, [])

  // Duplicate
  const duplicateElement = useCallback((id: string) => {
    const element = canvasState.elements.find(el => el.id === id)
    if (!element) return

    addElement({
      ...element,
      x: element.x + 20,
      y: element.y + 20
    })
  }, [canvasState.elements, addElement])

  // Group/Ungroup
  const groupElements = useCallback((ids: string[]) => {
    if (ids.length < 2) return

    const elements = canvasState.elements.filter(el => ids.includes(el.id))
    const bounds = elements.reduce((acc, el) => ({
      minX: Math.min(acc.minX, el.x),
      minY: Math.min(acc.minY, el.y),
      maxX: Math.max(acc.maxX, el.x + el.width),
      maxY: Math.max(acc.maxY, el.y + el.height)
    }), { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity })

    const groupId = addElement({
      type: 'frame',
      x: bounds.minX,
      y: bounds.minY,
      width: bounds.maxX - bounds.minX,
      height: bounds.maxY - bounds.minY,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      data: { children: ids, isGroup: true }
    })

    // Update children to be relative to group
    ids.forEach(id => {
      const element = canvasState.elements.find(el => el.id === id)
      if (element) {
        updateElement(id, {
          x: element.x - bounds.minX,
          y: element.y - bounds.minY,
          data: { ...element.data, parentId: groupId }
        })
      }
    })
  }, [canvasState.elements, addElement, updateElement])

  return {
    // State
    canvasState,
    isGenerating,
    generationHistory,
    activeTool,
    
    // Canvas Operations
    addElement,
    updateElement,
    deleteElement,
    duplicateElement,
    selectElement,
    clearSelection,
    groupElements,
    
    // Generation
    generateImage,
    
    // Canvas Controls
    zoomIn,
    zoomOut,
    resetZoom,
    updatePan,
    
    // Tools
    setTool
  }
}