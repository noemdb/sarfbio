// lib/three/lights.ts — Spec: spec_driven_v01.md Tarea 2.2
// Presets de iluminación compartidos para todas las escenas

export interface LightingPreset {
  ambient: { intensity: number; color: string }
  directional: {
    position: [number, number, number]
    intensity: number
    color: string
    castShadow: boolean
  }
  hemisphere?: {
    skyColor: string
    groundColor: string
    intensity: number
  }
  environment?: string
}

export const LIGHTING_PRESETS = {
  // Hero scene: campo al atardecer
  heroField: {
    ambient: { intensity: 0.4, color: '#ffeedd' },
    directional: {
      position: [5, 8, 5] as [number, number, number],
      intensity: 1.8,
      color: '#ffcc88',
      castShadow: true,
    },
    hemisphere: { skyColor: '#87CEEB', groundColor: '#4a7a4a', intensity: 0.5 },
    environment: 'sunset',
  },
  // Robot closeup: estudio técnico limpio
  techStudio: {
    ambient: { intensity: 0.6, color: '#e8f4ff' },
    directional: {
      position: [3, 5, 3] as [number, number, number],
      intensity: 2.0,
      color: '#ffffff',
      castShadow: false,
    },
    environment: 'city',
  },
  // Biofluid: dark dramático bioluminiscente
  bioDark: {
    ambient: { intensity: 0.2, color: '#001a00' },
    directional: {
      position: [2, 4, 2] as [number, number, number],
      intensity: 1.5,
      color: '#22c55e',
      castShadow: false,
    },
  },
} as const satisfies Record<string, LightingPreset>
