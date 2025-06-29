"use client";

import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, Sparkles } from "lucide-react";
import Link from "next/link";

function AuthButtonInternal() {
  // 🛌 COMPONENTE ADORMECIDO - Simulando usuário logado para desenvolvimento
  const mockUser = {
    displayName: "Dev User",
    primaryEmail: "dev@example.com",
    profileImageUrl: null
  };

  const initials = mockUser.displayName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "DU";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-transparent hover:border-primary/50">
            <AvatarImage src={mockUser.profileImageUrl || ""} alt={mockUser.displayName || "User"} />
            <AvatarFallback className="bg-gradient-to-r from-secondary to-primary text-white font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 glass-card mt-2" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium text-foreground">{mockUser.displayName || "User"}</p>
            <p className="text-xs text-muted-foreground">{mockUser.primaryEmail}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <Link href="/studio"><DropdownMenuItem className="cursor-pointer"><Sparkles className="mr-2 h-4 w-4" /><span>Creative Studio</span></DropdownMenuItem></Link>
        <Link href="/profile"><DropdownMenuItem className="cursor-pointer"><User className="mr-2 h-4 w-4" /><span>Profile</span></DropdownMenuItem></Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => console.log("Sign out clicked")}><LogOut className="mr-2 h-4 w-4" /><span>Sign out</span></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AuthButton() {
  return (
    <Suspense fallback={<div className="h-10 w-24 rounded-full bg-muted/50 animate-pulse" />}>
      <AuthButtonInternal />
    </Suspense>
  );
}