'use client'
// components/landing/ProductSection.tsx — Spec: spec_driven_v01.md Tarea 5.3
import type { ProductContent } from '@/types/content'

interface ProductSectionProps {
  content: ProductContent
}

export function ProductSection({ content }: ProductSectionProps) {
  return (
    <section
      id="producto"
      style={{
        background: 'var(--color-tech-navy-mid)',
        padding: 'var(--section-padding-y) var(--container-padding)',
      }}
    >
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <div
            className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full"
            style={{ border: '1px solid rgba(34,197,94,0.2)', background: 'rgba(34,197,94,0.06)' }}
          >
            <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--color-bio-green)', fontFamily: 'var(--font-mono)' }}>
              SARFBIO-01
            </span>
          </div>
          <h2 className="text-heading-xl text-white mb-4">
            {content.sectionTitle}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-body)', lineHeight: 1.7 }}>
            {content.description}
          </p>
          <div
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}
          >
            <span className="text-2xl font-black" style={{ color: 'var(--color-bio-green)', fontFamily: 'var(--font-display)' }}>
              {content.autonomyMinutes}
            </span>
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-body)' }}>
              min de autonomía por ciclo
            </span>
          </div>
        </div>

        {/* Components grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {content.components.map((comp) => (
            <div
              key={comp.id}
              className="rounded-2xl p-5 transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(34,197,94,0.12)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.border = '1px solid rgba(34,197,94,0.35)'
                ;(e.currentTarget as HTMLElement).style.background = 'rgba(34,197,94,0.05)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.border = '1px solid rgba(34,197,94,0.12)'
                ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: 'rgba(34,197,94,0.12)' }}
              >
                <span style={{ color: 'var(--color-bio-green)', fontSize: '18px' }}>⚡</span>
              </div>
              <h3 className="font-semibold text-sm mb-1" style={{ color: 'white', fontFamily: 'var(--font-body)' }}>
                {comp.name}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {comp.description}
              </p>
            </div>
          ))}
        </div>

        {/* Differentiators */}
        <div>
          <h3
            className="text-sm uppercase tracking-widest mb-8"
            style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}
          >
            SARFBIO vs. Método Tradicional
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.differentiators.map((diff) => (
              <div
                key={diff.id}
                className="flex items-start gap-4 p-5 rounded-2xl"
                style={{
                  background: 'rgba(34,197,94,0.04)',
                  border: '1px solid rgba(34,197,94,0.15)',
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(34,197,94,0.15)' }}
                >
                  <span style={{ color: 'var(--color-bio-green)', fontWeight: 'bold', fontSize: '14px' }}>✓</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-0.5" style={{ color: 'white', fontFamily: 'var(--font-body)' }}>
                    {diff.title}
                  </h4>
                  <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {diff.description}
                  </p>
                  <p className="text-xs" style={{ color: 'rgba(245,158,11,0.6)', fontFamily: 'var(--font-mono)' }}>
                    {diff.vsTraditional}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
