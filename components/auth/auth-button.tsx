"use client";
import { Suspense } from "react";
import { useUser } from "@stackframe/stack";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, Sparkles } from "lucide-react";
import Link from "next/link";

function AuthButtonInternal() {
  const user = useUser();

  if (!user) {
    // No estado deslogado, os botões serão renderizados pelo Header, então podemos retornar null aqui.
    return null;
  }

  const initials = user.displayName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || user.primaryEmail?.slice(0, 2).toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-transparent hover:border-primary/50">
            <AvatarImage src={user.profileImageUrl || ""} alt={user.displayName || "User"} />
            <AvatarFallback className="bg-gradient-to-r from-secondary to-primary text-white font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 glass-card mt-2" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium text-foreground">{user.displayName || "User"}</p>
            <p className="text-xs text-muted-foreground">{user.primaryEmail}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <Link href="/studio"><DropdownMenuItem className="cursor-pointer"><Sparkles className="mr-2 h-4 w-4" /><span>Creative Studio</span></DropdownMenuItem></Link>
        <Link href="/profile"><DropdownMenuItem className="cursor-pointer"><User className="mr-2 h-4 w-4" /><span>Profile</span></DropdownMenuItem></Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => user.signOut()}><LogOut className="mr-2 h-4 w-4" /><span>Sign out</span></DropdownMenuItem>
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