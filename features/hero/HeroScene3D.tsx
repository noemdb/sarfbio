'use client'
// features/hero/HeroScene3D.tsx — Spec: spec_driven_v01.md Tarea 4.1
// Hero scene: robot agrícola procedural animado + partículas bio-green
// NOTA: Usa geometría procedural hasta que el modelo GLB real esté disponible

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sparkles, Environment, MeshDistortMaterial } from '@react-three/drei'
import { SceneWrapper } from '@/components/ui/SceneWrapper'
import { useGPUTier } from '@/hooks/useGPUTier'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { useTransform } from 'framer-motion'
import * as THREE from 'three'

// ──────────────────────────────────────────────────
// Robot procedural (placeholder hasta GLB disponible)
// ──────────────────────────────────────────────────
function ProceduralRobot() {
  const groupRef = useRef<THREE.Group>(null)
  const { scrollYProgress } = useScrollProgress()
  const rotationY = useTransform(scrollYProgress, [0, 0.3], [0, 0.8])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    groupRef.current.rotation.y = rotationY.get() + Math.sin(t * 0.3) * 0.05
    groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.02
  })

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Cuerpo principal */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.8, 1.0, 0.6]} />
        <MeshDistortMaterial
          color="#1a3a2a"
          metalness={0.7}
          roughness={0.3}
          distort={0.05}
          speed={2}
        />
      </mesh>

      {/* Cabeza */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[0.55, 0.45, 0.5]} />
        <meshStandardMaterial color="#0d2218" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Ojo/sensor — glow verde */}
      <mesh position={[0, 1.22, 0.26]}>
        <circleGeometry args={[0.1, 16]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* Brazo aplicador */}
      <group position={[0.55, 0.7, 0]}>
        <mesh position={[0.3, 0, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.6, 8]} />
          <meshStandardMaterial color="#16a34a" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Boquilla */}
        <mesh position={[0.65, -0.1, 0]}>
          <coneGeometry args={[0.08, 0.18, 8]} />
          <meshStandardMaterial
            color="#22c55e"
            emissive="#22c55e"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>

      {/* Chasis / base */}
      <mesh position={[0, -0.3, 0]} castShadow>
        <boxGeometry args={[1.0, 0.25, 0.8]} />
        <meshStandardMaterial color="#112211" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Ruedas */}
      {[-0.45, 0.45].map((x) =>
        [-0.3, 0.3].map((z) => (
          <mesh
            key={`${x}-${z}`}
            position={[x, -0.42, z]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.18, 0.18, 0.12, 12]} />
            <meshStandardMaterial color="#0a0a0a" metalness={0.3} roughness={0.8} />
          </mesh>
        ))
      )}

      {/* Tanque biopreparado */}
      <mesh position={[-0.35, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.7, 12]} />
        <meshStandardMaterial
          color="#166534"
          transparent
          opacity={0.85}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      {/* Anillo glow en base */}
      <mesh position={[0, -0.44, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.6, 32]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={1.5}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  )
}

function AmbientParticles({ count }: { count: number }) {
  return (
    <Sparkles
      count={count}
      scale={8}
      size={1.8}
      speed={0.4}
      color="#22c55e"
      opacity={0.35}
    />
  )
}

function HeroFallback() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at center, rgba(34,197,94,0.08) 0%, transparent 70%)' }}
    >
      <div
        className="w-48 h-48 rounded-full border-2 animate-pulse"
        style={{ borderColor: 'rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.05)' }}
      />
    </div>
  )
}

export function HeroScene3D() {
  const gpu = useGPUTier()

  return (
    <SceneWrapper
      height="var(--scene-height-desktop)"
      cameraPosition={[0, 0.5, 4]}
      cameraFov={40}
      fallback={<HeroFallback />}
    >
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.8}>
        <ProceduralRobot />
      </Float>

      {gpu.tier !== 'low' && <AmbientParticles count={Math.floor(gpu.maxParticles / 4)} />}

      <Environment preset="sunset" background={false} />

      {/* Rim light bio-green signature */}
      <pointLight position={[-3, 2, -3]} intensity={3} color="#22c55e" />
      <pointLight position={[3, 1, 2]} intensity={1.5} color="#86efac" />
      <ambientLight intensity={0.4} color="#ffeedd" />
      <directionalLight position={[5, 8, 5]} intensity={1.8} color="#ffcc88" castShadow />
    </SceneWrapper>
  )
}
