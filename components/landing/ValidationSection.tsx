// components/landing/ValidationSection.tsx — Spec: spec_driven_v01.md Tarea 5.3
import type { ValidationContent } from '@/types/content'
import { KPICard } from '@/components/ui/KPICard'
import type { KPIMetric } from '@/types/content'

interface ValidationSectionProps {
  content: ValidationContent
}

const SDG_COLORS: Record<number, string> = {
  2: '#DDA827',
  3: '#4C9F38',
  12: '#BF8B2E',
}

export function ValidationSection({ content }: ValidationSectionProps) {
  const kpis: KPIMetric[] = [
    {
      id: 'producers',
      value: content.producersCount,
      label: 'Productores encuestados',
      description: `Finca ${content.farmName} — datos reales`,
      color: 'green',
    },
    {
      id: 'interest',
      value: content.interestPercent,
      unit: '%',
      label: 'Interés de adopción máximo',
      description: 'Puntuación 5/5 en disposición de uso',
      color: 'green',
    },
  ]

  return (
    <section
      id="validacion"
      style={{
        background: 'var(--color-tech-navy-mid)',
        padding: 'var(--section-padding-y) var(--container-padding)',
      }}
    >
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
        {/* Badge de campo */}
        <div className="flex justify-center mb-12">
          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}
          >
            <span className="w-3 h-3 rounded-full" style={{ background: 'var(--color-bio-green)' }} />
            <span className="font-semibold text-sm" style={{ color: 'var(--color-bio-green)', fontFamily: 'var(--font-body)' }}>
              {content.fieldTests} · {content.farmName}
            </span>
          </div>
        </div>

        <h2
          className="font-black mb-4 text-center"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-section)', color: 'white', lineHeight: 1.05 }}
        >
          {content.sectionTitle}
        </h2>
        <p
          className="text-center mb-16 max-w-xl mx-auto"
          style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)' }}
        >
          Todos los datos provienen de encuestas directas con productores reales de la zona.
        </p>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-2xl mx-auto">
          {kpis.map((kpi) => (
            <KPICard key={kpi.id} metric={kpi} />
          ))}
        </div>

        {/* SDG Alignment */}
        <div>
          <h3
            className="text-sm uppercase tracking-widest mb-8 text-center"
            style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}
          >
            Alineación con Objetivos de Desarrollo Sostenible
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {content.alignment.map((sdg) => {
              const color = SDG_COLORS[sdg.sdgNumber] ?? 'var(--color-bio-green)'
              return (
                <div
                  key={sdg.sdgNumber}
                  className="p-6 rounded-2xl text-center"
                  style={{
                    background: `${color}10`,
                    border: `1px solid ${color}30`,
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl font-black"
                    style={{ background: `${color}20`, color, fontFamily: 'var(--font-display)' }}
                  >
                    {sdg.sdgNumber}
                  </div>
                  <h4 className="font-bold mb-1 text-sm" style={{ color: 'white', fontFamily: 'var(--font-body)' }}>
                    ODS {sdg.sdgNumber}: {sdg.title}
                  </h4>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {sdg.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
