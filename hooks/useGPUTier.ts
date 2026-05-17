'use client'
// hooks/useGPUTier.ts — Spec: spec_driven_v01.md Tarea 2.2
import { useState, useEffect } from 'react'

export type GPUTier = 'low' | 'medium' | 'high'

interface GPUConfig {
  tier: GPUTier
  maxParticles: number
  shadowsEnabled: boolean
  postprocessingEnabled: boolean
  maxPixelRatio: number
  frameloop: 'always' | 'demand'
}

export function useGPUTier(): GPUConfig {
  const [tier, setTier] = useState<GPUTier>('medium')

  useEffect(() => {
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4
    const cores = navigator.hardwareConcurrency ?? 4
    const isMobile = /Mobi|Android/i.test(navigator.userAgent)

    if (isMobile || memory <= 2 || cores <= 2) {
      setTier('low')
    } else if (memory >= 8 && cores >= 8) {
      setTier('high')
    } else {
      setTier('medium')
    }
  }, [])

  const configs: Record<GPUTier, Omit<GPUConfig, 'tier'>> = {
    low: {
      maxParticles: 50,
      shadowsEnabled: false,
      postprocessingEnabled: false,
      maxPixelRatio: 1,
      frameloop: 'demand',
    },
    medium: {
      maxParticles: 500,
      shadowsEnabled: false,
      postprocessingEnabled: false,
      maxPixelRatio: 1.5,
      frameloop: 'demand',
    },
    high: {
      maxParticles: 2000,
      shadowsEnabled: true,
      postprocessingEnabled: true,
      maxPixelRatio: 2,
      frameloop: 'always',
    },
  }

  return { tier, ...configs[tier] }
}
