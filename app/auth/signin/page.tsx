"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@stackframe/stack";
import { stackClientApp } from "@/lib/stack-client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
// CORREÇÃO: Adicionando Eye e EyeOff à importação
import { Mail, Lock, ArrowLeft, Eye, EyeOff, MagnetIcon as Magic } from "lucide-react"; 
import Link from "next/link";

export default function SignInPage() {
  const user = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      const redirectUrl = searchParams.get("redirect_url") || "/studio";
      router.push(redirectUrl);
    }
  }, [user, router, searchParams]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await stackClientApp.signInWithCredential({ email, password });
    } catch (err: any) {
      if (err.message?.includes('user not found')) {
        setError("No account found with this email address.");
      } else if (err.message?.includes('invalid password')) {
        setError("Incorrect password. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await stackClientApp.signInWithOAuth('google');
    } catch (err) {
      setError("Failed to sign in with Google.");
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return null; 
  }
  
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-6">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="absolute inset-0 -z-10 h-full w-full pointer-events-none bg-[radial-gradient(circle_farthest-side_at_50%_100%,hsl(var(--secondary)/0.1),transparent)]"></div>

      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
        <Card className="glass-card">
          <CardHeader className="text-center pb-6">
            <div className="w-14 h-14 bg-card border border-border rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-secondary to-primary rounded-xl flex items-center justify-center">
                <Magic className="w-7 h-7 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gradient-metallic">
              Welcome Back
            </CardTitle>
            <p className="text-muted-foreground pt-1">
              Sign in to continue to Mode Design.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 bg-red-900/50 border border-red-500/50 rounded-md text-center">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="pl-10" required />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/auth/forgot-password" passHref>
                    <span className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">Forgot password?</span>
                  </Link>
                </div>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••" 
                    className="pl-10 pr-10"
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base rounded-md">
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><Separator /></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-card text-muted-foreground">OR</span></div>
            </div>
            <Button onClick={handleGoogleSignIn} disabled={isLoading} variant="outline" className="w-full h-11">
              Continue with Google
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="font-semibold text-foreground hover:text-primary transition-colors">Sign up</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}