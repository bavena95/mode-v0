"use client"

import { useState, useCallback } from "react"

export interface HistoryAction {
  id: string
  type: "generation" | "refinement" | "filter" | "adjustment"
  description: string
  timestamp: Date
  data: any
  preview?: string
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryAction[]>([])
  const [currentIndex, setCurrentIndex] = useState(-1)

  const addAction = useCallback(
    (action: Omit<HistoryAction, "id" | "timestamp">) => {
      const newAction: HistoryAction = {
        ...action,
        id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
      }

      setHistory((prev) => {
        const newHistory = prev.slice(0, currentIndex + 1)
        newHistory.push(newAction)
        return newHistory
      })
      setCurrentIndex((prev) => prev + 1)
    },
    [currentIndex],
  )

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
      return history[currentIndex - 1]
    }
    return null
  }, [currentIndex, history])

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      return history[currentIndex + 1]
    }
    return null
  }, [currentIndex, history])

  const canUndo = currentIndex > 0
  const canRedo = currentIndex < history.length - 1

  const getCurrentAction = useCallback(() => {
    return currentIndex >= 0 ? history[currentIndex] : null
  }, [currentIndex, history])

  const clearHistory = useCallback(() => {
    setHistory([])
    setCurrentIndex(-1)
  }, [])

  return {
    history,
    currentIndex,
    addAction,
    undo,
    redo,
    canUndo,
    canRedo,
    getCurrentAction,
    clearHistory,
  }
}
