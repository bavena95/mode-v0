"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Wand2, Sparkles, Settings, History } from 'lucide-react'
import { creativeModesData, promptSuggestions } from '@/lib/mock-data'
import type { GenerationRequest, GenerationResult } from '@/types/studio'

interface GenerationPanelProps {
  onGenerate: (request: GenerationRequest) => Promise<GenerationResult | null>
  isGenerating: boolean
  generationHistory: GenerationResult[]
}

export function GenerationPanel({ onGenerate, isGenerating, generationHistory }: GenerationPanelProps) {
  const [prompt, setPrompt] = useState('')
  const [selectedMode, setSelectedMode] = useState(creativeModesData[0])
  const [selectedContext, setSelectedContext] = useState(creativeModesData[0].contexts[0])
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([])
  const [aspectRatio, setAspectRatio] = useState('square')
  const [quality, setQuality] = useState(85)
  const [numImages, setNumImages] = useState(1)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    const request: GenerationRequest = {
      prompt: prompt.trim(),
      mode: selectedMode.id,
      context: selectedContext,
      selectedSuggestions,
      aspectRatio,
      quality,
      numImages
    }

    await onGenerate(request)
  }

  const toggleSuggestion = (suggestion: string) => {
    setSelectedSuggestions(prev => 
      prev.includes(suggestion)
        ? prev.filter(s => s !== suggestion)
        : [...prev, suggestion]
    )
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-blue-500" />
          AI Generation
        </h2>
      </div>

      <Tabs defaultValue="generate" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 m-4 mb-0">
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="flex-1 p-4 space-y-4">
          {/* Prompt Input */}
          <div>
            <label className="text-sm font-medium mb-2 block">Prompt</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to create..."
              className="min-h-20"
            />
          </div>

          {/* Creative Mode */}
          <div>
            <label className="text-sm font-medium mb-2 block">Creative Mode</label>
            <Select value={selectedMode.id} onValueChange={(value) => {
              const mode = creativeModesData.find(m => m.id === value)
              if (mode) {
                setSelectedMode(mode)
                setSelectedContext(mode.contexts[0])
              }
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {creativeModesData.map((mode) => (
                  <SelectItem key={mode.id} value={mode.id}>
                    {mode.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Context */}
          <div>
            <label className="text-sm font-medium mb-2 block">Context</label>
            <Select value={selectedContext} onValueChange={setSelectedContext}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {selectedMode.contexts.map((context) => (
                  <SelectItem key={context} value={context}>
                    {context}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Style Suggestions */}
          <div>
            <label className="text-sm font-medium mb-2 block">Style Suggestions</label>
            <div className="space-y-2">
              {Object.entries(promptSuggestions).map(([category, suggestions]) => (
                <div key={category}>
                  <p className="text-xs text-gray-500 mb-1">{category}</p>
                  <div className="flex flex-wrap gap-1">
                    {suggestions.map((suggestion) => (
                      <Badge
                        key={suggestion.name}
                        variant={selectedSuggestions.includes(suggestion.name) ? "default" : "outline"}
                        className="cursor-pointer text-xs"
                        onClick={() => toggleSuggestion(suggestion.name)}
                      >
                        {suggestion.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button 
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Image
              </>
            )}
          </Button>
        </TabsContent>

        <TabsContent value="settings" className="flex-1 p-4 space-y-4">
          {/* Aspect Ratio */}
          <div>
            <label className="text-sm font-medium mb-2 block">Aspect Ratio</label>
            <Select value={aspectRatio} onValueChange={setAspectRatio}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="square">Square (1:1)</SelectItem>
                <SelectItem value="portrait">Portrait (4:5)</SelectItem>
                <SelectItem value="landscape">Landscape (16:9)</SelectItem>
                <SelectItem value="wide">Wide (21:9)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quality */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Quality: {quality}%
            </label>
            <Slider
              value={[quality]}
              onValueChange={([value]) => setQuality(value)}
              min={50}
              max={100}
              step={5}
            />
          </div>

          {/* Number of Images */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Images: {numImages}
            </label>
            <Slider
              value={[numImages]}
              onValueChange={([value]) => setNumImages(value)}
              min={1}
              max={4}
              step={1}
            />
          </div>
        </TabsContent>

        <TabsContent value="history" className="flex-1 p-4">
          <div className="space-y-2">
            {generationHistory.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No generations yet</p>
              </div>
            ) : (
              generationHistory.map((result) => (
                <Card key={result.id} className="cursor-pointer hover:bg-gray-50">
                  <CardContent className="p-3">
                    <img 
                      src={result.url} 
                      alt="Generated"
                      className="w-full h-20 object-cover rounded mb-2"
                    />
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {result.prompt}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}