"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { creativeModesData } from "@/lib/mock-data";
import { Layers3, ImageIcon, Type, Search, GripVertical, Eye, Lock, Palette } from "lucide-react";

// --- Sub-componente para os Cards de Modo Criativo ---
function CreativeModeCard({ mode, isSelected, onSelect }) {
  const Icon = mode.icon;
  return (
    <button
      onClick={onSelect}
      className={`group w-full text-left p-3 rounded-xl border-2 transition-all duration-200 ${
        isSelected ? "border-primary bg-primary/10" : "border-transparent bg-accent hover:bg-accent/80"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${mode.gradient} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white/90" />
        </div>
        <h4 className="text-sm font-semibold text-foreground">{mode.name}</h4>
      </div>
    </button>
  );
}

// --- Sub-componente para os Itens da Lista de Camadas ---
function LayerItem({ layer, isSelected, onSelectLayer }) {
  const Icon = layer.type === 'image' ? ImageIcon : Type;
  return (
    <button
      onClick={() => onSelectLayer(layer.id)}
      className={`w-full flex items-center justify-between rounded-lg pr-2 transition-colors group ${
        isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent"
      }`}
    >
      <div className="flex items-center gap-2">
        <div className="p-2 text-muted-foreground group-hover:text-foreground cursor-grab">
           <GripVertical className="h-4 w-4" />
        </div>
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{layer.name}</span>
      </div>
      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
        {layer.isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
        <Eye className="h-4 w-4 text-muted-foreground" />
      </div>
    </button>
  );
}

// --- Componente Principal do Painel Esquerdo ---
export function LeftPanel({ layers, selectedLayerIds, onSelectLayer, onAddLayer }) {
  const [selectedMode, setSelectedMode] = React.useState(creativeModesData[0]);
  const [selectedContext, setSelectedContext] = React.useState(creativeModesData[0].contexts[0]);

  return (
    <div className="flex h-full flex-col bg-card/80 backdrop-blur-xl">
      {/* Seção de Modos Criativos */}
      <div className="p-4 border-b border-border flex-shrink-0">
        <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" /> Creative Mode
        </h3>
        
        {/* CORREÇÃO: Removido o <ScrollArea> daqui */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {creativeModesData.map((mode) => (
            <CreativeModeCard
              key={mode.id}
              mode={mode}
              isSelected={selectedMode.id === mode.id}
              onSelect={() => {
                setSelectedMode(mode);
                setSelectedContext(mode.contexts[0]);
              }}
            />
          ))}
        </div>

        <div>
          <Label className="text-xs font-semibold text-muted-foreground mb-2 block">Context</Label>
          <Select value={selectedContext} onValueChange={setSelectedContext}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent className="bg-card border-border">
              {selectedMode.contexts.map(context => <SelectItem key={context} value={context}>{context}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Seção de Camadas (Layers) */}
      <div className="flex-1 flex flex-col min-h-0">
         <div className="p-4 flex items-center justify-between flex-shrink-0 border-b border-border">
            <h3 className="text-base font-semibold flex items-center gap-2"><Layers3 className="h-5 w-5" /> Layers</h3>
            <div className="flex items-center gap-1">
                <Button onClick={() => onAddLayer('image')} variant="ghost" size="icon" className="h-7 w-7"><ImageIcon className="h-4 w-4"/></Button>
                <Button onClick={() => onAddLayer('text')} variant="ghost" size="icon" className="h-7 w-7"><Type className="h-4 w-4"/></Button>
            </div>
         </div>
        <ScrollArea className="flex-1 px-2 py-2">
          <div className="space-y-0.5">
            {layers.map(layer => (
              <LayerItem 
                key={layer.id} 
                layer={layer} 
                isSelected={selectedLayerIds.includes(layer.id)}
                onSelectLayer={onSelectLayer}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}