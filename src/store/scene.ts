import { create } from 'zustand'
import type { LightConfig, LightType } from '../lights/types'
import { LIGHT_DEFAULTS } from '../lights/types'

interface SceneStore {
  lights: LightConfig[]
  selectedId: string | null
  addLight: (type: LightType) => void
  updateLight: (id: string, patch: Partial<LightConfig>) => void
  removeLight: (id: string) => void
  selectLight: (id: string | null) => void
}

let nextId = 1

export const useSceneStore = create<SceneStore>((set) => ({
  lights: [],
  selectedId: null,

  addLight: (type) => {
    const id = `light-${nextId++}`
    const defaults = LIGHT_DEFAULTS[type]
    const light: LightConfig = {
      id,
      type,
      position: [...(defaults.position ?? [2, 2, 2])] as [number, number, number],
      rotation: [...(defaults.rotation ?? [0, 0, 0])] as [number, number, number],
      intensity: defaults.intensity ?? 5,
      colorTemp: defaults.colorTemp ?? 5500,
      width: defaults.width,
      height: defaults.height,
      angle: defaults.angle,
      penumbra: defaults.penumbra,
    }
    set((s) => ({ lights: [...s.lights, light], selectedId: id }))
  },

  updateLight: (id, patch) => {
    set((s) => ({
      lights: s.lights.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    }))
  },

  removeLight: (id) => {
    set((s) => ({
      lights: s.lights.filter((l) => l.id !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
    }))
  },

  selectLight: (id) => set({ selectedId: id }),
}))
