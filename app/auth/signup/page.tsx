"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useUser } from "@stackframe/stack";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MagnetIcon as Magic, Mail, Lock, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { stackClientApp } from "@/lib/stack-client";

export default function SignUpPage() {
  const user = useUser();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      router.push("/studio");
    }
  }, [user, router]);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await stackClientApp.signUpWithCredential({ email, password, displayName: name });
    } catch (err) {
      setError("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      await stackClientApp.signInWithOAuth("google");
    } catch (err) {
      setError("Failed to sign up with Google.");
    } finally {
      setIsLoading(false);
    }
  };

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
              Create an Account
            </CardTitle>
            <p className="text-muted-foreground pt-1">
              Start your journey with Mode Design.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 bg-red-900/50 border border-red-500/50 rounded-md text-red-300 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="pl-10" required />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="pl-10" required />
                </div>
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-10" required />
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base rounded-md">
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><Separator /></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-card text-muted-foreground">OR</span></div>
            </div>
            <Button onClick={handleGoogleSignUp} disabled={isLoading} variant="outline" className="w-full h-11">
                Continue with Google
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/signin" className="font-semibold text-foreground hover:text-primary transition-colors">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}