"use client";

import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Efeitos de Fundo */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="absolute inset-0 -z-10 h-full w-full pointer-events-none bg-[radial-gradient(circle_farthest-side_at_50%_100%,hsl(var(--secondary)/0.1),transparent)]"></div>

      <Header />
      <main>
        <Hero />
        <Features />
      </main>
    </div>
  );
}