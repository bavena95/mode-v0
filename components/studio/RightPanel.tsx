"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HistoryPanel } from "./history-panel";
import { AIAssistantPanel } from "./AIAssistantPanel";
import { AdjustPanel } from "./AdjustPanel";

export function RightPanel({ history, selectedLayer, onLayerUpdate }) {
  return (
    <div className="flex h-full flex-col bg-card/80 backdrop-blur-xl">
      <div className="p-4 flex-1 flex flex-col">
        <Tabs defaultValue="adjust" className="flex flex-col h-full">
          <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
            <TabsTrigger value="ai">AI</TabsTrigger>
            <TabsTrigger value="adjust">Adjust</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 mt-4 overflow-hidden">
            <ScrollArea className="h-full pr-4">
              <TabsContent value="ai"><AIAssistantPanel /></TabsContent>
              <TabsContent value="adjust">
                <AdjustPanel selectedLayer={selectedLayer} onLayerUpdate={onLayerUpdate} />
              </TabsContent>
              <TabsContent value="history">
                <HistoryPanel history={history.history} currentIndex={history.currentIndex} onJumpToAction={() => {}} />
              </TabsContent>
            </ScrollArea>
          </div>
        </Tabs>
      </div>
    </div>
  );
}