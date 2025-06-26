import { Smartphone, Monitor, FileText, ShoppingBag, Zap, Palette } from "lucide-react";

export const creativeModesData = [
  { id: "social", name: "Social Media", description: "Posts, stories e conteúdo viral", icon: Smartphone, gradient: "from-pink-500 via-rose-500 to-orange-500", contexts: ["Instagram Post", "Story", "LinkedIn", "Twitter", "TikTok"] },
  { id: "marketing", name: "Marketing", description: "Campanhas e materiais promocionais", icon: Zap, gradient: "from-blue-500 via-indigo-500 to-purple-500", contexts: ["Banner Ad", "Email Header", "Landing Page", "Flyer", "Brochure"] },
  { id: "branding", name: "Branding", description: "Identidade visual e logotipos", icon: Palette, gradient: "from-emerald-500 via-teal-500 to-cyan-500", contexts: ["Logo", "Business Card", "Letterhead", "Brand Guide", "Icon Set"] },
  { id: "web", name: "Web Design", description: "Interfaces e experiências digitais", icon: Monitor, gradient: "from-violet-500 via-purple-500 to-indigo-500", contexts: ["Hero Section", "Dashboard", "Mobile App", "Website", "UI Component"] },
  { id: "print", name: "Print Design", description: "Materiais impressos profissionais", icon: FileText, gradient: "from-amber-500 via-orange-500 to-red-500", contexts: ["Poster", "Magazine", "Book Cover", "Packaging", "Invitation"] },
  { id: "ecommerce", name: "E-commerce", description: "Produtos e experiências de compra", icon: ShoppingBag, gradient: "from-green-500 via-emerald-500 to-teal-500", contexts: ["Product Photo", "Banner", "Category Page", "Checkout", "Email"] },
];

export const promptSuggestions = {
  Style: [
    { name: "Minimalista", desc: "Clean, simples, espaço em branco" },
    { name: "Maximalista", desc: "Rico em detalhes, vibrante" },
    { name: "Brutalist", desc: "Ousado, geométrico, impactante" },
    { name: "Glassmorphism", desc: "Transparente, moderno, elegante" },
  ],
  Mood: [
    { name: "Profissional", desc: "Confiável, corporativo" },
    { name: "Criativo", desc: "Artístico, inovador" },
    { name: "Luxuoso", desc: "Premium, sofisticado" },
    { name: "Jovem", desc: "Dinâmico, energético" },
  ],
  Colors: [
    { name: "Monocromático", desc: "Uma cor, várias tonalidades" },
    { name: "Complementar", desc: "Cores opostas, alto contraste" },
    { name: "Análogo", desc: "Cores próximas, harmoniosas" },
  ],

  "Aspect Ratio": [
      { name: "Square (1:1)", desc: "Ideal para posts de feed e perfis." },
      { name: "Portrait (4:5)", desc: "Ocupa mais espaço vertical no feed." },
      { name: "Story (9:16)", desc: "Formato de tela cheia para stories." },
      { name: "Landscape (16:9)", desc: "Clássico para vídeos e banners." },
  ],
};