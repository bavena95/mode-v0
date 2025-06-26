"use client";

import { LayerCanvas } from "./layer-canvas";
import { PromptBar } from "./PromptBar";
import { VariationsBar } from "./VariationsBar"; // Importando o novo componente

// O CenterPanel agora gerencia o estado das variações
export function CenterPanel({ 
  layers, selectedLayerIds, canvasState, onLayerSelect, onLayerUpdate, 
  variations, selectedVariation, onSelectVariation 
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center relative bg-black/20">
      
      {/* O Canvas agora ocupa o espaço principal, deixando área para as barras inferiores */}
      <div className="flex-1 w-full h-full flex items-center justify-center p-8 overflow-hidden">
        {selectedVariation ? (
           <img 
            src={selectedVariation.url}
            alt="Selected variation"
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="text-center text-muted-foreground">
            <p>Gere uma imagem para ver as variações.</p>
          </div>
        )}
      </div>
      
      {/* A nova barra de variações */}
      <VariationsBar 
        variations={variations}
        selectedVariation={selectedVariation}
        onSelectVariation={onSelectVariation}
      />

      {/* A PromptBar fica na parte inferior */}
      <PromptBar />
    </div>
  );
}