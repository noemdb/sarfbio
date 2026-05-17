'use client'
// components/landing/CTASection.tsx — Spec: spec_driven_v01.md Tarea 5.3
import { useState } from 'react'
import type { CTAContent } from '@/types/content'

interface CTASectionProps {
  content: CTAContent
}

export function CTASection({ content }: CTASectionProps) {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simple mailto fallback (Resend se configura en producción)
    const mailtoUrl = `mailto:info@sarfbio.org?subject=Colaboración SARFBIO — ${encodeURIComponent(formState.name)}&body=${encodeURIComponent(formState.message)}%0A%0AContacto: ${encodeURIComponent(formState.email)}`
    window.location.href = mailtoUrl
    setSubmitted(true)
  }

  return (
    <section
      id="contacto"
      style={{
        background: 'linear-gradient(to bottom, var(--color-tech-navy-mid), var(--color-tech-navy))',
        padding: 'var(--section-padding-y) var(--container-padding)',
      }}
    >
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
        {/* Headline */}
        <div className="text-center mb-16">
          <h2
            className="font-black mb-4"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-section)', color: 'white', lineHeight: 1.05 }}
          >
            {content.headline}
          </h2>
          <p
            className="max-w-2xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-body)', fontSize: '1.1rem' }}
          >
            {content.subheadline}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Need cards */}
          <div className="space-y-4">
            {content.needs.map((need) => (
              <div
                key={need.type}
                className="p-6 rounded-2xl"
                style={{
                  background: need.type === 'funding'
                    ? 'rgba(34,197,94,0.07)'
                    : 'rgba(245,158,11,0.07)',
                  border: need.type === 'funding'
                    ? '1px solid rgba(34,197,94,0.25)'
                    : '1px solid rgba(245,158,11,0.25)',
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: need.type === 'funding'
                        ? 'rgba(34,197,94,0.15)'
                        : 'rgba(245,158,11,0.15)',
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>
                      {need.type === 'funding' ? '💰' : '🤝'}
                    </span>
                  </div>
                  <h3
                    className="font-bold"
                    style={{
                      color: need.type === 'funding' ? 'var(--color-bio-green)' : 'var(--color-soil-amber)',
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.1rem',
                    }}
                  >
                    {need.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-body)' }}>
                  {need.description}
                </p>
              </div>
            ))}

            {/* Social impact banner */}
            <div
              className="p-6 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}
              >
                SARFBIO nace como proyecto estudiantil venezolano con impacto real en el campo. Cada colaboración
                acerca la tecnología agrícola a quienes más la necesitan.
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div
            className="rounded-3xl p-8"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {submitted ? (
              <div className="text-center py-8">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"
                  style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}
                >
                  ✓
                </div>
                <h3 className="font-bold text-xl mb-2" style={{ color: 'var(--color-bio-green)', fontFamily: 'var(--font-display)' }}>
                  ¡Mensaje enviado!
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
                  Nos pondremos en contacto contigo pronto.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3
                  className="font-bold text-lg mb-6"
                  style={{ color: 'white', fontFamily: 'var(--font-display)' }}
                >
                  Escríbenos
                </h3>
                <div>
                  <input
                    type="text"
                    placeholder={content.form.namePlaceholder}
                    value={formState.name}
                    onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                    required
                    className="w-full rounded-xl px-4 py-3 text-sm"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'white',
                      fontFamily: 'var(--font-body)',
                      outline: 'none',
                    }}
                    onFocus={(e) => (e.target.style.border = '1px solid rgba(34,197,94,0.5)')}
                    onBlur={(e) => (e.target.style.border = '1px solid rgba(255,255,255,0.1)')}
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder={content.form.emailPlaceholder}
                    value={formState.email}
                    onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                    required
                    className="w-full rounded-xl px-4 py-3 text-sm"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'white',
                      fontFamily: 'var(--font-body)',
                      outline: 'none',
                    }}
                    onFocus={(e) => (e.target.style.border = '1px solid rgba(34,197,94,0.5)')}
                    onBlur={(e) => (e.target.style.border = '1px solid rgba(255,255,255,0.1)')}
                  />
                </div>
                <div>
                  <textarea
                    placeholder={content.form.messagePlaceholder}
                    value={formState.message}
                    onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                    required
                    rows={4}
                    className="w-full rounded-xl px-4 py-3 text-sm resize-none"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'white',
                      fontFamily: 'var(--font-body)',
                      outline: 'none',
                    }}
                    onFocus={(e) => (e.target.style.border = '1px solid rgba(34,197,94,0.5)')}
                    onBlur={(e) => (e.target.style.border = '1px solid rgba(255,255,255,0.1)')}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300"
                  style={{
                    background: 'var(--color-bio-green)',
                    color: 'var(--color-tech-navy)',
                    fontFamily: 'var(--font-body)',
                    boxShadow: 'var(--glow-green-sm)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = 'var(--glow-green)'
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = 'var(--glow-green-sm)'
                  }}
                >
                  {content.form.submitLabel}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
