"use client";
import Link from "next/link";
import { Button } from "../ui/button";

export function CTA() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6 text-center flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-bold max-w-3xl text-gradient-metallic">
          Stop wasting time on email. Start focusing on what matters.
        </h2>
        <p className="mt-6 mb-8 max-w-xl text-lg text-muted-foreground">
          Join thousands of users who are automating their inbox and gaining hours back every week.
        </p>
        <Link href="/auth/signup">
          <Button size="lg" className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base rounded-md">
            Get Started for Free
          </Button>
        </Link>
      </div>
    </section>
  )
}