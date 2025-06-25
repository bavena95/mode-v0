"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu"
import { Plus, Trash2, Edit, Download, Star, Palette, ImageIcon } from "lucide-react"
import type { ColorPalette, ColorValue } from "@/types/colors"

interface ColorPalettesProps {
  palettes: ColorPalette[]
  onPaletteCreate: (name: string, colors: ColorValue[]) => void
  onPaletteUpdate: (paletteId: string, updates: Partial<ColorPalette>) => void
  onPaletteDelete: (paletteId: string) => void
  onColorSelect: (color: ColorValue) => void
  onAddColorToPalette: (paletteId: string, color: ColorValue) => void
  onRemoveColorFromPalette: (paletteId: string, colorIndex: number) => void
  onExtractFromImage?: (imageUrl: string) => Promise<ColorPalette | null>
  currentColor: ColorValue
}

const PREDEFINED_PALETTES: ColorPalette[] = [
  {
    id: "material-design",
    name: "Material Design",
    type: "predefined",
    createdAt: new Date(),
    tags: ["google", "material", "modern"],
    colors: [
      {
        hex: "#F44336",
        rgb: { r: 244, g: 67, b: 54 },
        hsl: { h: 4, s: 90, l: 58 },
        hsv: { h: 4, s: 78, v: 96 },
        cmyk: { c: 0, m: 73, y: 78, k: 4 },
        lab: { l: 53, a: 80, b: 67 },
        alpha: 1,
      },
      {
        hex: "#E91E63",
        rgb: { r: 233, g: 30, b: 99 },
        hsl: { h: 340, s: 82, l: 52 },
        hsv: { h: 340, s: 87, v: 91 },
        cmyk: { c: 0, m: 87, y: 58, k: 9 },
        lab: { l: 51, a: 75, b: 25 },
        alpha: 1,
      },
      {
        hex: "#9C27B0",
        rgb: { r: 156, g: 39, b: 176 },
        hsl: { h: 291, s: 64, l: 42 },
        hsv: { h: 291, s: 78, v: 69 },
        cmyk: { c: 11, m: 78, y: 0, k: 31 },
        lab: { l: 42, a: 67, b: -42 },
        alpha: 1,
      },
      {
        hex: "#673AB7",
        rgb: { r: 103, g: 58, b: 183 },
        hsl: { h: 262, s: 52, l: 47 },
        hsv: { h: 262, s: 68, v: 72 },
        cmyk: { c: 44, m: 68, y: 0, k: 28 },
        lab: { l: 35, a: 47, b: -64 },
        alpha: 1,
      },
      {
        hex: "#3F51B5",
        rgb: { r: 63, g: 81, b: 181 },
        hsl: { h: 231, s: 48, l: 48 },
        hsv: { h: 231, s: 65, v: 71 },
        cmyk: { c: 65, m: 55, y: 0, k: 29 },
        lab: { l: 35, a: 25, b: -58 },
        alpha: 1,
      },
      {
        hex: "#2196F3",
        rgb: { r: 33, g: 150, b: 243 },
        hsl: { h: 207, s: 90, l: 54 },
        hsv: { h: 207, s: 86, v: 95 },
        cmyk: { c: 86, m: 38, y: 0, k: 5 },
        lab: { l: 61, a: -5, b: -60 },
        alpha: 1,
      },
      {
        hex: "#03A9F4",
        rgb: { r: 3, g: 169, b: 244 },
        hsl: { h: 199, s: 98, l: 48 },
        hsv: { h: 199, s: 99, v: 96 },
        cmyk: { c: 99, m: 31, y: 0, k: 4 },
        lab: { l: 67, a: -15, b: -50 },
        alpha: 1,
      },
      {
        hex: "#00BCD4",
        rgb: { r: 0, g: 188, b: 212 },
        hsl: { h: 187, s: 100, l: 42 },
        hsv: { h: 187, s: 100, v: 83 },
        cmyk: { c: 100, m: 11, y: 0, k: 17 },
        lab: { l: 72, a: -37, b: -25 },
        alpha: 1,
      },
    ],
  },
  {
    id: "tailwind-css",
    name: "Tailwind CSS",
    type: "predefined",
    createdAt: new Date(),
    tags: ["tailwind", "utility", "modern"],
    colors: [
      {
        hex: "#EF4444",
        rgb: { r: 239, g: 68, b: 68 },
        hsl: { h: 0, s: 84, l: 60 },
        hsv: { h: 0, s: 72, v: 94 },
        cmyk: { c: 0, m: 72, y: 72, k: 6 },
        lab: { l: 55, a: 76, b: 67 },
        alpha: 1,
      },
      {
        hex: "#F97316",
        rgb: { r: 249, g: 115, b: 22 },
        hsl: { h: 25, s: 95, l: 53 },
        hsv: { h: 25, s: 91, v: 98 },
        cmyk: { c: 0, m: 54, y: 91, k: 2 },
        lab: { l: 62, a: 52, b: 85 },
        alpha: 1,
      },
      {
        hex: "#EAB308",
        rgb: { r: 234, g: 179, b: 8 },
        hsl: { h: 45, s: 93, l: 47 },
        hsv: { h: 45, s: 97, v: 92 },
        cmyk: { c: 0, m: 23, y: 97, k: 8 },
        lab: { l: 75, a: 15, b: 93 },
        alpha: 1,
      },
      {
        hex: "#22C55E",
        rgb: { r: 34, g: 197, b: 94 },
        hsl: { h: 142, s: 71, l: 45 },
        hsv: { h: 142, s: 83, v: 77 },
        cmyk: { c: 83, m: 0, y: 52, k: 23 },
        lab: { l: 73, a: -68, b: 44 },
        alpha: 1,
      },
      {
        hex: "#06B6D4",
        rgb: { r: 6, g: 182, b: 212 },
        hsl: { h: 189, s: 94, l: 43 },
        hsv: { h: 189, s: 97, v: 83 },
        cmyk: { c: 97, m: 14, y: 0, k: 17 },
        lab: { l: 70, a: -35, b: -25 },
        alpha: 1,
      },
      {
        hex: "#3B82F6",
        rgb: { r: 59, g: 130, b: 246 },
        hsl: { h: 217, s: 91, l: 60 },
        hsv: { h: 217, s: 76, v: 96 },
        cmyk: { c: 76, m: 47, y: 0, k: 4 },
        lab: { l: 55, a: 15, b: -75 },
        alpha: 1,
      },
      {
        hex: "#8B5CF6",
        rgb: { r: 139, g: 92, b: 246 },
        hsl: { h: 258, s: 90, l: 66 },
        hsv: { h: 258, s: 63, v: 96 },
        cmyk: { c: 43, m: 63, y: 0, k: 4 },
        lab: { l: 52, a: 52, b: -75 },
        alpha: 1,
      },
      {
        hex: "#A855F7",
        rgb: { r: 168, g: 85, b: 247 },
        hsl: { h: 271, s: 91, l: 65 },
        hsv: { h: 271, s: 66, v: 97 },
        cmyk: { c: 32, m: 66, y: 0, k: 3 },
        lab: { l: 54, a: 65, b: -75 },
        alpha: 1,
      },
    ],
  },
]

