"use client"

import React from 'react'
import { useStudio } from '@/hooks/use-studio'
import { Canvas } from '@/components/studio/Canvas'
import { Toolbar } from '@/components/studio/Toolbar'
import { GenerationPanel } from '@/components/studio/GenerationPanel'
import { PropertiesPanel } from '@/components/studio/PropertiesPanel'

export default function StudioPage() {
  const {
    canvasState,
    isGenerating,
    generationHistory,
    activeTool,
    addElement,
    updateElement,
    deleteElement,
    duplicateElement,
    selectElement,
    clearSelection,
    generateImage,
    zoomIn,
    zoomOut,
    resetZoom,
    updatePan,
    setTool
  } = useStudio()

  const selectedElements = canvasState.elements.filter(el => 
    canvasState.selectedIds.includes(el.id)
  )

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50">
      {/* Toolbar */}
      <Toolbar
        activeTool={activeTool}
        onToolChange={setTool}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={resetZoom}
        zoom={canvasState.zoom}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 relative">
          <Canvas
            canvasState={canvasState}
            activeTool={activeTool}
            onElementSelect={selectElement}
            onElementUpdate={updateElement}
            onElementAdd={addElement}
            onPanUpdate={updatePan}
          />
        </div>

        {/* Right Panels */}
        <div className="flex">
          <GenerationPanel
            onGenerate={generateImage}
            isGenerating={isGenerating}
            generationHistory={generationHistory}
          />
          
          <PropertiesPanel
            selectedElements={selectedElements}
            onElementUpdate={updateElement}
            onElementDelete={deleteElement}
            onElementDuplicate={duplicateElement}
          />
        </div>
      </div>
    </div>
  )
}