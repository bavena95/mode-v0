// lib/landing-page-data.ts
import { Sparkles, Wand2, Layers, Brush, Video, Zap } from "lucide-react";

export const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Creation",
    description: "Generate stunning visuals with advanced AI models trained on millions of design patterns",
    gradient: "from-teal-500 to-green-500",
  },
  {
    icon: Wand2,
    title: "Smart Prompt Assistant",
    description: "Get contextual suggestions to craft the perfect prompt for your creative vision",
    gradient: "from-cyan-500 to-teal-500",
  },
  {
    icon: Layers,
    title: "Creative Modes",
    description: "Specialized modes for social media, branding, marketing, and more creative contexts",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    icon: Brush,
    title: "Real-time Refinement",
    description: "Iterate and refine your creations with intelligent AI-powered adjustments",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Video,
    title: "Images & Videos",
    description: "Create both static images and dynamic video content from a single prompt",
    gradient: "from-teal-500 to-cyan-500",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate professional-quality designs in seconds, not hours",
    gradient: "from-cyan-500 to-green-500",
  },
];

export const testimonials = [
  {
    name: "Sarah Chen",
    role: "Creative Director",
    company: "TechFlow",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "Mode Design transformed our creative workflow. What used to take hours now takes minutes.",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Marketing Manager",
    company: "GrowthLab",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "The AI understands context better than any tool I've used. Our engagement rates increased 300%.",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "Brand Designer",
    company: "Pixel Studio",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "Finally, a design tool that thinks like a designer. The creative modes are game-changing.",
    rating: 5,
  },
];

export const stats = [
  { value: "50K+", label: "Designs Created" },
  { value: "2.5M+", label: "AI Generations" },
  { value: "98%", label: "User Satisfaction" },
  { value: "5min", label: "Avg. Creation Time" },
];