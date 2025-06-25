"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, RefreshCw, Filter, Sliders, Clock, Undo2, Redo2, Trash2, Eye, Download } from "lucide-react"
import type { HistoryAction } from "@/hooks/use-history"
import { formatDistanceToNow } from "date-fns"

interface HistoryPanelProps {
  history: HistoryAction[]
  currentIndex: number
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onClearHistory: () => void
  onJumpToAction: (index: number) => void
}

const getActionIcon = (type: HistoryAction["type"]) => {
  switch (type) {
    case "generation":
      return Sparkles
    case "refinement":
      return RefreshCw
    case "filter":
      return Filter
    case "adjustment":
      return Sliders
    default:
      return Clock
  }
}

const getActionColor = (type: HistoryAction["type"]) => {
  switch (type) {
    case "generation":
      return "text-teal-400"
    case "refinement":
      return "text-blue-400"
    case "filter":
      return "text-purple-400"
    case "adjustment":
      return "text-orange-400"
    default:
      return "text-gray-400"
  }
}

export function HistoryPanel({
  history,
  currentIndex,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClearHistory,
  onJumpToAction,
}: HistoryPanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-white font-semibold">History</Label>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className="text-gray-400 hover:text-white disabled:opacity-50"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            className="text-gray-400 hover:text-white disabled:opacity-50"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClearHistory} className="text-gray-400 hover:text-red-400">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-8 h-8 text-gray-500 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No actions yet</p>
          <p className="text-xs text-gray-600 mt-1">Your editing history will appear here</p>
        </div>
      ) : (
        <ScrollArea className="h-64">
          <div className="space-y-2">
            {history.map((action, index) => {
              const Icon = getActionIcon(action.type)
              const colorClass = getActionColor(action.type)
              const isActive = index === currentIndex
              const isFuture = index > currentIndex

              return (
                <button
                  key={action.id}
                  onClick={() => onJumpToAction(index)}
                  className={`w-full p-3 rounded-xl border text-left transition-all group ${
                    isActive
                      ? "border-teal-500/50 bg-teal-500/10"
                      : isFuture
                        ? "border-white/5 bg-white/5 opacity-50"
                        : "border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className={`w-8 h-8 rounded-lg bg-gradient-to-r from-white/10 to-white/5 flex items-center justify-center flex-shrink-0 ${
                          isActive ? "shadow-lg shadow-teal-500/25" : ""
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? "text-teal-400" : colorClass}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium mb-1 ${isActive ? "text-white" : "text-gray-300"}`}>
                          {action.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 capitalize">{action.type}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(action.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-white h-6 w-6 p-0">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-white h-6 w-6 p-0">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  {action.preview && (
                    <div className="mt-2 rounded-lg overflow-hidden">
                      <img
                        src={action.preview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-16 object-cover"
                      />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </ScrollArea>
      )}

      {/* Quick Actions */}
      <div className="pt-4 border-t border-white/10">
        <Label className="text-sm text-gray-400 mb-3 block">Quick Actions</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-10 border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/10 rounded-lg"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-10 border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/10 rounded-lg"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refine
          </Button>
        </div>
      </div>
    </div>
  )
}
