"use client";

import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { StudioNavbar } from "@/components/studio/StudioNavbar";
import { LeftPanel } from "@/components/studio/LeftPanel";
import { RightPanel } from "@/components/studio/RightPanel";
import { CenterPanel } from "@/components/studio/CenterPanel";
import { useHistory } from "@/hooks/use-history";
import { useLayers } from "@/hooks/use-layers";
import { useCanvas } from "@/hooks/use-canvas";

export type StudioMode = "image" | "video" | "motion";

// Dados de exemplo para as variações
const initialVariations = [
  { id: 1, url: 'https://storage.googleapis.com/stack-frame-dev-images/projects/e31ebcf6-3e61-4955-984e-00a0359a983f/assets/751d9e79-5435-4293-b615-0d2d3a246835.png' },
  { id: 2, url: '/placeholder.svg?width=100&height=100&text=Var2' },
  { id: 3, url: '/placeholder.svg?width=100&height=100&text=Var3' },
];

export default function StudioPage() {
  const [activeStudio, setActiveStudio] = useState<StudioMode>("image");
  const history = useHistory();
  const layers = useLayers();
  const canvas = useCanvas();
  
  const [variations, setVariations] = useState(initialVariations);
  const [selectedVariation, setSelectedVariation] = useState(initialVariations[0]);

  const selectedLayer = layers.layers.find(l => l.id === layers.selectedLayerIds[0]) || null;

  return (
    <div className="h-screen w-full flex flex-col bg-background text-foreground overflow-hidden">
      <StudioNavbar 
        onUndo={history.undo}
        onRedo={history.redo}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        canvasState={canvas.canvasState}
        onCanvasUpdate={canvas.updateCanvas}
      />
      <main className="flex flex-1 overflow-hidden">
        {activeStudio === 'image' && (
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
              <LeftPanel 
                layers={layers.layers} 
                selectedLayerIds={layers.selectedLayerIds}
                onLayerSelect={layers.selectLayer}
                onLayerUpdate={layers.updateLayer}
                onAddLayer={(type) => layers.addLayer({ name: `New ${type}`, type })}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={60}>
              <CenterPanel
                layers={layers.layers}
                selectedLayerIds={layers.selectedLayerIds}
                canvasState={canvas.canvasState}
                onLayerSelect={layers.selectLayer}
                onLayerUpdate={layers.updateLayer}
                variations={variations}
                selectedVariation={selectedVariation}
                onSelectVariation={setSelectedVariation}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
               <RightPanel 
                  history={history} 
                  selectedLayer={selectedLayer}
                  onLayerUpdate={layers.updateLayer}
                />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </main>
    </div>
  );
}