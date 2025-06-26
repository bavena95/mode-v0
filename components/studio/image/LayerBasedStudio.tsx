"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { LeftPanel } from "@/components/studio/LeftPanel";
import { RightPanel } from "@/components/studio/RightPanel";

export function LayerBasedStudio() {
  return (
    <div className="h-full w-full">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15}><LeftPanel /></ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={60}>
          <div className="h-full flex items-center justify-center bg-black/10">
            {/* O Canvas principal iria aqui */}
            <p className="text-muted-foreground">Canvas</p>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={20} minSize={15}><RightPanel /></ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}