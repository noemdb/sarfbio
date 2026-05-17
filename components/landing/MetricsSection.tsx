// components/landing/MetricsSection.tsx — Spec: spec_driven_v01.md Tarea 5.3
import { KPICard } from '@/components/ui/KPICard'
import type { MetricsContent } from '@/types/content'

interface MetricsSectionProps {
  content: MetricsContent
}

export function MetricsSection({ content }: MetricsSectionProps) {
  return (
    <section
      id="metricas"
      style={{
        background: 'var(--color-tech-navy)',
        padding: 'var(--section-padding-y) var(--container-padding)',
      }}
    >
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
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
          Datos recopilados en campo. 12 productores. Finca &ldquo;El Chaparral&rdquo;, Yaracuy.
        </p>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {content.kpis.map((kpi) => (
            <KPICard key={kpi.id} metric={kpi} />
          ))}
        </div>

        {/* Comparison table */}
        <div
          className="rounded-3xl overflow-hidden mb-16"
          style={{ border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div
            className="grid grid-cols-3 px-6 py-3"
            style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}>
              Dimensión
            </span>
            <span className="text-xs uppercase tracking-widest" style={{ color: 'rgba(245,158,11,0.6)', fontFamily: 'var(--font-mono)' }}>
              Manual
            </span>
            <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--color-bio-green)', fontFamily: 'var(--font-mono)' }}>
              SARFBIO
            </span>
          </div>
          {content.comparisonTable.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-3 px-6 py-4 transition-colors duration-200"
              style={{
                borderBottom: i < content.comparisonTable.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                background: row.highlight ? 'rgba(34,197,94,0.03)' : 'transparent',
              }}
            >
              <span className="font-semibold text-sm" style={{ color: 'white', fontFamily: 'var(--font-body)' }}>
                {row.dimension}
              </span>
              <span className="text-sm pr-4" style={{ color: 'rgba(245,158,11,0.6)', fontFamily: 'var(--font-body)' }}>
                {row.manual}
              </span>
              <span className="text-sm" style={{ color: 'rgba(34,197,94,0.85)', fontFamily: 'var(--font-body)' }}>
                {row.sarfbio}
              </span>
            </div>
          ))}
        </div>

        {/* Survey bar chart */}
        <div
          className="rounded-3xl p-8"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <h3
            className="text-sm uppercase tracking-widest mb-8"
            style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}
          >
            Problemas percibidos por productores (escala 1–5)
          </h3>
          <div className="space-y-5">
            {content.surveyResults.map((result, i) => (
              <div key={i} className="flex items-center gap-4">
                <span
                  className="text-sm w-40 flex-shrink-0"
                  style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-body)' }}
                >
                  {result.label}
                </span>
                <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(result.score / result.maxScore) * 100}%`,
                      background: `linear-gradient(to right, var(--color-bio-green-dark), var(--color-bio-green))`,
                    }}
                  />
                </div>
                <span
                  className="text-sm font-bold w-8 text-right"
                  style={{ color: 'var(--color-bio-green)', fontFamily: 'var(--font-mono)' }}
                >
                  {result.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
