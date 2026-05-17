'use client'
// components/landing/TechBreakdownSection.tsx — Spec: spec_driven_v01.md Tarea 5.3
import type { TechBreakdownContent } from '@/types/content'
import { ExplodedViewSVG } from './ExplodedViewSVG'

const CATEGORY_COLORS: Record<string, string> = {
  brain: 'var(--color-bio-green)',
  locomotion: 'var(--color-soil-amber)',
  application: '#60a5fa',
  power: '#a78bfa',
}

const CATEGORY_LABELS: Record<string, string> = {
  brain: 'Control',
  locomotion: 'Tracción',
  application: 'Aplicación',
  power: 'Potencia',
}

interface TechBreakdownSectionProps {
  content: TechBreakdownContent
}

export function TechBreakdownSection({ content }: TechBreakdownSectionProps) {
  const totalCost = content.components.reduce((sum, c) => sum + c.costUSD, 0)

  return (
    <section
      id="tecnica"
      style={{
        background: 'var(--color-tech-navy-mid)',
        padding: 'var(--section-padding-y) var(--container-padding)',
      }}
    >
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: info */}
          <div>
            <div
              className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full"
              style={{ border: '1px solid rgba(34,197,94,0.2)', background: 'rgba(34,197,94,0.06)' }}
            >
              <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--color-bio-green)', fontFamily: 'var(--font-mono)' }}>
                Bill of Materials
              </span>
            </div>
            <h2
              className="font-black mb-6"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-section)', color: 'white', lineHeight: 1.05 }}
            >
              {content.sectionTitle}
            </h2>
            <p
              className="mb-8"
              style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)' }}
            >
              Scroll para desensamblar el robot y explorar cada componente.
            </p>

            {/* Components list */}
            <div className="space-y-3">
              {content.components.map((comp) => {
                const color = CATEGORY_COLORS[comp.category] ?? 'var(--color-bio-green)'
                return (
                  <div
                    key={comp.id}
                    className="flex items-center gap-4 p-4 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div
                      className="w-2 h-8 rounded-full flex-shrink-0"
                      style={{ background: color }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm" style={{ color: 'white', fontFamily: 'var(--font-body)' }}>
                          {comp.name}
                        </span>
                        <span className="text-sm font-bold" style={{ color, fontFamily: 'var(--font-mono)' }}>
                          ${comp.costUSD}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: `${color}15`, color, fontFamily: 'var(--font-mono)' }}
                        >
                          {CATEGORY_LABELS[comp.category]}
                        </span>
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                          {comp.description}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Total */}
            <div
              className="flex items-center justify-between mt-4 p-4 rounded-xl"
              style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}
            >
              <span className="font-bold" style={{ color: 'white', fontFamily: 'var(--font-body)' }}>
                Costo Total de Componentes
              </span>
              <span className="text-2xl font-black" style={{ color: 'var(--color-bio-green)', fontFamily: 'var(--font-display)' }}>
                ${totalCost}
              </span>
            </div>
          </div>

          {/* Right: 2D exploded view blueprint */}
          <div aria-hidden="true" className="w-full">
            <ExplodedViewSVG content={content} />
          </div>
        </div>
      </div>
    </section>
  )
}
