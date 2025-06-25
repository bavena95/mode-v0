"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ColorPicker } from "./color-picker"
import { ColorPalettes } from "./color-palettes"
import { ColorHarmony } from "./color-harmony"
import { GradientEditor } from "./gradient-editor"
import { useColors } from "@/hooks/use-colors"

export function ColorsPanel() {
  const colors = useColors()

  return (
    <div className="space-y-4">
      <Tabs defaultValue="picker" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/5 rounded-xl">
          <TabsTrigger value="picker" className="data-[state=active]:bg-teal-500 rounded-lg text-xs">
            Picker
          </TabsTrigger>
          <TabsTrigger value="palettes" className="data-[state=active]:bg-teal-500 rounded-lg text-xs">
            Palettes
          </TabsTrigger>
          <TabsTrigger value="harmony" className="data-[state=active]:bg-teal-500 rounded-lg text-xs">
            Harmony
          </TabsTrigger>
          <TabsTrigger value="gradients" className="data-[state=active]:bg-teal-500 rounded-lg text-xs">
            Gradients
          </TabsTrigger>
        </TabsList>

        <TabsContent value="picker" className="mt-6">
          <ColorPicker
            color={colors.currentColor}
            colorModel={colors.colorModel}
            onColorChange={colors.updateCurrentColor}
            onColorModelChange={colors.setColorModel}
            onEyedropper={colors.startEyedropper}
            showEyedropper={colors.showEyedropper}
          />
        </TabsContent>

        <TabsContent value="palettes" className="mt-6">
          <ColorPalettes
            palettes={colors.palettes}
            currentColor={colors.currentColor}
            onPaletteCreate={colors.createPalette}
            onPaletteUpdate={colors.updatePalette}
            onPaletteDelete={colors.deletePalette}
            onColorSelect={colors.updateCurrentColor}
            onAddColorToPalette={colors.addColorToPalette}
            onRemoveColorFromPalette={colors.removeColorFromPalette}
            onExtractFromImage={colors.extractColorsFromImage}
          />
        </TabsContent>

        <TabsContent value="harmony" className="mt-6">
          <ColorHarmony
            baseColor={colors.currentColor}
            currentHarmony={colors.currentHarmony}
            onGenerateHarmony={colors.generateHarmony}
            onColorSelect={colors.updateCurrentColor}
            onCreatePalette={colors.createPalette}
          />
        </TabsContent>

        <TabsContent value="gradients" className="mt-6">
          <GradientEditor
            gradients={colors.gradients}
            currentColor={colors.currentColor}
            onGradientCreate={colors.createGradient}
            onGradientUpdate={colors.updateGradient}
            onGradientDelete={colors.deleteGradient}
            onColorSelect={colors.updateCurrentColor}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
