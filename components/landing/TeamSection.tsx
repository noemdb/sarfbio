'use client'
// components/landing/TeamSection.tsx — Spec: spec_driven_v01.md Tarea 5.3
import type { TeamContent } from '@/types/content'

interface TeamSectionProps {
  content: TeamContent
}

const ROLE_COLORS: Record<string, string> = {
  CEO: 'var(--color-bio-green)',
  CTO: '#60a5fa',
  COO: 'var(--color-soil-amber)',
}

export function TeamSection({ content }: TeamSectionProps) {
  return (
    <section
      id="equipo"
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

        {/* Origin story */}
        <div
          className="max-w-3xl mx-auto mb-16 p-8 rounded-3xl text-center"
          style={{ background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.15)' }}
        >
          <p
            className="text-lg leading-relaxed mb-4"
            style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}
          >
            &ldquo;{content.origin}&rdquo;
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <div>
              <span className="block font-bold mb-1" style={{ color: 'var(--color-bio-green)', fontFamily: 'var(--font-display)' }}>
                Propósito
              </span>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>{content.purpose}</p>
            </div>
          </div>
        </div>

        {/* Team members */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.members.map((member) => {
            const roleColor = ROLE_COLORS[member.role] ?? 'var(--color-bio-green)'
            return (
              <div
                key={member.id}
                className="group rounded-3xl p-6 text-center transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.border = `1px solid ${roleColor}30`
                  ;(e.currentTarget as HTMLElement).style.background = `${roleColor}06`
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.07)'
                  ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'
                }}
              >
                {/* Avatar */}
                <div
                  className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-black overflow-hidden"
                  style={{
                    background: `${roleColor}15`,
                    border: `2px solid ${roleColor}30`,
                    fontFamily: 'var(--font-display)',
                    color: roleColor,
                  }}
                >
                  {member.name.split(' ')[0][0]}
                  {member.name.split(' ')[1]?.[0]}
                </div>

                {/* Role badge */}
                <div
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mb-3"
                  style={{
                    background: `${roleColor}15`,
                    color: roleColor,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {member.role}
                </div>

                <h3
                  className="font-bold text-sm mb-1 leading-tight"
                  style={{ color: 'white', fontFamily: 'var(--font-display)' }}
                >
                  {member.name}
                </h3>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-body)' }}>
                  {member.title}
                </p>
              </div>
            )
          })}
        </div>

        {/* Vision */}
        <div
          className="mt-16 text-center max-w-2xl mx-auto p-8 rounded-3xl"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <h3
            className="text-xs uppercase tracking-widest mb-3"
            style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}
          >
            Visión
          </h3>
          <p
            className="text-lg font-semibold"
            style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-display)' }}
          >
            {content.vision}
          </p>
        </div>
      </div>
    </section>
  )
}
