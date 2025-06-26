"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { stats } from "@/lib/landing-page-data";

export function Hero() {
  return (
    <section className="relative z-10 container mx-auto px-6 py-20 text-center flex flex-col items-center">
      {/* Título com Efeito Metálico */}
      <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight max-w-4xl text-gradient-metallic">
        Gain 2 Hours Daily with Jace
      </h1>

      {/* Parágrafo com cor 'muted' */}
      <p className="text-lg md:text-xl mb-10 max-w-2xl leading-relaxed text-muted-foreground">
        Start your day with emails organized, drafts ready in your voice, and daily brief for maximum efficiency.
      </p>

      {/* Botão Primário Amarelo */}
      <Link href="/auth/signup">
        <Button size="lg" className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base rounded-md">
          Get Started for Free
        </Button>
      </Link>
    </section>
  );
}