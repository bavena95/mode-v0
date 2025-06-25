"use client"

import { useState, useCallback, useRef } from "react"
import type { Layer, LayerGroup, BlendMode, LayerEffect } from "@/types/layers"

export function useLayers() {
  const [layers, setLayers] = useState<Layer[]>([])
  const [groups, setGroups] = useState<LayerGroup[]>([])
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>([])
  const [draggedLayer, setDraggedLayer] = useState<string | null>(null)
  const layerIdCounter = useRef(0)

  const generateLayerId = useCallback(() => {
    layerIdCounter.current += 1
    return `layer_${layerIdCounter.current}`
  }, [])

  const addLayer = useCallback(
    (layerData: Partial<Layer>) => {
      const newLayer: Layer = {
        id: generateLayerId(),
        name: layerData.name || `Layer ${layers.length + 1}`,
        type: layerData.type || "image",
        visible: true,
        locked: false,
        opacity: 100,
        blendMode: "normal",
        position: { x: 0, y: 0 },
        size: { width: 100, height: 100 },
        rotation: 0,
        data: {},
        effects: [],
        masks: [],
        zIndex: layers.length,
        ...layerData,
      }

      setLayers((prev) => [...prev, newLayer])
      setSelectedLayerIds([newLayer.id])
      return newLayer.id
    },
    [layers.length, generateLayerId],
  )

  const removeLayer = useCallback((layerId: string) => {
    setLayers((prev) => prev.filter((layer) => layer.id !== layerId))
    setSelectedLayerIds((prev) => prev.filter((id) => id !== layerId))
  }, [])

  const duplicateLayer = useCallback(
    (layerId: string) => {
      const layer = layers.find((l) => l.id === layerId)
      if (!layer) return

      const duplicatedLayer: Layer = {
        ...layer,
        id: generateLayerId(),
        name: `${layer.name} copy`,
        position: {
          x: layer.position.x + 10,
          y: layer.position.y + 10,
        },
        zIndex: layers.length,
      }

      setLayers((prev) => [...prev, duplicatedLayer])
      setSelectedLayerIds([duplicatedLayer.id])
      return duplicatedLayer.id
    },
    [layers, generateLayerId],
  )

  const updateLayer = useCallback((layerId: string, updates: Partial<Layer>) => {
    setLayers((prev) => prev.map((layer) => (layer.id === layerId ? { ...layer, ...updates } : layer)))
  }, [])

  const reorderLayers = useCallback((draggedId: string, targetId: string, position: "above" | "below") => {
    setLayers((prev) => {
      const draggedIndex = prev.findIndex((l) => l.id === draggedId)
      const targetIndex = prev.findIndex((l) => l.id === targetId)

      if (draggedIndex === -1 || targetIndex === -1) return prev

      const newLayers = [...prev]
      const [draggedLayer] = newLayers.splice(draggedIndex, 1)

      const insertIndex = position === "above" ? targetIndex : targetIndex + 1
      newLayers.splice(insertIndex, 0, draggedLayer)

      // Update z-indices
      return newLayers.map((layer, index) => ({
        ...layer,
        zIndex: index,
      }))
    })
  }, [])

  const toggleLayerVisibility = useCallback(
    (layerId: string) => {
      updateLayer(layerId, { visible: !layers.find((l) => l.id === layerId)?.visible })
    },
    [layers, updateLayer],
  )

  const toggleLayerLock = useCallback(
    (layerId: string) => {
      updateLayer(layerId, { locked: !layers.find((l) => l.id === layerId)?.locked })
    },
    [layers, updateLayer],
  )

  const setLayerOpacity = useCallback(
    (layerId: string, opacity: number) => {
      updateLayer(layerId, { opacity })
    },
    [updateLayer],
  )

  const setLayerBlendMode = useCallback(
    (layerId: string, blendMode: BlendMode) => {
      updateLayer(layerId, { blendMode })
    },
    [updateLayer],
  )

  const addLayerEffect = useCallback(
    (layerId: string, effect: LayerEffect) => {
      const layer = layers.find((l) => l.id === layerId)
      if (!layer) return

      updateLayer(layerId, {
        effects: [...layer.effects, effect],
      })
    },
    [layers, updateLayer],
  )

  const removeLayerEffect = useCallback(
    (layerId: string, effectId: string) => {
      const layer = layers.find((l) => l.id === layerId)
      if (!layer) return

      updateLayer(layerId, {
        effects: layer.effects.filter((e) => e.id !== effectId),
      })
    },
    [layers, updateLayer],
  )

  const createGroup = useCallback(
    (layerIds: string[], groupName = "Group") => {
      const groupId = generateLayerId()
      const newGroup: LayerGroup = {
        id: groupId,
        name: groupName,
        visible: true,
        locked: false,
        opacity: 100,
        blendMode: "normal",
        children: layerIds,
        expanded: true,
      }

      setGroups((prev) => [...prev, newGroup])

      // Update layers to have parent reference
      setLayers((prev) => prev.map((layer) => (layerIds.includes(layer.id) ? { ...layer, parentId: groupId } : layer)))

      return groupId
    },
    [generateLayerId],
  )

  const ungroupLayers = useCallback(
    (groupId: string) => {
      const group = groups.find((g) => g.id === groupId)
      if (!group) return

      // Remove parent reference from layers
      setLayers((prev) =>
        prev.map((layer) => (group.children.includes(layer.id) ? { ...layer, parentId: undefined } : layer)),
      )

      setGroups((prev) => prev.filter((g) => g.id !== groupId))
    },
    [groups],
  )

  const selectLayer = useCallback((layerId: string, multiSelect = false) => {
    if (multiSelect) {
      setSelectedLayerIds((prev) => (prev.includes(layerId) ? prev.filter((id) => id !== layerId) : [...prev, layerId]))
    } else {
      setSelectedLayerIds([layerId])
    }
  }, [])

  const selectAllLayers = useCallback(() => {
    setSelectedLayerIds(layers.map((l) => l.id))
  }, [layers])

  const deselectAllLayers = useCallback(() => {
    setSelectedLayerIds([])
  }, [])

  const getLayerById = useCallback(
    (layerId: string) => {
      return layers.find((l) => l.id === layerId)
    },
    [layers],
  )

  const getSelectedLayers = useCallback(() => {
    return layers.filter((l) => selectedLayerIds.includes(l.id))
  }, [layers, selectedLayerIds])

  const getVisibleLayers = useCallback(() => {
    return layers.filter((l) => l.visible).sort((a, b) => a.zIndex - b.zIndex)
  }, [layers])

  return {
    layers,
    groups,
    selectedLayerIds,
    draggedLayer,
    setDraggedLayer,
    addLayer,
    removeLayer,
    duplicateLayer,
    updateLayer,
    reorderLayers,
    toggleLayerVisibility,
    toggleLayerLock,
    setLayerOpacity,
    setLayerBlendMode,
    addLayerEffect,
    removeLayerEffect,
    createGroup,
    ungroupLayers,
    selectLayer,
    selectAllLayers,
    deselectAllLayers,
    getLayerById,
    getSelectedLayers,
    getVisibleLayers,
  }
}
