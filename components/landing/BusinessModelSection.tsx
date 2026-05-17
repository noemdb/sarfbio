// components/landing/BusinessModelSection.tsx — Spec: spec_driven_v01.md Tarea 5.3
import type { BusinessContent } from '@/types/content'

interface BusinessModelSectionProps {
  content: BusinessContent
}

const FORMULA_LABELS: Record<string, string> = {
  maiz: '🌽 Maíz',
  cacao: '🍫 Cacao',
  educativo: '🌿 Hidropónico',
}

export function BusinessModelSection({ content }: BusinessModelSectionProps) {
  return (
    <section
      id="negocio"
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
          className="text-center mb-16 max-w-2xl mx-auto"
          style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)' }}
        >
          Modelo flywheel: el hardware genera demanda continua de BioBox, creando ingresos recurrentes.
        </p>

        {/* Hardware Kits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {content.hardwareKits.map((kit) => (
            <div
              key={kit.id}
              className="relative rounded-3xl p-8 transition-transform duration-300 hover:scale-[1.01]"
              style={{
                background: kit.featured
                  ? 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(34,197,94,0.04))'
                  : 'rgba(255,255,255,0.03)',
                border: kit.featured
                  ? '1px solid rgba(34,197,94,0.35)'
                  : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {kit.featured && (
                <div
                  className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    background: 'var(--color-bio-green)',
                    color: 'var(--color-tech-navy)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  Recomendado
                </div>
              )}
              <div className="mb-6">
                <h3
                  className="font-bold text-lg mb-1"
                  style={{ color: 'white', fontFamily: 'var(--font-display)' }}
                >
                  {kit.name}
                </h3>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
                  {kit.description}
                </p>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span
                  className="text-5xl font-black"
                  style={{ color: kit.featured ? 'var(--color-bio-green)' : 'white', fontFamily: 'var(--font-display)' }}
                >
                  ${kit.priceUSD}
                </span>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>USD</span>
              </div>
              <div className="flex items-center gap-4 text-xs" style={{ fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: 'rgba(255,255,255,0.35)' }}>Costo: ${kit.costUSD}</span>
                <span style={{ color: 'var(--color-soil-amber)' }}>Margen: {kit.marginPercent}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* BioBox subscriptions */}
        <div
          className="rounded-3xl p-8 mb-12"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <h3
            className="font-bold mb-2"
            style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}
          >
            BioBox — Consumibles Mensuales
          </h3>
          <p
            className="mb-6 text-sm"
            style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)' }}
          >
            Recarga de biopreparados formulada para cada cultivo.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {content.subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="p-5 rounded-2xl"
                style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)' }}
              >
                <div className="text-2xl mb-2">{FORMULA_LABELS[sub.formula]?.split(' ')[0]}</div>
                <h4 className="font-semibold text-sm mb-1" style={{ color: 'white' }}>{sub.name}</h4>
                <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>{sub.coverage}</p>
                <span
                  className="text-2xl font-black"
                  style={{ color: 'var(--color-bio-green)', fontFamily: 'var(--font-display)' }}
                >
                  $20
                  <span className="text-sm font-normal" style={{ color: 'rgba(255,255,255,0.3)' }}>/unidad</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Value added services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.valueAddedServices.map((service) => (
            <div
              key={service.id}
              className="flex items-start gap-4 p-5 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(245,158,11,0.12)' }}
              >
                <span style={{ color: 'var(--color-soil-amber)' }}>⊕</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1" style={{ color: 'white', fontFamily: 'var(--font-body)' }}>
                  {service.name}
                </h4>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)' }}>
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
