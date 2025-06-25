"use client"

import { StackClientApp } from "@stackframe/stack"

export const stackServerApp = new StackClientApp({
  tokenStore: "nextjs-cookie",
  urls: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    afterSignIn: "/studio",
    afterSignUp: "/studio",
    afterSignOut: "/",
  },
})
