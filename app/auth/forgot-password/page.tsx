"use client";

import { useState } from "react";
import { useUser } from "@stackframe/stack"; // Apenas useUser
import { Button } from "@/components/ui/button";
// ... outros imports

export default function ForgotPasswordPage() {
  // CORREÇÃO: Desestruturando a função correta
  const { sendPasswordResetEmail } = useUser();
  
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");
    try {
      // CORREÇÃO: Chamando a função desestruturada
      await sendPasswordResetEmail({ email });
      setMessage("If an account exists for this email, a password reset link has been sent.");
    } catch (err: any) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ... resto do JSX
}