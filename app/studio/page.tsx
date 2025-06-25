"use client"

import { useState, useEffect, useCallback } from "react"
import { useUser } from "@stackframe/stack"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Download,
  Share2,
  Undo2,
  Redo2,
  Palette,
  MagnetIcon as Magic,
  Smartphone,
  Monitor,
  FileText,
  ShoppingBag,
  Zap,
  User,
  Settings,
  LogOut,
  Home,
  Crown,
} from "lucide-react"
import Link from "next/link"

// Import custom hooks and components
import { useCanvas } from "@/hooks/use-canvas"
import { useHistory } from "@/hooks/use-history"
import { useNotifications } from "@/hooks/use-notifications"
import { HistoryPanel } from "@/components/studio/history-panel"
import { Notifications } from "@/components/studio/notifications"
import { ExportDialog } from "@/components/studio/export-dialog"

// Import the new layer components and hooks
import { useLayers } from "@/hooks/use-layers"
import { LayersPanel } from "@/components/studio/layers-panel"
import { LayerEffectsPanel } from "@/components/studio/layer-effects-panel"

// Adicionar aos imports existentes
import { useMasks } from "@/hooks/use-masks"
import { MasksPanel } from "@/components/studio/masks-panel"

// Adicionar após os imports existentes:
import { ColorsPanel } from "@/components/studio/colors-panel"

const creativeModesData = [
  {
    id: "social",
    name: "Social Media",
    description: "Posts, stories e conteúdo viral",
    icon: Smartphone,
    gradient: "from-pink-500 via-rose-500 to-orange-500",
    contexts: ["Instagram Post", "Story", "LinkedIn", "Twitter", "TikTok"],
  },
  {
    id: "marketing",
    name: "Marketing",
    description: "Campanhas e materiais promocionais",
    icon: Zap,
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
    contexts: ["Banner Ad", "Email Header", "Landing Page", "Flyer", "Brochure"],
  },
  {
    id: "branding",
    name: "Branding",
    description: "Identidade visual e logotipos",
    icon: Palette,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    contexts: ["Logo", "Business Card", "Letterhead", "Brand Guide", "Icon Set"],
  },
  {
    id: "web",
    name: "Web Design",
    description: "Interfaces e experiências digitais",
    icon: Monitor,
    gradient: "from-violet-500 via-purple-500 to-indigo-500",
    contexts: ["Hero Section", "Dashboard", "Mobile App", "Website", "UI Component"],
  },
  {
    id: "print",
    name: "Print Design",
    description: "Materiais impressos profissionais",
    icon: FileText,
    gradient: "from-amber-500 via-orange-500 to-red-500",
    contexts: ["Poster", "Magazine", "Book Cover", "Packaging", "Invitation"],
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    description: "Produtos e experiências de compra",
    icon: ShoppingBag,
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    contexts: ["Product Photo", "Banner", "Category Page", "Checkout", "Email"],
  },
]

const promptSuggestions = {
  style: [
    { name: "Minimalista", desc: "Clean, simples, espaço em branco" },
    { name: "Maximalista", desc: "Rico em detalhes, vibrante" },
    { name: "Brutalist", desc: "Ousado, geométrico, impactante" },
    { name: "Glassmorphism", desc: "Transparente, moderno, elegante" },
    { name: "Neumorphism", desc: "Suave, tátil, dimensional" },
    { name: "Art Deco", desc: "Luxuoso, geométrico, vintage" },
  ],
  mood: [
    { name: "Profissional", desc: "Confiável, corporativo" },
    { name: "Criativo", desc: "Artístico, inovador" },
    { name: "Luxuoso", desc: "Premium, sofisticado" },
    { name: "Jovem", desc: "Dinâmico, energético" },
    { name: "Calmo", desc: "Sereno, minimalista" },
    { name: "Ousado", desc: "Impactante, vibrante" },
  ],
  colors: [
    { name: "Monocromático", desc: "Uma cor, várias tonalidades" },
    { name: "Complementar", desc: "Cores opostas, alto contraste" },
    { name: "Análogo", desc: "Cores próximas, harmoniosas" },
    { name: "Triádico", desc: "Três cores equilibradas" },
    { name: "Gradiente", desc: "Transições suaves de cor" },
    { name: "Neon", desc: "Cores vibrantes, fluorescentes" },
  ],
}

