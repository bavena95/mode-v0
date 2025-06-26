"use client";

import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { promptSuggestions } from "@/lib/mock-data";
import { Wand2, CheckCircle } from "lucide-react";
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';

export function AIAssistantPanel() {
  const [selections, setSelections] = useState<{ [key: string]: string | null }>({
    Style: "Minimalista",
  });

  const handleSelection = (category: string, suggestionName: string) => {
    setSelections(prev => ({ ...prev, [category]: prev[category] === suggestionName ? null : suggestionName }));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center p-4 border-b border-border flex-shrink-0">
        <h3 className="text-base font-semibold flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" />
          AI Prompt Assistant
        </h3>
      </div>
      <ScrollArea className="flex-1 p-4">
        <Accordion type="multiple" className="w-full">
          {Object.entries(promptSuggestions).map(([category, suggestions]) => (
            <AccordionItem key={category} value={category} className="border-b-0 mb-2">
              <AccordionTrigger className="w-full rounded-lg bg-accent/50 hover:bg-accent px-4 py-3 text-sm font-semibold">
                {category}
              </AccordionTrigger>
              <AccordionContent className="pt-2 space-y-2">
                {suggestions.map((suggestion) => {
                  const isSelected = selections[category] === suggestion.name;
                  return (
                    <button
                      key={suggestion.name}
                      onClick={() => handleSelection(category, suggestion.name)}
                      className={`w-full p-2 rounded-md border text-left transition-all ${
                        isSelected ? 'border-primary/70 bg-primary/20' : 'border-transparent bg-background hover:bg-accent/80'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-xs text-foreground">{suggestion.name}</p>
                          <p className="text-xs text-muted-foreground">{suggestion.desc}</p>
                        </div>
                        {isSelected && <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 ml-2" />}
                      </div>
                    </button>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        {/* SEÇÃO DE AI ENHANCEMENTS MOVIDA PARA CÁ */}
        <Separator className="my-4" />
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground px-1">AI Enhancements</h4>
          <div className="space-y-3 pl-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="ai-upscale" className="text-sm">AI Upscale</Label>
              <Switch id="ai-upscale" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="enhance-details" className="text-sm">Enhance Details</Label>
              <Switch id="enhance-details" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="face-enhancement" className="text-sm">Face Enhancement</Label>
              <Switch id="face-enhancement" />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};