"use client";

import React from "react";
import Link from "next/link";
import { useUser } from "@stackframe/stack";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  MagnetIcon as Magic,
  Image as ImageIcon,
  Video,
  Film,
  Plus,
  Save,
  Undo2,
  Redo2,
  Download,
  Upload,
  ZoomIn,
  ZoomOut,
  ChevronDown,
} from "lucide-react";
import type { StudioMode } from "@/app/studio/page";

interface StudioNavbarProps {
  activeStudio: StudioMode;
  setActiveStudio: (mode: StudioMode) => void;
}

export function StudioNavbar({ activeStudio, setActiveStudio }: StudioNavbarProps) {
  const user = useUser();
  const userInitials = user?.displayName?.charAt(0) || "U";

  const navItems: { id: StudioMode; label: string; icon: React.ElementType }[] = [
    { id: "image", label: "Imagem", icon: ImageIcon },
    { id: "video", label: "Vídeo", icon: Video },
    { id: "motion", label: "Motion", icon: Film },
  ];

  return (
    <header className="relative z-50 flex h-16 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-xl flex-shrink-0">
      
      {/* Esquerda: Logo e Navegação Principal */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 pr-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-secondary to-primary">
            <Magic className="h-5 w-5 text-white" />
          </div>
          <h1 className="hidden sm:block text-lg font-semibold text-foreground">Mode</h1>
        </Link>
        <div className="flex items-center gap-1 rounded-full bg-background p-1">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeStudio === item.id ? "secondary" : "ghost"}
              size="sm"
              className="rounded-full"
              onClick={() => setActiveStudio(item.id)}
            >
              <item.icon className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Centro: Ferramentas Rápidas (visível em telas maiores) */}
      <div className="hidden lg:flex items-center gap-1 rounded-full bg-background p-1">
        <Button variant="ghost" size="icon" aria-label="Add Element"><Plus className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" aria-label="Save"><Save className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" aria-label="Import"><Upload className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" aria-label="Export"><Download className="h-4 w-4" /></Button>
        <DropdownMenuSeparator orientation="vertical" className="h-6 mx-1" />
        <Button variant="ghost" size="icon" aria-label="Undo"><Undo2 className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" aria-label="Redo"><Redo2 className="h-4 w-4" /></Button>
      </div>

      {/* Direita: Controles de Zoom e Menu de Usuário */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-1 rounded-full bg-background p-1 text-sm font-medium">
          <Button variant="ghost" size="icon" className="h-7 w-7"><ZoomOut className="h-4 w-4" /></Button>
          <span className="w-12 text-center text-muted-foreground">100%</span>
          <Button variant="ghost" size="icon" className="h-7 w-7"><ZoomIn className="h-4 w-4" /></Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
             <Avatar className="h-9 w-9 cursor-pointer">
                <AvatarImage src={user?.profileImageUrl || ""} alt={user?.displayName || "User"} />
                <AvatarFallback className="bg-primary text-primary-foreground font-bold">{userInitials}</AvatarFallback>
             </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="glass-card mt-2" align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-400">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}