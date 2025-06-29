"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { StackProvider } from "@stackframe/stack"
import { stackClientApp } from "@/lib/stack-client"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StackProvider app={stackClientApp}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        {children}
      </ThemeProvider>
    </StackProvider>
  )
}