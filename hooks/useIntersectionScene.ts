'use client'
// hooks/useIntersectionScene.ts — Spec: spec_driven_v01.md Tarea 2.2
// Suspende el frame loop de Three.js cuando la escena sale del viewport
import { useRef, useState, useEffect } from 'react'

export function useIntersectionScene(threshold = 0.1) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting
        setIsVisible(visible)
        if (visible) setHasBeenVisible(true)
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return {
    containerRef,
    isVisible,
    hasBeenVisible,
    frameloop: isVisible ? ('always' as const) : ('never' as const),
  }
}
