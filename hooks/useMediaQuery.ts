'use client'
// hooks/useMediaQuery.ts — Spec: spec_driven_v01.md Tarea 7
import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(query)
    setMatches(mq.matches)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])

  return matches
}

export function useShouldRender3D(): boolean {
  const isMobile = useMediaQuery('(max-width: 639px)')
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  return !isMobile && !reducedMotion
}
