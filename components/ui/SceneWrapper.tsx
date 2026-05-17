'use client'
// components/ui/SceneWrapper.tsx — Spec: spec_driven_v01.md Tarea 2.3
// Wrapper base para todos los Canvas R3F con lazy mount, GPU tier y reduced motion

import { Canvas } from '@react-three/fiber'
import { Suspense, type ReactNode } from 'react'
import { useIntersectionScene } from '@/hooks/useIntersectionScene'
import { useGPUTier } from '@/hooks/useGPUTier'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface SceneWrapperProps {
  children: ReactNode
  className?: string
  height?: string
  fallback?: ReactNode
  loadingFallback?: ReactNode
  cameraFov?: number
  cameraPosition?: [number, number, number]
  shadows?: boolean
}

export function SceneWrapper({
  children,
  className = '',
  height = 'var(--scene-height-desktop)',
  fallback,
  loadingFallback,
  cameraFov = 45,
  cameraPosition = [0, 0, 5],
  shadows,
}: SceneWrapperProps) {
  const { containerRef, hasBeenVisible, frameloop } = useIntersectionScene(0.05)
  const gpu = useGPUTier()
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion && fallback) {
    return <>{fallback}</>
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ height }}
      aria-hidden="true"
      role="img"
    >
      {hasBeenVisible && (
        <Suspense fallback={loadingFallback ?? <SceneLoader />}>
          <Canvas
            frameloop={prefersReducedMotion ? 'demand' : frameloop}
            camera={{ fov: cameraFov, position: cameraPosition, near: 0.1, far: 100 }}
            shadows={shadows ?? gpu.shadowsEnabled}
            dpr={[1, gpu.maxPixelRatio]}
            gl={{
              antialias: gpu.tier !== 'low',
              alpha: true,
              powerPreference: 'high-performance',
            }}
            style={{ background: 'transparent' }}
          >
            {children}
          </Canvas>
        </Suspense>
      )}
      {!hasBeenVisible && (loadingFallback ?? <SceneLoader />)}
    </div>
  )
}

function SceneLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--color-bio-green)', borderTopColor: 'transparent' }}
        />
        <span
          className="text-xs tracking-widest uppercase"
          style={{ color: 'rgba(34,197,94,0.6)', fontFamily: 'var(--font-mono)' }}
        >
          Inicializando escena
        </span>
      </div>
    </div>
  )
}
