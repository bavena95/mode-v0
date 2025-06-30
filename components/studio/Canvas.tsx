"use client"

import React, { useRef, useCallback, useEffect, useState } from 'react'
import type { CanvasElement, CanvasState } from '@/types/studio'

interface CanvasProps {
  canvasState: CanvasState
  activeTool: string
  onElementSelect: (id: string, multiSelect?: boolean) => void
  onElementUpdate: (id: string, updates: Partial<CanvasElement>) => void
  onElementAdd: (element: Omit<CanvasElement, 'id'>) => void
  onPanUpdate: (pan: { x: number; y: number }) => void
}

export function Canvas({ 
  canvasState, 
  activeTool, 
  onElementSelect, 
  onElementUpdate, 
  onElementAdd,
  onPanUpdate 
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [draggedElement, setDraggedElement] = useState<string | null>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (activeTool === 'pan') {
      setIsDragging(true)
      setDragStart({ x: e.clientX - canvasState.pan.x, y: e.clientY - canvasState.pan.y })
      return
    }

    // Check if clicking on an element
    const target = e.target as HTMLElement
    const elementId = target.closest('[data-element-id]')?.getAttribute('data-element-id')
    
    if (elementId) {
      onElementSelect(elementId, e.ctrlKey || e.metaKey)
      
      if (activeTool === 'select') {
        setDraggedElement(elementId)
        setIsDragging(true)
        setDragStart({ x: e.clientX, y: e.clientY })
      }
    } else {
      // Clicked on empty canvas
      if (activeTool === 'text') {
        const rect = canvasRef.current?.getBoundingClientRect()
        if (rect) {
          const x = (e.clientX - rect.left - canvasState.pan.x) / (canvasState.zoom / 100)
          const y = (e.clientY - rect.top - canvasState.pan.y) / (canvasState.zoom / 100)
          
          onElementAdd({
            type: 'text',
            x,
            y,
            width: 200,
            height: 50,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            data: { text: 'New Text', fontSize: 16, color: '#000000' }
          })
        }
      } else if (activeTool === 'rectangle') {
        const rect = canvasRef.current?.getBoundingClientRect()
        if (rect) {
          const x = (e.clientX - rect.left - canvasState.pan.x) / (canvasState.zoom / 100)
          const y = (e.clientY - rect.top - canvasState.pan.y) / (canvasState.zoom / 100)
          
          onElementAdd({
            type: 'shape',
            x,
            y,
            width: 100,
            height: 100,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            data: { shapeType: 'rectangle', fill: '#3B82F6', stroke: 'none' }
          })
        }
      }
    }
  }, [activeTool, canvasState.pan, canvasState.zoom, onElementSelect, onElementAdd])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return

    if (activeTool === 'pan') {
      onPanUpdate({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    } else if (draggedElement && activeTool === 'select') {
      const deltaX = (e.clientX - dragStart.x) / (canvasState.zoom / 100)
      const deltaY = (e.clientY - dragStart.y) / (canvasState.zoom / 100)
      
      const element = canvasState.elements.find(el => el.id === draggedElement)
      if (element) {
        onElementUpdate(draggedElement, {
          x: element.x + deltaX,
          y: element.y + deltaY
        })
      }
      
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }, [isDragging, activeTool, dragStart, draggedElement, canvasState.zoom, canvasState.elements, onPanUpdate, onElementUpdate])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setDraggedElement(null)
  }, [])

  const renderElement = useCallback((element: CanvasElement) => {
    const isSelected = canvasState.selectedIds.includes(element.id)
    const transform = `translate(${element.x}px, ${element.y}px) rotate(${element.rotation}deg)`
    
    const baseStyle = {
      position: 'absolute' as const,
      left: 0,
      top: 0,
      width: element.width,
      height: element.height,
      transform,
      opacity: element.opacity,
      visibility: element.visible ? 'visible' as const : 'hidden' as const,
      cursor: activeTool === 'select' ? 'move' : 'default',
      border: isSelected ? '2px solid #3B82F6' : '1px solid transparent',
      borderRadius: element.type === 'shape' && element.data.shapeType === 'circle' ? '50%' : '4px'
    }

    switch (element.type) {
      case 'image':
        return (
          <div
            key={element.id}
            data-element-id={element.id}
            style={baseStyle}
            className="overflow-hidden"
          >
            <img 
              src={element.data.src} 
              alt="Generated content"
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
            />
            {isSelected && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full"></div>
            )}
          </div>
        )
      
      case 'text':
        return (
          <div
            key={element.id}
            data-element-id={element.id}
            style={{
              ...baseStyle,
              fontSize: element.data.fontSize || 16,
              color: element.data.color || '#000000',
              fontFamily: element.data.fontFamily || 'Inter',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent'
            }}
            className="select-none"
          >
            {element.data.text || 'Text'}
            {isSelected && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full"></div>
            )}
          </div>
        )
      
      case 'shape':
        return (
          <div
            key={element.id}
            data-element-id={element.id}
            style={{
              ...baseStyle,
              backgroundColor: element.data.fill || '#3B82F6',
              border: element.data.stroke ? `2px solid ${element.data.stroke}` : baseStyle.border
            }}
          >
            {isSelected && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full"></div>
            )}
          </div>
        )
      
      case 'frame':
        return (
          <div
            key={element.id}
            data-element-id={element.id}
            style={{
              ...baseStyle,
              backgroundColor: 'transparent',
              border: isSelected ? '2px solid #3B82F6' : '1px dashed #ccc'
            }}
          >
            {isSelected && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full"></div>
            )}
          </div>
        )
      
      default:
        return null
    }
  }, [canvasState.selectedIds, activeTool])

  const canvasStyle = {
    transform: `translate(${canvasState.pan.x}px, ${canvasState.pan.y}px) scale(${canvasState.zoom / 100})`,
    transformOrigin: '0 0',
    width: canvasState.canvasSize.width,
    height: canvasState.canvasSize.height,
    backgroundColor: '#ffffff',
    backgroundImage: `
      linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
    `,
    backgroundSize: '20px 20px',
    position: 'relative' as const
  }

  return (
    <div 
      ref={canvasRef}
      className="w-full h-full overflow-hidden bg-gray-100 relative"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: activeTool === 'pan' ? 'grab' : 'default' }}
    >
      <div style={canvasStyle}>
        {canvasState.elements.map(renderElement)}
      </div>
      
      {/* Canvas Info */}
      <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-1 rounded text-sm">
        Zoom: {canvasState.zoom}% | Elements: {canvasState.elements.length}
      </div>
    </div>
  )
}