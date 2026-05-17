// lib/three/loaders.ts — Spec: spec_driven_v01.md Tarea 2.2
// Singleton loaders — una sola instancia global para evitar múltiples decoders en memoria

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { useGLTF } from '@react-three/drei'

let dracoLoader: DRACOLoader | null = null

export function getDracoLoader(): DRACOLoader {
  if (!dracoLoader) {
    dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
    dracoLoader.preload()
  }
  return dracoLoader
}

/** Llamar exactamente una vez en el root layout */
export function configureGlobalLoaders() {
  useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
}
