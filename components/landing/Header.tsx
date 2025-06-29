"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthButton } from "@/components/auth/auth-button";
import { MagnetIcon as Magic } from "lucide-react";

export function Header() {
  // 🛌 SIMULANDO USUÁRIO LOGADO PARA DESENVOLVIMENTO
  const mockUser = { displayName: "Dev User" }; // Simula usuário logado

  return (
    // Container para posicionar o header no topo da tela com margens
    <header className="sticky top-0 z-50 p-4">
      {/* O container "Pill" com o efeito de vidro e borda */}
      <div className="mx-auto flex max-w-screen-xl items-center justify-between rounded-full border border-white/10 bg-black/30 p-2 backdrop-blur-xl">
        
        {/* Lado Esquerdo: Logo */}
        <Link href="/" className="flex items-center gap-3 pl-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-secondary to-primary">
            <Magic className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-foreground">Mode Design</h1>
        </Link>
        
        {/* Centro: Links de Navegação */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Features</a>
          <a href="#testimonials" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Pricing</a>
          <a href="#blog" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Blog</a>
        </nav>

        {/* Lado Direito: Botões de Autenticação */}
        <div className="flex items-center gap-2">
          {mockUser ? (
            // Se o usuário estiver logado, mostre o botão de avatar
            <AuthButton />
          ) : (
            // Se não, mostre os botões de Login e Sign Up
            <>
              <Button asChild variant="ghost" className="hidden sm:inline-flex rounded-full text-muted-foreground hover:text-foreground">
                <Link href="/auth/signin">Log In</Link>
              </Button>
              <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}