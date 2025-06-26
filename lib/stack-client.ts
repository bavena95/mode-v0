"use client";

import { StackClientApp } from "@stackframe/stack";

if (!process.env.NEXT_PUBLIC_STACK_PROJECT_ID) {
  throw new Error("STACK CLIENT: NEXT_PUBLIC_STACK_PROJECT_ID is not set.");
}
if (!process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY) {
  throw new Error("STACK CLIENT: NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY is not set.");
}

export const stackClientApp = new StackClientApp({
  tokenStore: "nextjs-cookie",
  urls: {
    signIn: "/auth/signin",
    signUp: "/auth/signup", 
    afterSignIn: "/studio",
    afterSignUp: "/studio",
    afterSignOut: "/",
  },
});