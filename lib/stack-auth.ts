import { StackServerApp } from "@stackframe/stack";

if (!process.env.NEXT_PUBLIC_STACK_PROJECT_ID) {
  throw new Error("STACK SERVER: NEXT_PUBLIC_STACK_PROJECT_ID is not set.");
}
if (!process.env.STACK_SECRET_SERVER_KEY) {
  throw new Error("STACK SERVER: STACK_SECRET_SERVER_KEY is not set.");
}

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  urls: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    afterSignIn: "/studio",
    afterSignUp: "/studio",
    afterSignOut: "/",
  },
});