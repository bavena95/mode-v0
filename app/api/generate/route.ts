import { type NextRequest, NextResponse } from "next/server"
import { generateImage, buildEnhancedPrompt, getNegativePrompt, MODE_MODEL_CONFIG } from "@/lib/fal-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      prompt,
      mode,
      context,
      selectedSuggestions = [],
      aspectRatio = "square",
      quality = 85,
      numImages = 1,
      seed,
    } = body

    if (!prompt || !mode || !context) {
      return NextResponse.json({ error: "Missing required fields: prompt, mode, context" }, { status: 400 })
    }

    // Get model configuration for the selected mode
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

    // Build enhanced prompt
    const enhancedPrompt = buildEnhancedPrompt(prompt, mode, context, selectedSuggestions)
    const negativePrompt = getNegativePrompt(mode)

    // Adjust inference steps based on quality
    const inferenceSteps = Math.round(modelConfig.num_inference_steps * (quality / 100))

    console.log("Generating image with Fal AI:", {
      model: modelConfig.model,
      prompt: enhancedPrompt,
      dimensions: `${width}x${height}`,
      steps: inferenceSteps,
    })

    // Generate image with Fal AI
    const result = await generateImage({
      prompt: enhancedPrompt,
      model: modelConfig.model,
      width,
      height,
      num_images: numImages,
      guidance_scale: modelConfig.guidance_scale,
      num_inference_steps: inferenceSteps,
      negative_prompt: negativePrompt,
      seed: seed ? Number.parseInt(seed) : undefined,
    })

    // Return the result
    return NextResponse.json({
      success: true,
      images: result.images,
      metadata: {
        prompt: enhancedPrompt,
        model: modelConfig.model,
        dimensions: { width, height },
        seed: result.seed,
        inference_time: result.timings.inference,
        has_nsfw: result.has_nsfw_concepts?.[0] || false,
      },
    })
  } catch (error) {
    console.error("Generation API error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
