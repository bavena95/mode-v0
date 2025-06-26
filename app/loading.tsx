import { MagnetIcon as Magic } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center">
      {/* Efeitos de Fundo consistentes com o resto da aplicação */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="absolute inset-0 -z-10 h-full w-full pointer-events-none bg-[radial-gradient(circle_farthest-side_at_50%_100%,hsl(var(--secondary)/0.1),transparent)]"></div>

      <div className="text-center">
        {/* Ícone com a nova animação de pulso e brilho */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="w-full h-full rounded-full bg-gradient-to-r from-secondary/20 to-primary/20 flex items-center justify-center animate-[pulse-glow_2.5s_ease-in-out_infinite]">
            <Magic className="w-12 h-12 text-primary" />
          </div>
        </div>
        
        {/* Texto alinhado com a nova identidade */}
        <h2 className="text-lg font-semibold text-foreground tracking-widest animate-pulse">
          LOADING...
        </h2>
      </div>
    </div>
  );
}