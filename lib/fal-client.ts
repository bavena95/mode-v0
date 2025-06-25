import * as fal from "@fal-ai/serverless-client"

// Configure Fal client
fal.config({
  credentials: process.env.FAL_KEY,
})

export interface GenerationRequest {
  prompt: string
  model?: string
  width?: number
  height?: number
  num_images?: number
  guidance_scale?: number
  num_inference_steps?: number
  seed?: number
  style?: string
  negative_prompt?: string
}

export interface GenerationResult {
  images: Array<{
    url: string
    width: number
    height: number
    content_type: string
  }>
  timings: {
    inference: number
  }
  seed: number
  has_nsfw_concepts: boolean[]
  prompt: string
}

// Available Fal AI models for different use cases
export const FAL_MODELS = {
  // High quality general purpose
  "flux-pro": "fal-ai/flux-pro",
  "flux-dev": "fal-ai/flux/dev",
  "flux-schnell": "fal-ai/flux/schnell",

  // Specialized models
  "stable-diffusion-xl": "fal-ai/stable-diffusion-xl",
  "stable-diffusion-3": "fal-ai/stable-diffusion-v3-medium",

  // Style-specific models
  "realistic-vision": "fal-ai/realistic-vision",
  anime: "fal-ai/anime-diffusion",
  photorealism: "fal-ai/photorealism",

  // Fast generation
  lightning: "fal-ai/lightning",
  turbo: "fal-ai/stable-diffusion-xl-turbo",
}

// Model configurations for different creative modes
export const MODE_MODEL_CONFIG = {
  social: {
    model: FAL_MODELS["flux-schnell"],
    width: 1024,
    height: 1024,
    guidance_scale: 7.5,
    num_inference_steps: 4,
  },
  marketing: {
    model: FAL_MODELS["flux-pro"],
    width: 1024,
    height: 768,
    guidance_scale: 8.0,
    num_inference_steps: 20,
  },
  branding: {
    model: FAL_MODELS["stable-diffusion-xl"],
    width: 1024,
    height: 1024,
    guidance_scale: 9.0,
    num_inference_steps: 25,
  },
  web: {
    model: FAL_MODELS["flux-dev"],
    width: 1920,
    height: 1080,
    guidance_scale: 7.0,
    num_inference_steps: 15,
  },
  print: {
    model: FAL_MODELS["photorealism"],
    width: 2048,
    height: 2048,
    guidance_scale: 8.5,
    num_inference_steps: 30,
  },
  ecommerce: {
    model: FAL_MODELS["realistic-vision"],
    width: 1024,
    height: 1024,
    guidance_scale: 8.0,
    num_inference_steps: 20,
  },
}

// Context-specific prompt enhancements
export const CONTEXT_PROMPTS = {
  "Instagram Post": "social media post, square format, engaging, trendy, high quality",
  Story: "vertical story format, mobile-friendly, eye-catching, modern",
  LinkedIn: "professional, business-oriented, clean, corporate",
  Twitter: "concise, impactful, social media optimized",
  TikTok: "dynamic, youthful, vibrant, engaging",

  "Banner Ad": "advertising banner, promotional, attention-grabbing, commercial",
  "Email Header": "email marketing, header design, professional, branded",
  "Landing Page": "web landing page, conversion-focused, modern UI",
  Flyer: "promotional flyer, print-ready, informative, attractive",
  Brochure: "tri-fold brochure, professional, detailed, corporate",

  Logo: "logo design, brand identity, simple, memorable, scalable",
  "Business Card": "business card design, professional, contact information",
  Letterhead: "company letterhead, official, branded, professional",
  "Brand Guide": "brand guidelines, style guide, consistent, professional",
  "Icon Set": "icon collection, consistent style, minimal, functional",

  "Hero Section": "website hero section, modern web design, UI/UX",
  Dashboard: "admin dashboard, data visualization, clean interface",
  "Mobile App": "mobile app interface, user-friendly, modern design",
  Website: "website design, responsive, modern, user experience",
  "UI Component": "user interface component, functional, modern design",

  Poster: "poster design, large format, impactful, print-ready",
  Magazine: "magazine layout, editorial design, professional",
  "Book Cover": "book cover design, attractive, genre-appropriate",
  Packaging: "product packaging, retail-ready, branded",
  Invitation: "event invitation, elegant, informative",

  "Product Photo": "product photography, e-commerce, clean background",
  "Category Page": "e-commerce category, product grid, shopping",
  Checkout: "checkout interface, user-friendly, conversion-optimized",
  Email: "e-commerce email, promotional, product-focused",
}

export async function generateImage(request: GenerationRequest): Promise<GenerationResult> {
  try {
    const result = await fal.subscribe(request.model || FAL_MODELS["flux-schnell"], {
      input: {
        prompt: request.prompt,
        image_size: `${request.width || 1024}x${request.height || 1024}`,
        num_images: request.num_images || 1,
        guidance_scale: request.guidance_scale || 7.5,
        num_inference_steps: request.num_inference_steps || 20,
        seed: request.seed,
        negative_prompt: request.negative_prompt,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("Generation progress:", update.logs?.map((log) => log.message).join("\n"))
        }
      },
    })

    return result as GenerationResult
  } catch (error) {
    console.error("Fal AI generation error:", error)
    throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export function buildEnhancedPrompt(
  userPrompt: string,
  mode: string,
  context: string,
  selectedSuggestions: string[] = [],
): string {
  const contextPrompt = CONTEXT_PROMPTS[context as keyof typeof CONTEXT_PROMPTS] || ""
  const suggestionsText = selectedSuggestions.length > 0 ? selectedSuggestions.join(", ") : ""

  let enhancedPrompt = userPrompt

  if (contextPrompt) {
    enhancedPrompt += `, ${contextPrompt}`
  }

  if (suggestionsText) {
    enhancedPrompt += `, ${suggestionsText}`
  }

  // Add quality enhancers
  enhancedPrompt += ", high quality, detailed, professional, 4k resolution"

  return enhancedPrompt
}

export function getNegativePrompt(mode: string): string {
  const baseNegative =
    "low quality, blurry, pixelated, distorted, ugly, bad anatomy, watermark, signature, text overlay"

  const modeSpecificNegative = {
    social: "unprofessional, cluttered, hard to read",
    marketing: "boring, generic, low engagement",
    branding: "complex, hard to reproduce, inconsistent",
    web: "outdated, non-responsive, poor UX",
    print: "low resolution, poor color reproduction",
    ecommerce: "unappealing, poor lighting, distracting background",
  }

  return `${baseNegative}, ${modeSpecificNegative[mode as keyof typeof modeSpecificNegative] || ""}`
}
