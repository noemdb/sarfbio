'use client'
// hooks/useScrollProgress.ts — Spec: spec_driven_v01.md Tarea 6.1
import { useScroll } from 'framer-motion'

/**
 * Hook para obtener el progreso global de scroll como MotionValue.
 * Usar useTransform() en los consumers para evitar re-renders en cascada.
 */
export function useScrollProgress() {
  const { scrollYProgress } = useScroll()
  return { scrollYProgress }
}
