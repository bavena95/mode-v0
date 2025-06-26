"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AlignLeft, AlignCenter, AlignRight, Italic, Underline, RotateCcw, EyeOff, Lock, Trash2 } from "lucide-react";

// Sub-componente apenas para as propriedades de texto
const TextProperties = ({ layer, onLayerUpdate }) => (
  <div className="space-y-4 pt-4">
    <Separator/>
    <h4 className="font-semibold text-foreground">Text Properties</h4>
    <div>
      <Label htmlFor="text-content">Content</Label>
      <Textarea id="text-content" defaultValue={layer.data?.text || "New Text"} onChange={(e) => onLayerUpdate(layer.id, { data: { ...layer.data, text: e.target.value }})} className="mt-2" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label>Font</Label>
        <Select defaultValue="inter"><SelectTrigger className="mt-2"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="inter">Inter</SelectItem></SelectContent></Select>
      </div>
      <div>
        <Label>Size</Label>
        <Input defaultValue="24" className="mt-2" />
      </div>
    </div>
    <div>
      <Label>Style</Label>
      <ToggleGroup type="multiple" className="w-full justify-start gap-2 mt-2">
          <ToggleGroupItem value="italic" aria-label="Italic"><Italic className="h-4 w-4"/></ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline"><Underline className="h-4 w-4"/></ToggleGroupItem>
      </ToggleGroup>
    </div>
    <div>
      <Label>Alignment</Label>
      <ToggleGroup type="single" defaultValue="left" className="w-full justify-start gap-2 mt-2">
          <ToggleGroupItem value="left" aria-label="Align left"><AlignLeft className="h-4 w-4"/></ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align center"><AlignCenter className="h-4 w-4"/></ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right"><AlignRight className="h-4 w-4"/></ToggleGroupItem>
      </ToggleGroup>
    </div>
  </div>
);

export function AdjustPanel({ selectedLayer, onLayerUpdate }) {
  if (!selectedLayer) {
    return <div className="text-center text-sm text-muted-foreground pt-10">Select a layer to adjust its properties.</div>;
  }

  const handlePropertyChange = (property, value) => {
    onLayerUpdate(selectedLayer.id, { [property]: value });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Adjust Properties</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="layer-name">Layer Name</Label>
          <Input id="layer-name" value={selectedLayer.name} onChange={(e) => handlePropertyChange('name', e.target.value)} className="mt-2" />
        </div>
        <div>
          <Label>Opacity</Label>
          <Slider value={[selectedLayer.opacity]} onValueChange={([val]) => handlePropertyChange('opacity', val)} className="mt-2" />
        </div>
      </div>

      {selectedLayer.type === 'text' && <TextProperties layer={selectedLayer} onLayerUpdate={onLayerUpdate} />}

      <Separator />

      <div className="space-y-4">
        <h4 className="font-semibold text-foreground">Quick Actions</h4>
        <Button variant="outline" className="w-full justify-start gap-2"><RotateCcw className="h-4 w-4"/> Reset Properties</Button>
        <Button variant="outline" className="w-full justify-start gap-2"><Lock className="h-4 w-4"/> Lock Layer</Button>
        <Button variant="destructive" className="w-full justify-start gap-2"><Trash2 className="h-4 w-4"/> Delete Layer</Button>
      </div>
    </div>
  );
}