"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AuthButton } from "@/components/auth/auth-button"
import {
  Sparkles,
  Zap,
  Video,
  Star,
  Check,
  Moon,
  Sun,
  Play,
  ChevronRight,
  MagnetIcon as Magic,
  Wand2,
  Layers,
  Brush,
} from "lucide-react"
import Link from "next/link"

const features = [
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
]

const testimonials = [
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
]

const stats = [
  { value: "50K+", label: "Designs Created" },
  { value: "2.5M+", label: "AI Generations" },
  { value: "98%", label: "User Satisfaction" },
  { value: "5min", label: "Avg. Creation Time" },
]

export default function HomePage() {
  const [isDark, setIsDark] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDark
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-50"
      }`}
    >
      {/* MailBuddy-style Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
            isDark
              ? "bg-gradient-to-r from-teal-500/20 to-green-500/20"
              : "bg-gradient-to-r from-teal-200/40 to-green-200/40"
          }`}
        ></div>
        <div
          className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000 ${
            isDark
              ? "bg-gradient-to-r from-cyan-500/20 to-emerald-500/20"
              : "bg-gradient-to-r from-cyan-200/40 to-emerald-200/40"
          }`}
        ></div>
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-2xl animate-spin ${
            isDark
              ? "bg-gradient-conic from-transparent via-teal-500/10 to-transparent"
              : "bg-gradient-conic from-transparent via-teal-300/20 to-transparent"
          }`}
          style={{ animationDuration: "20s" }}
        ></div>
      </div>

      {/* Header */}
      <header
        className={`relative z-50 ${
          isDark
            ? "bg-slate-950/80 backdrop-blur-2xl border-b border-slate-800"
            : "bg-white/80 backdrop-blur-2xl border-b border-gray-200"
        } sticky top-0`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/25">
                <Magic className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Mode Design</h1>
                <p className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  AI Creative Studio
                </p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className={`text-sm font-medium transition-colors ${
                  isDark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Features
              </a>
              <a
                href="#testimonials"
                className={`text-sm font-medium transition-colors ${
                  isDark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                className={`text-sm font-medium transition-colors ${
                  isDark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Pricing
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className={`rounded-xl ${
                  isDark
                    ? "text-gray-400 hover:text-white hover:bg-slate-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <AuthButton isDark={isDark} />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div
          className={`text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {/* MailBuddy-style accent line */}
          <div className="w-16 h-1 bg-gradient-to-r from-teal-500 to-green-500 rounded-full mx-auto mb-8"></div>

          <h1
            className={`text-6xl md:text-7xl font-bold mb-8 leading-tight ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Your AI-Powered
            <br />
            Design Companion
          </h1>

          <p
            className={`text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Mode Design transforms your ideas into professional designs with smart AI creativity and intelligent
            assistance, making design simple and efficient
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="h-14 px-8 bg-black hover:bg-gray-800 text-white rounded-2xl shadow-lg text-lg font-medium"
              >
                Start for free
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className={`h-14 px-8 rounded-2xl text-lg font-medium ${
                isDark
                  ? "border-slate-700 bg-slate-800/50 text-white hover:bg-slate-700"
                  : "border-gray-300 bg-white/50 text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center p-6 rounded-2xl backdrop-blur-sm ${
                  isDark ? "bg-slate-800/30 border border-slate-700" : "bg-white/60 border border-gray-200"
                }`}
              >
                <div
                  className={`text-3xl font-bold mb-2 ${
                    isDark
                      ? "bg-gradient-to-r from-teal-400 to-green-400 bg-clip-text text-transparent"
                      : "bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent"
                  }`}
                >
                  {stat.value}
                </div>
                <div className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MailBuddy-style Hero Visual */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="relative max-w-6xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            {/* Aurora/Northern Lights Background */}
            <div className="h-96 bg-gradient-to-br from-teal-400 via-cyan-400 to-green-400 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-teal-600/50 via-transparent to-cyan-300/30"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-green-400/30 to-emerald-500/40"></div>

              {/* Floating Design Elements */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-8 opacity-20">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30"
                      style={{
                        animationDelay: `${i * 0.2}s`,
                        animation: "float 6s ease-in-out infinite",
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Interface Preview */}
            <div className="absolute bottom-8 left-8 right-8">
              <div
                className={`rounded-2xl shadow-2xl overflow-hidden ${
                  isDark ? "bg-slate-900/90" : "bg-white/90"
                } backdrop-blur-xl border ${isDark ? "border-slate-700" : "border-gray-200"}`}
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className={`text-sm font-medium ml-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                      Mode Design Studio
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className={`h-4 rounded ${isDark ? "bg-slate-700" : "bg-gray-200"} w-3/4`}></div>
                    <div className={`h-4 rounded ${isDark ? "bg-slate-700" : "bg-gray-200"} w-1/2`}></div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-green-500 rounded-lg"></div>
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg"></div>
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
            Everything you need to create
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Powerful AI tools designed for creators, marketers, and designers who demand excellence
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className={`group cursor-pointer transition-all duration-300 hover:scale-105 ${
                  isDark
                    ? "bg-slate-800/50 backdrop-blur-xl border-slate-700 hover:border-slate-600"
                    : "bg-white/60 backdrop-blur-xl border-gray-200 hover:border-gray-300"
                }`}
              >
                <CardContent className="p-8">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                    {feature.title}
                  </h3>
                  <p className={`leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
            Loved by creators worldwide
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Join thousands of designers, marketers, and creators who've transformed their workflow
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className={`${
                isDark
                  ? "bg-slate-800/50 backdrop-blur-xl border-slate-700"
                  : "bg-white/60 backdrop-blur-xl border-gray-200"
              }`}
            >
              <CardContent className="p-8">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-green-500 fill-current" />
                  ))}
                </div>
                <p className={`mb-6 leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{testimonial.name}</p>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <Card
          className={`text-center p-12 ${
            isDark
              ? "bg-gradient-to-r from-teal-500/10 via-green-500/10 to-emerald-500/10 backdrop-blur-xl border-teal-500/20"
              : "bg-gradient-to-r from-teal-50 via-green-50 to-emerald-50 backdrop-blur-xl border-teal-200"
          }`}
        >
          <CardContent>
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
              Ready to transform your creativity?
            </h2>
            <p className={`text-xl mb-8 max-w-2xl mx-auto ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Join thousands of creators who've already discovered the future of design
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="h-14 px-8 bg-black hover:bg-gray-800 text-white rounded-2xl shadow-lg text-lg font-medium"
              >
                Start for free
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className={`h-14 px-8 rounded-2xl text-lg font-medium ${
                  isDark
                    ? "border-slate-700 bg-slate-800/50 text-white hover:bg-slate-700"
                    : "border-gray-300 bg-white/50 text-gray-900 hover:bg-gray-50"
                }`}
              >
                View Examples
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className={isDark ? "text-gray-400" : "text-gray-600"}>Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className={isDark ? "text-gray-400" : "text-gray-600"}>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className={isDark ? "text-gray-400" : "text-gray-600"}>Cancel anytime</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer
        className={`relative z-10 border-t ${
          isDark ? "border-slate-800 bg-slate-900/50" : "border-gray-200 bg-white/50"
        } backdrop-blur-xl`}
      >
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-green-500 rounded-xl flex items-center justify-center">
                  <Magic className="w-5 h-5 text-white" />
                </div>
                <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Mode Design</h3>
              </div>
              <p className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                AI-powered creative studio for the next generation of designers and creators.
              </p>
            </div>

            <div>
              <h4 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Product</h4>
              <ul className="space-y-2">
                {["Features", "Pricing", "API", "Integrations"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className={`text-sm transition-colors ${
                        isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Company</h4>
              <ul className="space-y-2">
                {["About", "Blog", "Careers", "Contact"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className={`text-sm transition-colors ${
                        isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Support</h4>
              <ul className="space-y-2">
                {["Help Center", "Community", "Status", "Privacy"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className={`text-sm transition-colors ${
                        isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={`border-t pt-8 mt-8 text-center ${isDark ? "border-slate-800" : "border-gray-200"}`}>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              © 2024 Mode Design. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  )
}
