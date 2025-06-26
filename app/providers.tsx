"use client";

import React from "react";
import { StackProvider } from "@stackframe/stack";
import { stackClientApp } from "@/lib/stack-client";
import { ThemeProvider } from "@/components/theme-provider"; // Supondo que você tenha este componente para o tema

export function Providers({ children }: { children: React.ReactNode }) {
  // O ThemeProvider é opcional, mas se você o tiver, o StackProvider deve vir dentro dele.
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <StackProvider app={stackClientApp}>
            {children}
        </StackProvider>
    </ThemeProvider>
  );
}