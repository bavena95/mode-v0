import { type NextRequest, NextResponse } from "next/server"
import { generateImage, MODE_MODEL_CONFIG } from "@/lib/fal-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { originalPrompt, refinementPrompt, mode, context, originalSeed, aspectRatio = "square", quality = 85 } = body

    if (!originalPrompt || !refinementPrompt || !mode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get model configuration
    const modelConfig = MODE_MODEL_CONFIG[mode as keyof typeof MODE_MODEL_CONFIG]
    if (!modelConfig) {
      return NextResponse.json({ error: "Invalid creative mode" }, { status: 400 })
    }

    // Adjust dimensions based on aspect ratio
    let { width, height } = modelConfig
    switch (aspectRatio) {
      case "portrait":
        width = Math.round(width * 0.75)
        break
      case "landscape":
        height = Math.round(height * 0.75)
        break
      case "wide":
        height = Math.round((width * 9) / 16)
        break
    }

    // Build refined prompt
    const refinedPrompt = `${originalPrompt}, ${refinementPrompt}, refined, improved, enhanced`
    const negativePrompt = "low quality, blurry, pixelated, distorted, worse quality, degraded"

    // Use slightly higher guidance for refinement
    const guidanceScale = modelConfig.guidance_scale + 1.0
    const inferenceSteps = Math.round(modelConfig.num_inference_steps * (quality / 100))

    console.log("Refining image with Fal AI:", {
      model: modelConfig.model,
      prompt: refinedPrompt,
      originalSeed,
      dimensions: `${width}x${height}`,
    })

    // Generate refined image
    const result = await generateImage({
      prompt: refinedPrompt,
      model: modelConfig.model,
      width,
      height,
      num_images: 1,
      guidance_scale: guidanceScale,
      num_inference_steps: inferenceSteps,
      negative_prompt: negativePrompt,
      seed: originalSeed ? Number.parseInt(originalSeed) : undefined,
    })

    return NextResponse.json({
      success: true,
      images: result.images,
      metadata: {
        prompt: refinedPrompt,
        model: modelConfig.model,
        dimensions: { width, height },
        seed: result.seed,
        inference_time: result.timings.inference,
        has_nsfw: result.has_nsfw_concepts?.[0] || false,
        refinement: refinementPrompt,
      },
    })
  } catch (error) {
    console.error("Refinement API error:", error)
    return NextResponse.json(
      {
        error: "Failed to refine image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
