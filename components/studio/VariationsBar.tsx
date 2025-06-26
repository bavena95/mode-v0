"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function VariationsBar({ variations, selectedVariation, onSelectVariation }) {
  if (!variations || variations.length === 0) {
    return null;
  }

  return (
    // AJUSTE: Reduzido o padding vertical para p-2
    <div className="w-full flex-shrink-0 bg-card/50 backdrop-blur-xl border-t border-border p-2">
      <div className="flex items-center gap-2">
        {variations.map((variation) => (
          <button
            key={variation.id}
            onClick={() => onSelectVariation(variation)}
            // AJUSTE: Tamanho reduzido para h-16 w-16 (64px)
            className={`w-16 h-16 rounded-md border-2 flex-shrink-0 transition-all duration-200
              ${selectedVariation?.id === variation.id 
                ? 'border-primary ring-2 ring-primary/50' 
                : 'border-border hover:border-primary/50'
              }`}
          >
            <img
              src={variation.url}
              alt={`Variation ${variation.id}`}
              className="w-full h-full object-cover rounded-sm"
            />
          </button>
        ))}
        {/* AJUSTE: Botão de "Adicionar" também foi redimensionado */}
        <Button variant="outline" className="w-16 h-16 flex-shrink-0">
          <Plus className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}