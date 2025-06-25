"use client"

import type React from "react"

import { StackProvider } from "@stackframe/stack"
import { stackServerApp } from "@/lib/stack-auth"

export function Providers({ children }: { children: React.ReactNode }) {
  return <StackProvider app={stackServerApp}>{children}</StackProvider>
}