export function ColorPalettes({
  palettes,
  onPaletteCreate,
  onPaletteUpdate,
  onPaletteDelete,
  onColorSelect,
  onAddColorToPalette,
  onRemoveColorFromPalette,
  onExtractFromImage,
  currentColor,
}: ColorPalettesProps) {
  const [newPaletteName, setNewPaletteName] = useState("")
  const [editingPalette, setEditingPalette] = useState<string | null>(null)
  const [editName, setEditName] = useState("")

  const allPalettes = [...PREDEFINED_PALETTES, ...palettes]

  const handleCreatePalette = () => {
    if (newPaletteName.trim()) {
      onPaletteCreate(newPaletteName.trim(), [currentColor])
      setNewPaletteName("")
    }
  }

  const handleEditPalette = (palette: ColorPalette) => {
    setEditingPalette(palette.id)
    setEditName(palette.name)
  }

  const handleSaveEdit = () => {
    if (editingPalette && editName.trim()) {
      onPaletteUpdate(editingPalette, { name: editName.trim() })
      setEditingPalette(null)
      setEditName("")
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !onExtractFromImage) return

    const imageUrl = URL.createObjectURL(file)
    try {
      await onExtractFromImage(imageUrl)
    } finally {
      URL.revokeObjectURL(imageUrl)
    }
  }

  const exportPalette = (palette: ColorPalette) => {
    const data = {
      name: palette.name,
      colors: palette.colors.map((c) => c.hex),
      type: palette.type,
      tags: palette.tags,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${palette.name.toLowerCase().replace(/\s+/g, "-")}-palette.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Label className="text-white font-semibold text-lg flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Color Palettes
        </Label>
        <div className="flex items-center gap-2">
          {onExtractFromImage && (
            <label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white h-8 w-8 p-0" asChild>
                <span>
                  <ImageIcon className="w-4 h-4" />
                </span>
              </Button>
            </label>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 h-8 w-8 p-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 text-white">
              <DialogHeader>
                <DialogTitle>Create New Palette</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-400 mb-2 block">Palette Name</Label>
                  <Input
                    value={newPaletteName}
                    onChange={(e) => setNewPaletteName(e.target.value)}
                    placeholder="Enter palette name..."
                    className="bg-white/5 border-white/10 text-white"
                    onKeyDown={(e) => e.key === "Enter" && handleCreatePalette()}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setNewPaletteName("")}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePalette} disabled={!newPaletteName.trim()}>
                    Create Palette
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Palettes List */}
      <ScrollArea className="h-96">
        <div className="space-y-4">
          {allPalettes.map((palette) => (
            <ContextMenu key={palette.id}>
              <ContextMenuTrigger>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    {editingPalette === palette.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="h-6 bg-white/5 border-white/10 text-white text-sm"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit()
                            if (e.key === "Escape") setEditingPalette(null)
                          }}
                          autoFocus
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSaveEdit}
                          className="h-6 w-6 p-0 text-green-400"
                        >
                          ✓
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-white">{palette.name}</h3>
                        {palette.type === "predefined" && <Star className="w-3 h-3 text-yellow-400 fill-current" />}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-400">{palette.colors.length} colors</span>
                      {palette.type !== "predefined" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onAddColorToPalette(palette.id, currentColor)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Color Grid */}
                  <div className="grid grid-cols-8 gap-2">
                    {palette.colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => onColorSelect(color)}
                        className="w-8 h-8 rounded-lg border border-white/20 hover:scale-110 transition-transform shadow-sm"
                        style={{ backgroundColor: color.hex }}
                        title={color.hex}
                      />
                    ))}
                  </div>

                  {/* Tags */}
                  {palette.tags && palette.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {palette.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-white/10 text-gray-400 text-xs rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </ContextMenuTrigger>

              <ContextMenuContent className="bg-slate-900 border-slate-700">
                {palette.type !== "predefined" && (
                  <>
                    <ContextMenuItem onClick={() => handleEditPalette(palette)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Name
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => onAddColorToPalette(palette.id, currentColor)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Current Color
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                  </>
                )}
                <ContextMenuItem onClick={() => exportPalette(palette)}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Palette
                </ContextMenuItem>
                {palette.type !== "predefined" && (
                  <>
                    <ContextMenuSeparator />
                    <ContextMenuItem onClick={() => onPaletteDelete(palette.id)} className="text-red-400">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Palette
                    </ContextMenuItem>
                  </>
                )}
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
