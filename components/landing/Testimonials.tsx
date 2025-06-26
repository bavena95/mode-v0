"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { testimonials } from "@/lib/landing-page-data";

export function Testimonials() {
  return (
    <section id="testimonials" className="relative z-10 container mx-auto px-6 py-20">
       <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient-metallic">
          Loved by the Best Creators
        </h2>
        <p className="text-xl max-w-3xl mx-auto text-muted-foreground">
          See what professionals are saying about their creative workflows with Mode Design.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
           <Card key={testimonial.name} className="bg-card border-border">
            <CardContent className="p-8">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="mb-6 leading-relaxed text-foreground">
                "{testimonial.content}"
              </blockquote>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}