// Mock user projects data
const getUserProjects = (userId: string) => [
  {
    id: 1,
    type: "image",
    url: "/placeholder.svg?height=400&width=400",
    prompt: "Modern minimalist social media post with gradient background",
    mode: "social",
    context: "Instagram Post",
    variations: 4,
    quality: 95,
    timestamp: "2 min ago",
    userId,
    isFavorite: true,
  },
  {
    id: 2,
    type: "image",
    url: "/placeholder.svg?height=400&width=400",
    prompt: "Luxury brand logo with golden accents",
    mode: "branding",
    context: "Logo",
    variations: 6,
    quality: 98,
    timestamp: "5 min ago",
    userId,
    isFavorite: false,
  },
  {
    id: 3,
    type: "video",
    url: "/placeholder.svg?height=400&width=400",
    prompt: "Animated product showcase with smooth transitions",
    mode: "ecommerce",
    context: "Product Video",
    variations: 3,
    quality: 92,
    timestamp: "8 min ago",
    userId,
    isFavorite: true,
  },
]

export default function StudioPage() {
  const user = useUser()
  const router = useRouter()

  // Custom hooks
  const canvas = useCanvas()
  const history = useHistory()
  const notifications = useNotifications()

  // Add layers state to the component
  const layers = useLayers()

  // Adicionar após os hooks existentes
  const masks = useMasks()

  // State management
  const [selectedMode, setSelectedMode] = useState(creativeModesData[0])
  const [selectedContext, setSelectedContext] = useState(creativeModesData[0].contexts[0])
  const [selectedResult, setSelectedResult] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [refinementPrompt, setRefinementPrompt] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState("create")
  const [showAssistant, setShowAssistant] = useState(false)
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([])
  const [userProjects, setUserProjects] = useState<any[]>([])
  const [aspectRatio, setAspectRatio] = useState("square")
  const [quality, setQuality] = useState([85])
  const [error, setError] = useState("")
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [autoSave, setAutoSave] = useState(true)

  // Authentication check
  useEffect(() => {
    if (!user) {
      router.push("/auth/signin")
    } else {
      // Load user projects
      const projects = getUserProjects(user.id)
      setUserProjects(projects)
      if (projects.length > 0) {
        setSelectedResult(projects[0])
      }

      // Welcome notification
      notifications.addNotification({
        type: "info",
        title: "Welcome back!",
        message: "Your creative workspace is ready. Start generating amazing content.",
        duration: 3000,
      })
    }
  }, [user, router, notifications])

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && selectedResult) {
      const saveTimer = setTimeout(() => {
        notifications.addNotification({
          type: "success",
          title: "Auto-saved",
          message: "Your work has been automatically saved.",
          duration: 2000,
        })
      }, 5000)

      return () => clearTimeout(saveTimer)
    }
  }, [selectedResult, autoSave, notifications])

  // User avatar initials
  const userInitials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user?.primaryEmail?.slice(0, 2).toUpperCase() || "U"

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setError("")

    // Add to history
    history.addAction({
      type: "generation",
      description: `Generated ${selectedContext.toLowerCase()}`,
      data: { prompt, mode: selectedMode.id, context: selectedContext },
    })

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          mode: selectedMode.id,
          context: selectedContext,
          selectedSuggestions,
          aspectRatio: aspectRatio,
          quality: quality[0],
          numImages: 4,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Generation failed")
      }

      if (data.success && data.images?.length > 0) {
        const newProject = {
          id: Date.now(),
          type: "image",
          url: data.images[0].url,
          images: data.images,
          prompt: prompt,
          mode: selectedMode.id,
          context: selectedContext,
          variations: data.images.length,
          quality: Math.round((quality[0] / 100) * 100),
          timestamp: "Just now",
          userId: user?.id,
          metadata: data.metadata,
          isFavorite: false,
        }

        setUserProjects((prev) => [newProject, ...prev])
        setSelectedResult(newProject)
        setPrompt("")
        setSelectedSuggestions([])

        notifications.addNotification({
          type: "success",
          title: "Generation Complete!",
          message: `Your ${selectedContext.toLowerCase()} has been generated successfully.`,
          duration: 4000,
          action: {
            label: "View",
            onClick: () => setSelectedResult(newProject),
          },
        })
      } else {
        throw new Error("No images generated")
      }
    } catch (error) {
      console.error("Generation error:", error)
      const errorMsg = error instanceof Error ? error.message : "Failed to generate image"
      setError(errorMsg)
      notifications.addNotification({
        type: "error",
        title: "Generation Failed",
        message: errorMsg,
        duration: 5000,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRefine = async () => {
    if (!refinementPrompt.trim() || !selectedResult) return

    setIsGenerating(true)
    setError("")

    // Add to history
    history.addAction({
      type: "refinement",
      description: `Applied refinement: ${refinementPrompt}`,
      data: { refinementPrompt, originalResult: selectedResult },
    })

    try {
      const response = await fetch("/api/refine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalPrompt: selectedResult.prompt,
          refinementPrompt: refinementPrompt.trim(),
          mode: selectedResult.mode,
          context: selectedResult.context,
          originalSeed: selectedResult.metadata?.seed,
          aspectRatio: aspectRatio,
          quality: quality[0],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Refinement failed")
      }

      if (data.success && data.images?.length > 0) {
        const refinedProject = {
          ...selectedResult,
          id: Date.now(),
          url: data.images[0].url,
          images: data.images,
          prompt: `${selectedResult.prompt} (refined: ${refinementPrompt})`,
          timestamp: "Just now",
          metadata: data.metadata,
        }

        setUserProjects((prev) => [refinedProject, ...prev])
        setSelectedResult(refinedProject)
        setRefinementPrompt("")

        notifications.addNotification({
          type: "success",
          title: "Refinement Complete!",
          message: "Your image has been successfully refined.",
          duration: 4000,
        })
      } else {
        throw new Error("No refined images generated")
      }
    } catch (error) {
      console.error("Refinement error:", error)
      const errorMsg = error instanceof Error ? error.message : "Failed to refine image"
      setError(errorMsg)
      notifications.addNotification({
        type: "error",
        title: "Refinement Failed",
        message: errorMsg,
        duration: 5000,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleSuggestion = (suggestion: string) => {
    setSelectedSuggestions((prev) =>
      prev.includes(suggestion) ? prev.filter((s) => s !== suggestion) : [...prev, suggestion],
    )
  }

  const toggleFavorite = (projectId: number) => {
    setUserProjects((prev) =>
      prev.map((project) => (project.id === projectId ? { ...project, isFavorite: !project.isFavorite } : project)),
    )

    const project = userProjects.find((p) => p.id === projectId)
    if (project) {
      notifications.addNotification({
        type: "info",
        title: project.isFavorite ? "Removed from favorites" : "Added to favorites",
        message: `"${project.prompt.slice(0, 30)}..." ${project.isFavorite ? "removed from" : "added to"} your favorites.`,
        duration: 3000,
      })
    }
  }

  const handleExport = (options: any) => {
    notifications.addNotification({
      type: "success",
      title: "Export Started",
      message: `Exporting as ${options.format.toUpperCase()}...`,
      duration: 3000,
    })

    // Simulate export process
    setTimeout(() => {
      notifications.addNotification({
        type: "success",
        title: "Export Complete!",
        message: "Your image has been downloaded successfully.",
        duration: 4000,
        action: {
          label: "Open Folder",
          onClick: () => console.log("Opening downloads folder..."),
        },
      })
    }, 2000)
  }

  const handleShare = () => {
    if (selectedResult) {
      navigator.clipboard.writeText(selectedResult.url)
      notifications.addNotification({
        type: "success",
        title: "Link Copied!",
        message: "Image link has been copied to your clipboard.",
        duration: 3000,
      })
    }
  }

  const handleUndo = () => {
    const action = history.undo()
    if (action) {
      notifications.addNotification({
        type: "info",
        title: "Undone",
        message: `Undid: ${action.description}`,
        duration: 2000,
      })
    }
  }

  const handleRedo = () => {
    const action = history.redo()
    if (action) {
      notifications.addNotification({
        type: "info",
        title: "Redone",
        message: `Redid: ${action.description}`,
        duration: 2000,
      })
    }
  }

  // Adicionar após as outras funções
  const handleMaskCreate = useCallback(
    (layerId: string, type: any) => {
      let newMask
      switch (type) {
        case "alpha":
          newMask = masks.createAlphaMask(800, 600)
          break
        case "vector":
          newMask = masks.createVectorMask()
          break
        case "clipping":
          newMask = masks.createClippingMask()
          break
        case "gradient":
          newMask = masks.createGradientMask()
          break
        case "selection":
          newMask = masks.createSelectionMask("rectangle", [], { x: 0, y: 0, width: 100, height: 100 })
          break
        default:
          return
      }

      const layer = layers.getLayerById(layerId)
      if (layer) {
        const updatedMasks = [...(layer.masks || []), newMask]
        layers.updateLayer(layerId, { masks: updatedMasks })
        masks.setSelectedMaskId(newMask.id)

        notifications.addNotification({
          type: "success",
          title: "Mask Created",
          message: `${newMask.name} has been added to the layer.`,
          duration: 3000,
        })
      }
    },
    [layers, masks, notifications],
  )

  const handleMaskUpdate = useCallback(
    (layerId: string, maskId: string, updates: any) => {
      const layer = layers.getLayerById(layerId)
      if (layer && layer.masks) {
        const updatedMasks = layer.masks.map((mask) => (mask.id === maskId ? { ...mask, ...updates } : mask))
        layers.updateLayer(layerId, { masks: updatedMasks })
      }
    },
    [layers],
  )

  const handleMaskDelete = useCallback(
    (layerId: string, maskId: string) => {
      const layer = layers.getLayerById(layerId)
      if (layer && layer.masks) {
        const updatedMasks = layer.masks.filter((mask) => mask.id !== maskId)
        layers.updateLayer(layerId, { masks: updatedMasks })

        if (masks.selectedMaskId === maskId) {
          masks.setSelectedMaskId(null)
        }

        notifications.addNotification({
          type: "info",
          title: "Mask Deleted",
          message: "The mask has been removed from the layer.",
          duration: 3000,
        })
      }
    },
    [layers, masks, notifications],
  )

  if (!user) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex flex-col overflow-hidden">
      {/* Notifications */}
      <Notifications notifications={notifications.notifications} onRemove={notifications.removeNotification} />

      {/* Export Dialog */}
      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        selectedResult={selectedResult}
        onExport={handleExport}
      />

      {/* Premium Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.1),transparent_50%)]"></div>
      </div>

      {/* Premium Top Bar */}
      <header className="relative z-50 flex items-center justify-between px-8 py-4 bg-black/20 backdrop-blur-2xl border-b border-white/5">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-500 via-cyan-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/25">
              <Magic className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Mode Design
              </h1>
              <p className="text-xs text-gray-500 font-medium">AI Creative Studio</p>
            </div>
          </Link>

          <div className="flex items-center gap-2 ml-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUndo}
              disabled={!history.canUndo}
              className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl disabled:opacity-50"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRedo}
              disabled={!history.canRedo}
              className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl disabled:opacity-50"
            >
              <Redo2 className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-white/10 mx-3"></div>
            <div className="flex items-center gap-2">
              <Label className="text-xs text-gray-400">Auto-save</Label>
              <Switch checked={autoSave} onCheckedChange={setAutoSave} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            size="sm"
            onClick={() => setShowExportDialog(true)}
            disabled={!selectedResult}
            className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 rounded-xl shadow-lg shadow-teal-500/25 disabled:opacity-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.profileImageUrl || ""} alt={user.displayName || "User"} />
                  <AvatarFallback className="bg-gradient-to-r from-teal-500 to-green-500 text-white font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-slate-900 border-slate-700 backdrop-blur-xl" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-white">{user.displayName || "User"}</p>
                  <p className="text-xs text-gray-400">{user.primaryEmail}</p>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-slate-700" />
              <Link href="/">
                <DropdownMenuItem className="cursor-pointer hover:bg-slate-800">
                  <Home className="mr-2 h-4 w-4" />
                  <span>Home</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="cursor-pointer hover:bg-slate-800">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-slate-800">
                <Crown className="mr-2 h-4 w-4" />
                <span>Upgrade Plan</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-slate-800">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem className="cursor-pointer hover:bg-slate-800" onClick={() => user.signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Left Panel - Creative Controls */}
        <div className="w-96 bg-black/20 backdrop-blur-2xl border-r border-white/5 flex flex-col">
          {/* Welcome Message */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.profileImageUrl || ""} alt={user.displayName || "User"} />
                <AvatarFallback className="bg-gradient-to-r from-teal-500 to-green-500 text-white font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Welcome back, {user.displayName?.split(" ")[0] || "Creator"}!
                </h2>
                <p className="text-sm text-gray-400">Ready to create something amazing?</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-lg font-bold text-teal-400">{userProjects.length}</p>
                <p className="text-xs text-gray-400">Projects</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-lg font-bold text-green-400">
                  {userProjects.reduce((acc, p) => acc + p.variations, 0)}
                </p>
                <p className="text-xs text-gray-400">Variations</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-lg font-bold text-cyan-400">
                  {userProjects.length > 0
                    ? Math.round(userProjects.reduce((acc, p) => acc + p.quality, 0) / userProjects.length)
                    : 0}
                  %
                </p>
                <p className="text-xs text-gray-400">Avg Quality</p>
              </div>
            </div>
          </div>

          {/* Creative Modes */}
          <div className="p-6 border-b border-white/5">
            <Label className="text-white font-semibold mb-4 block text-lg">Creative Mode</Label>
            <div className="grid grid-cols-2 gap-3">
              {creativeModesData.slice(0, 6).map((mode) => {
                const Icon = mode.icon
                return (
                  <button
                    key={mode.id}
                    onClick={() => {
                      setSelectedMode(mode)
                      setSelectedContext(mode.contexts[0])
                    }}
                    className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                      selectedMode.id === mode.id
                        ? "border-white/20 bg-gradient-to-br from-white/10 to-white/5 scale-105"
                        : "border-white/5 hover:border-white/10 bg-white/5 hover:bg-white/10 hover:scale-102"
                    }`}
                  >
                    <div className="relative z-10">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-r ${mode.gradient} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-sm font-semibold text-white mb-1">{mode.name}</h3>
                      <p className="text-xs text-gray-400 leading-tight">{mode.description}</p>
                    </div>
                    {selectedMode.id === mode.id && (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Context Selection */}
          <div className="p-6 border-b border-white/5">
            <Label className="text-white font-semibold mb-3 block">Context</Label>
            <Select value={selectedContext} onValueChange={setSelectedContext}>
              <SelectTrigger className="w-full bg-white/5 border-white/10 text-white rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                {selectedMode.contexts.map((context) => (
                  <SelectItem key={context} value={context}>
                    {context}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Main Controls */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            {/* Substituir o TabsList existente por: */}
            <TabsList className="grid w-full grid-cols-4 bg-white/5 m-6 mb-0 rounded-xl">
              <TabsTrigger value="layers" className="data-[state=active]:bg-teal-500 rounded-lg text-xs">
                Layers
              </TabsTrigger>
              <TabsTrigger value="masks" className="data-[state=active]:bg-teal-500 rounded-lg text-xs">
                Masks
              </TabsTrigger>
              <TabsTrigger value="colors" className="data-[state=active]:bg-teal-500 rounded-lg text-xs">
                Colors
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-teal-500 rounded-lg text-xs">
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="layers" className="flex-1 p-6">
              <LayersPanel
                layers={layers.layers}
                groups={layers.groups}
                selectedLayerIds={layers.selectedLayerIds}
                onLayerSelect={layers.selectLayer}
                onLayerUpdate={layers.updateLayer}
                onLayerRemove={layers.removeLayer}
                onLayerDuplicate={layers.duplicateLayer}
                onLayerReorder={layers.reorderLayers}
                onLayerAdd={(type) => {
                  const layerId = layers.addLayer({ type })
                  notifications.addNotification({
                    type: "success",
                    title: "Layer Added",
                    message: `New ${type} layer has been created.`,
                    duration: 3000,
                  })
                }}
                onGroupCreate={layers.createGroup}
                onGroupUngroup={layers.ungroupLayers}
              />
            </TabsContent>

            {/* Adicionar após o TabsContent de layers: */}
            <TabsContent value="masks" className="flex-1 p-6">
              <MasksPanel
                selectedLayer={
                  layers.selectedLayerIds.length === 1 ? layers.getLayerById(layers.selectedLayerIds[0]) || null : null
                }
                selectedMaskId={masks.selectedMaskId}
                maskPreviewMode={masks.maskPreviewMode}
                brushSize={masks.brushSize}
                brushHardness={masks.brushHardness}
                brushOpacity={masks.brushOpacity}
                onMaskSelect={masks.setSelectedMaskId}
                onMaskCreate={(type) => {
                  if (layers.selectedLayerIds.length === 1) {
                    handleMaskCreate(layers.selectedLayerIds[0], type)
                  }
                }}
                onMaskUpdate={(maskId, updates) => {
                  if (layers.selectedLayerIds.length === 1) {
                    handleMaskUpdate(layers.selectedLayerIds[0], maskId, updates)
                  }
                }}
                onMaskDelete={(maskId) => {
                  if (layers.selectedLayerIds.length === 1) {
                    handleMaskDelete(layers.selectedLayerIds[0], maskId)
                  }
                }}
                onMaskDuplicate={(maskId) => {
                  const layer =
                    layers.selectedLayerIds.length === 1 ? layers.getLayerById(layers.selectedLayerIds[0]) : null
                  if (layer && layer.masks) {
                    const mask = layer.masks.find((m) => m.id === maskId)
                    if (mask) {
                      const duplicatedMask = masks.duplicateMask(mask)
                      const updatedMasks = [...layer.masks, duplicatedMask]
                      layers.updateLayer(layer.id, { masks: updatedMasks })
                    }
                  }
                }}
                onPreviewModeChange={masks.setMaskPreviewMode}
                onBrushSizeChange={masks.setBrushSize}
                onBrushHardnessChange={masks.setBrushHardness}
                onBrushOpacityChange={masks.setBrushOpacity}
              />
            </TabsContent>

            <TabsContent value="colors" className="flex-1 p-6">
              <ColorsPanel />
            </TabsContent>

            <TabsContent value="effects" className="flex-1 p-6">
              <LayerEffectsPanel
                layer={
                  layers.selectedLayerIds.length === 1 ? layers.getLayerById(layers.selectedLayerIds[0]) || null : null
                }
                onLayerUpdate={layers.updateLayer}
                onEffectAdd={layers.addLayerEffect}
                onEffectRemove={layers.removeLayerEffect}
              />
            </TabsContent>

            <TabsContent value="history" className="flex-1 p-6">
              <HistoryPanel
                history={history.history}
                currentIndex={history.currentIndex}
                canUndo={history.canUndo}
                canRedo={history.canRedo}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onClearHistory={history.clearHistory}
                onJumpToAction={(index) => {
                  console.log("Jump to action:", index)
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
