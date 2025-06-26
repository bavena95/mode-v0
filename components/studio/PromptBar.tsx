"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowUp, ChevronDown, Check, Zap, ImageIcon, Shapes } from "lucide-react";

// Dados para o seletor de modelos
const models = [
  { id: 'low', name: 'mode 1.0 low', credits: 1 },
  { id: 'med', name: 'mode 1.0 med', credits: 3 },
  { id: 'high', name: 'mode 1.0 high', credits: 5 },
];

export function PromptBar() {
  const [selectedModel, setSelectedModel] = useState(models[1]);
  const [creationType, setCreationType] = useState("image");

  return (
    <div className="w-full max-w-4xl flex-shrink-0 p-4 space-y-3">
      {/* --- ÁREA DE TEXTO E BOTÕES DE AÇÃO --- */}
      <div className="relative">
        <Textarea
          placeholder="An impressionist oil painting of a sunflower field at sunset..."
          className="w-full rounded-lg border bg-card/80 p-4 pr-36 shadow-lg resize-none backdrop-blur-xl min-h-[56px]"
          rows={1}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <Button variant="secondary" size="sm" className="hidden sm:flex">
            <Plus className="h-4 w-4 mr-1"/>
            Inspiration
          </Button>
          <Button size="icon" className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 w-9">
            <ArrowUp className="h-5 w-5"/>
          </Button>
        </div>
      </div>

      {/* --- NOVOS CONTROLES ABAIXO DO PROMPT --- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ToggleGroup type="single" value={creationType} onValueChange={(value) => value && setCreationType(value)} className="rounded-full bg-background p-1">
            <ToggleGroupItem value="image" aria-label="Create Image" className="rounded-full px-3 text-xs sm:text-sm data-[state=on]:bg-accent">
              <ImageIcon className="h-4 w-4 mr-2" /> Image
            </ToggleGroupItem>
            <ToggleGroupItem value="layer" aria-label="Create Layer" className="rounded-full px-3 text-xs sm:text-sm data-[state=on]:bg-accent">
              <Shapes className="h-4 w-4 mr-2" /> Layer
            </ToggleGroupItem>
          </ToggleGroup>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                {selectedModel.name}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 glass-card">
              {models.map((model) => (
                <DropdownMenuItem key={model.id} onSelect={() => setSelectedModel(model)}>
                  <div className="flex justify-between items-center w-full">
                    <p className="font-medium">{model.name}</p>
                    <div className="flex items-center gap-2 pl-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Zap className="h-3 w-3 text-primary" /> {model.credits}
                      </Badge>
                      {selectedModel.id === model.id && <Check className="h-4 w-4 text-primary" />}
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}