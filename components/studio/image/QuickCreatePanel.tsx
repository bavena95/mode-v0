"use client";

// Este componente irá abrigar a UI para seleção de Creative Modes,
// subcategorias e o prompt para gerar uma imagem rapidamente.
export function QuickCreatePanel() {
  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h2 className="text-2xl font-bold text-center mb-2 text-gradient-metallic">Criação Rápida de Imagem</h2>
      <p className="text-center text-muted-foreground mb-8">Selecione um modo, descreva sua visão e deixe a IA fazer o resto.</p>
      
      {/* Aqui entraria a UI para: */}
      {/* 1. Seleção de Creative Modes (similar ao antigo LeftPanel) */}
      {/* 2. Seleção de Subcategorias */}
      {/* 3. Textarea para o prompt */}
      {/* 4. Botão "Generate" */}
      <div className="p-16 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">(UI da Criação Rápida virá aqui)</p>
      </div>
    </div>
  );
}