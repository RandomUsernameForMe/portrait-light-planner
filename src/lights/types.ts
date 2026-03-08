export type LightType = 'softbox' | 'reflector' | 'beauty_dish' | 'bounce' | 'window'

export interface LightConfig {
  id: string
  type: LightType
  position: [number, number, number]
  rotation: [number, number, number]
  intensity: number       // 0–10
  colorTemp: number       // Kelvin 2700–7000
  width?: number          // pro RectAreaLight
  height?: number
  angle?: number          // pro SpotLight
  penumbra?: number
}

export const LIGHT_DEFAULTS: Record<LightType, Partial<LightConfig>> = {
  softbox: {
    position: [2, 2, 2],
    rotation: [0, 0, 0],
    intensity: 5,
    colorTemp: 5500,
    width: 1,
    height: 1,
  },
  reflector: {
    position: [2, 2, 2],
    rotation: [0, 0, 0],
    intensity: 5,
    colorTemp: 5500,
    angle: 0.4,
    penumbra: 0.5,
  },
  beauty_dish: {
    position: [0, 2, 2],
    rotation: [0, 0, 0],
    intensity: 6,
    colorTemp: 5500,
    angle: 0.3,
    penumbra: 0.3,
  },
  bounce: {
    position: [-2, 1, 1],
    rotation: [0, 0, 0],
    intensity: 2,
    colorTemp: 5500,
    width: 1.5,
    height: 1.5,
  },
  window: {
    position: [3, 2, 0],
    rotation: [0, 0, 0],
    intensity: 4,
    colorTemp: 6500,
    width: 1.5,
    height: 2,
  },
}

export const LIGHT_LABELS: Record<LightType, string> = {
  softbox: 'Softbox',
  reflector: 'Reflektor',
  beauty_dish: 'Beauty dish',
  bounce: 'Odrazná deska',
  window: 'Okno',
}

export const LIGHT_ICONS: Record<LightType, string> = {
  softbox: '📦',
  reflector: '🔦',
  beauty_dish: '💡',
  bounce: '◻',
  window: '🪟',
}
