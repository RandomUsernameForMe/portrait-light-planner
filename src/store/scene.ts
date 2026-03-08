import { create } from 'zustand'
import type { LightConfig, LightType } from '../lights/types'
import { LIGHT_DEFAULTS } from '../lights/types'

export type ViewMode = 'perspective' | 'topdown'

interface SceneStore {
  lights: LightConfig[]
  selectedId: string | null
  viewMode: ViewMode
  addLight: (type: LightType, yOverride?: number) => void
  updateLight: (id: string, patch: Partial<LightConfig>) => void
  removeLight: (id: string) => void
  selectLight: (id: string | null) => void
  setViewMode: (mode: ViewMode) => void
}

let nextId = 1

export const useSceneStore = create<SceneStore>((set) => ({
  lights: [],
  selectedId: null,
  viewMode: 'perspective',

  addLight: (type, yOverride) => {
    const id = `light-${nextId++}`
    const defaults = LIGHT_DEFAULTS[type]
    const defaultPos = defaults.position ?? [2, 2, 2]
    const light: LightConfig = {
      id,
      type,
      position: [defaultPos[0], yOverride ?? defaultPos[1], defaultPos[2]] as [number, number, number],
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

  setViewMode: (mode) => set({ viewMode: mode, selectedId: null }),
}))
