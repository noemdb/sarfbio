// components/landing/ProblemSection.tsx — Spec: spec_driven_v01.md Tarea 5.2
import type { ProblemContent } from '@/types/content'

interface ProblemSectionProps {
  content: ProblemContent
}

export function ProblemSection({ content }: ProblemSectionProps) {
  return (
    <section
      id="problema"
      style={{
        background: 'var(--color-tech-navy)',
        padding: 'var(--section-padding-y) var(--container-padding)',
      }}
    >
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
        {/* Global stats headline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {content.globalStats.map((stat, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl"
              style={{
                border: i === 0
                  ? '1px solid rgba(34,197,94,0.25)'
                  : '1px solid rgba(245,158,11,0.25)',
                background: i === 0
                  ? 'rgba(34,197,94,0.05)'
                  : 'rgba(245,158,11,0.05)',
              }}
            >
              <div className="flex items-baseline gap-2 mb-3">
                <span
                  className="text-display-2xl tracking-tighter"
                  style={{
                    color: i === 0 ? 'var(--color-bio-green)' : 'var(--color-soil-amber)',
                  }}
                >
                  {stat.value}
                </span>
                <span
                  className="text-heading-xl font-bold"
                  style={{
                    color: i === 0 ? 'var(--color-bio-green)' : 'var(--color-soil-amber)',
                  }}
                >
                  {stat.unit}
                </span>
              </div>
              <p className="text-body-lg text-white/70 max-w-[320px]">
                {stat.label}
              </p>
              {stat.source && (
                <p className="text-xs mt-3" style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)' }}>
                  Fuente: {stat.source}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Rhetorical question */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <p className="text-heading-lg text-white/90">
            {content.rhetoricalQuestion}
          </p>
        </div>

        {/* Pain points + narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-heading-xl text-white mb-4">
              {content.sectionTitle}
            </h2>
            <p
              className="mb-10 leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-body)' }}
            >
              {content.problemStatement}
            </p>

            <div className="space-y-4">
              {content.painPoints.map((point) => (
                <div
                  key={point.id}
                  className="flex items-start gap-4 p-4 rounded-2xl"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm" style={{ color: 'white' }}>
                        {point.title}
                      </span>
                      <span
                        className="font-bold text-sm"
                        style={{ color: 'var(--color-soil-amber)', fontFamily: 'var(--font-mono)' }}
                      >
                        {point.score}/{point.maxScore}
                      </span>
                    </div>
                    <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      {point.description}
                    </p>
                    {/* Progress bar */}
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.08)' }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(point.score / point.maxScore) * 100}%`,
                          background: 'var(--color-soil-amber)',
                          transition: 'width 1s ease-out',
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart visual — barras simples */}
          <div
            className="rounded-3xl p-8"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <h3
              className="text-sm uppercase tracking-widest mb-6"
              style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}
            >
              Encuesta de Campo — Problemas Percibidos (1–5)
            </h3>
            <div className="space-y-5">
              {content.painPoints.map((point) => (
                <div key={point.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-body)' }}>
                      {point.title}
                    </span>
                    <span className="text-sm font-bold" style={{ color: 'var(--color-bio-green)', fontFamily: 'var(--font-mono)' }}>
                      {point.score}
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(point.score / point.maxScore) * 100}%`,
                        background: 'linear-gradient(to right, var(--color-bio-green-dark), var(--color-bio-green))',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p
              className="text-xs mt-6"
              style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)' }}
            >
              N=12 productores · Finca El Chaparral · 2024
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
