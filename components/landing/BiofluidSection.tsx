'use client'
// components/landing/BiofluidSection.tsx — Spec: spec_driven_v01.md Tarea 5.3
import { useState } from 'react'
import type { BiofluidContent } from '@/types/content'
import { BiofluidVisualizerSVG } from './BiofluidVisualizerSVG'

interface BiofluidSectionProps {
  content: BiofluidContent
}

export function BiofluidSection({ content }: BiofluidSectionProps) {
  const [activeMode, setActiveMode] = useState<'high' | 'low'>('high')
  const [expandedIngredient, setExpandedIngredient] = useState<string | null>(null)
  const currentMode = content.sprayModes.find((m) => m.id === activeMode)!

  return (
    <section
      id="biofluido"
      style={{ background: '#050d08', padding: 'var(--section-padding-y) 0' }}
    >
      {/* Header */}
      <div
        className="text-center mb-12"
        style={{ padding: '0 var(--container-padding)', maxWidth: 'var(--container-max)', margin: '0 auto 3rem' }}
      >
        <div
          className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full"
          style={{ border: '1px solid rgba(34,197,94,0.25)', background: 'rgba(34,197,94,0.08)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--color-bio-green)' }} />
          <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--color-bio-green)', fontFamily: 'var(--font-mono)' }}>
            BioBox Sistema de Dispensación
          </span>
        </div>
        <h2
          className="font-black mb-4"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-section)', color: 'white', lineHeight: 1.05 }}
        >
          {content.sectionTitle}
        </h2>
        <p className="max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
          {content.description}
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex justify-center mb-8">
        <div
          className="inline-flex rounded-full p-1"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(34,197,94,0.15)' }}
        >
          {content.sprayModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300"
              style={{
                fontFamily: 'var(--font-body)',
                background: activeMode === mode.id ? 'var(--color-bio-green)' : 'transparent',
                color: activeMode === mode.id ? 'var(--color-tech-navy)' : 'rgba(255,255,255,0.5)',
              }}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode description */}
      <p
        className="text-center text-sm mb-8"
        style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)' }}
      >
        <span style={{ color: 'var(--color-bio-green)' }}>{currentMode.targetZone}</span>
        {' — '}
        {currentMode.description}
      </p>

      {/* SVG Interactive Scene */}
      <div aria-hidden="true" className="my-10 px-4">
        <BiofluidVisualizerSVG mode={activeMode} />
      </div>
      <p className="sr-only">
        Animación de dispensación de biopreparados en modo {activeMode === 'high' ? 'Rociado Alto (hoja y tallo)' : 'Rociado Bajo (raíz y base)'}.
      </p>

      {/* BioBox formula */}
      <div
        className="mt-16"
        style={{ maxWidth: 'var(--container-max)', margin: '4rem auto 0', padding: '0 var(--container-padding)' }}
      >
        <h3
          className="text-sm uppercase tracking-widest mb-6 text-center"
          style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}
        >
          Fórmula BioBox — Ingredientes
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {content.bioboxFormula.map((ingredient, i) => (
            <button
              key={i}
              onClick={() =>
                setExpandedIngredient(expandedIngredient === ingredient.name ? null : ingredient.name)
              }
              className="text-left p-4 rounded-xl transition-all duration-200"
              style={{
                background: expandedIngredient === ingredient.name
                  ? 'rgba(34,197,94,0.1)'
                  : 'rgba(255,255,255,0.03)',
                border: expandedIngredient === ingredient.name
                  ? '1px solid rgba(34,197,94,0.3)'
                  : '1px solid rgba(255,255,255,0.06)',
                width: '100%',
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm" style={{ color: 'white', fontFamily: 'var(--font-body)' }}>
                  {ingredient.name}
                </span>
                <span className="text-xs" style={{ color: 'rgba(34,197,94,0.7)', fontFamily: 'var(--font-mono)' }}>
                  {ingredient.quantity}
                </span>
              </div>
              {expandedIngredient === ingredient.name && (
                <>
                  <p className="text-xs leading-relaxed mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {ingredient.purpose}
                  </p>
                  <span className="text-xs" style={{ color: 'var(--color-soil-amber)', fontFamily: 'var(--font-mono)' }}>
                    ${ingredient.costUSD.toFixed(2)} USD
                  </span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
