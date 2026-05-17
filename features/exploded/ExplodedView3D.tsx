'use client'
// features/exploded/ExplodedView3D.tsx — Spec: spec_driven_v01.md Tarea 4.3
// Vista explosionada del SARFBIO-01, controlada por scroll
import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { SceneWrapper } from '@/components/ui/SceneWrapper'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { useTransform } from 'framer-motion'
import type { TechBreakdownContent } from '@/types/content'
import * as THREE from 'three'

const COLORS: Record<string, string> = {
  brain: '#22c55e',
  locomotion: '#f59e0b',
  application: '#60a5fa',
  power: '#a78bfa',
}

const SHAPES: Record<string, React.ReactElement> = {
  'arm-structure': <boxGeometry args={[0.6, 0.15, 0.15]} />,
  'battery-electronics': <boxGeometry args={[0.5, 0.3, 0.4]} />,
  'vehicle-wheels': <boxGeometry args={[0.8, 0.2, 0.6]} />,
  'pump-tank': <cylinderGeometry args={[0.12, 0.12, 0.6, 12]} />,
  'remote-control': <boxGeometry args={[0.25, 0.1, 0.4]} />,
}

interface ExplodedPartProps {
  component: TechBreakdownContent['components'][0]
  explodeFactor: number
}

function ExplodedPart({ component, explodeFactor }: ExplodedPartProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [ox, oy, oz] = component.explodedOffset
  const color = COLORS[component.category] ?? '#22c55e'

  useFrame(() => {
    if (!meshRef.current) return
    meshRef.current.position.set(
      ox * explodeFactor,
      oy * explodeFactor,
      oz * explodeFactor
    )
  })

  return (
    <group>
      <mesh ref={meshRef} castShadow>
        {SHAPES[component.id] ?? <boxGeometry args={[0.4, 0.4, 0.4]} />}
        <meshStandardMaterial
          color={color}
          metalness={0.6}
          roughness={0.3}
          emissive={color}
          emissiveIntensity={explodeFactor * 0.2}
        />
      </mesh>
      {explodeFactor > 0.3 && (
        <Html
          position={[ox * explodeFactor, oy * explodeFactor + 0.35, oz * explodeFactor]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              background: 'rgba(15,23,42,0.9)',
              border: `1px solid ${color}40`,
              borderRadius: '8px',
              padding: '6px 10px',
              opacity: Math.min((explodeFactor - 0.3) * 3, 1),
              color: color,
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              whiteSpace: 'nowrap',
              backdropFilter: 'blur(8px)',
            }}
          >
            {component.name} · ${component.costUSD}
          </div>
        </Html>
      )}
    </group>
  )
}

interface ExplodedView3DProps {
  content: TechBreakdownContent
  scrollRangeStart?: number
  scrollRangeEnd?: number
}

export function ExplodedView3D({
  content,
  scrollRangeStart = 0.6,
  scrollRangeEnd = 0.82,
}: ExplodedView3DProps) {
  const { scrollYProgress } = useScrollProgress()
  const explodeFactor = useTransform(scrollYProgress, [scrollRangeStart, scrollRangeEnd], [0, 1])

  return (
    <SceneWrapper
      height="var(--scene-height-desktop)"
      cameraPosition={[0, 1, 5]}
      cameraFov={50}
    >
      {content.components.map((component) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return (
          <ExplodedPartScrolled
            key={component.id}
            component={component}
            scrollYProgress={scrollYProgress}
            scrollRangeStart={scrollRangeStart}
            scrollRangeEnd={scrollRangeEnd}
          />
        )
      })}

      <ambientLight intensity={0.6} color="#e8f4ff" />
      <directionalLight position={[3, 5, 3]} intensity={2.0} color="#ffffff" />
      <pointLight position={[-3, 2, 0]} intensity={1} color="#22c55e" />
    </SceneWrapper>
  )
}

// Sub-componente que lee scrollYProgress via useTransform
function ExplodedPartScrolled({
  component,
  scrollYProgress,
  scrollRangeStart,
  scrollRangeEnd,
}: {
  component: TechBreakdownContent['components'][0]
  scrollYProgress: ReturnType<typeof useScrollProgress>['scrollYProgress']
  scrollRangeStart: number
  scrollRangeEnd: number
}) {
  const explodeFactor = useTransform(
    scrollYProgress,
    [scrollRangeStart, scrollRangeEnd],
    [0, 1]
  )
  const [rawFactor, setRawFactor] = React.useState(0)

  React.useEffect(() => {
    return explodeFactor.on('change', (v) => setRawFactor(v))
  }, [explodeFactor])

  return <ExplodedPart component={component} explodeFactor={rawFactor} />
}

