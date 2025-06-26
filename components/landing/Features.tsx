"use client";

import { features } from "@/lib/landing-page-data";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";

// Um componente interno para criar os visuais abstratos do demo
const FeatureDemoVisual = ({ icon: Icon, gradient }) => (
  <div className="relative aspect-video w-full rounded-lg border border-border bg-card p-4 overflow-hidden shadow-inner">
    <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-bl ${gradient} opacity-20 blur-2xl`}></div>
    <div className="flex justify-between">
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white/80" />
      </div>
      <div className="w-6 h-6 rounded-md border border-border flex items-center justify-center">
        <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </div>
    <div className="mt-8 space-y-2">
      <div className="w-3/4 h-2 rounded-full bg-muted/50"></div>
      <div className="w-1/2 h-2 rounded-full bg-muted/50"></div>
    </div>
  </div>
);


export function Features() {
  return (
    <section id="features" className="relative z-10 container mx-auto px-6 py-20">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <div key={feature.title} className="flex flex-col gap-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold bg-gradient-secondary-accent bg-clip-text text-transparent">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
            <FeatureDemoVisual icon={feature.icon} gradient={feature.gradient} />
          </div>
        ))}
      </div>
    </section>
  );
}