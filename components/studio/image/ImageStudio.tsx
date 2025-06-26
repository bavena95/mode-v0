"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuickCreatePanel } from "./QuickCreatePanel";
import { LayerBasedStudio } from "./LayerBasedStudio";

type ImageMode = "quick" | "layers";

export function ImageStudio() {
  const [mode, setMode] = useState<ImageMode>("quick");

  return (
    <div className="h-full w-full">
      <Tabs value={mode} onValueChange={(value) => setMode(value as ImageMode)} className="h-full flex flex-col">
        <div className="flex justify-center p-4 border-b border-border bg-card/50">
          <TabsList>
            <TabsTrigger value="quick">Criação Rápida</TabsTrigger>
            <TabsTrigger value="layers">Studio (Layers)</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="quick" className="flex-1 overflow-y-auto">
          <QuickCreatePanel />
        </TabsContent>
        <TabsContent value="layers" className="flex-1 overflow-hidden">
          <LayerBasedStudio />
        </TabsContent>
      </Tabs>
    </div>
  );
}