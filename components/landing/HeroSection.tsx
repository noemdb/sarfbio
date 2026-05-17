'use client'
// components/landing/HeroSection.tsx — Spec: spec_driven_v01.md Tarea 5.1
import { motion } from 'framer-motion'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import type { HeroContent } from '@/types/content'

interface HeroSectionProps {
  content: HeroContent
}

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'var(--color-tech-navy)' }}
    >
      {/* Atmospheric background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <LeafParticles />
        <div
          className="absolute rounded-full blur-[140px]"
          style={{
            top: '15%', left: '5%', width: '600px', height: '600px',
            background: 'rgba(34,197,94,0.06)',
          }}
        />
        <div
          className="absolute rounded-full blur-[120px]"
          style={{
            bottom: '15%', right: '5%', width: '500px', height: '500px',
            background: 'rgba(245,158,11,0.05)',
          }}
        />
        {/* Circuit pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div
        className="relative z-10 w-full"
        style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '100px var(--container-padding) 60px' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" style={{ minHeight: '75vh' }}>

          {/* Left: Content */}
          <div className="relative">
            {/* Tag */}
            <div
              className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full"
              style={{ border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.08)' }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: 'var(--color-bio-green)' }}
              />
              <span
                className="text-xs uppercase tracking-widest"
                style={{ color: 'var(--color-bio-green)', fontFamily: 'var(--font-mono)' }}
              >
                {content.tagline}
              </span>
            </div>

            {/* H1 */}
            <h1 className="text-display-2xl text-white mb-6">
              {content.headline.split('\n').map((line, i) => (
                <span key={i} className="block">
                  {i === 1 ? (
                    <span style={{ color: 'var(--color-bio-green)' }}>{line}</span>
                  ) : (
                    line
                  )}
                </span>
              ))}
            </h1>

            {/* Subheadline */}
            <p className="text-body-lg text-white/60 max-w-[520px] mb-10">
              {content.subheadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-14">
              <a
                href={content.ctaPrimary.href}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-ui-lg transition-all duration-300"
                style={{
                  background: 'var(--color-bio-green)',
                  color: 'var(--color-tech-navy)',
                  boxShadow: 'var(--glow-green-sm)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'var(--glow-green)'
                  ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'var(--glow-green-sm)'
                  ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                }}
              >
                {content.ctaPrimary.label}
                <span>→</span>
              </a>
              <a
                href={content.ctaSecondary.href}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300"
                style={{
                  border: '1px solid rgba(34,197,94,0.4)',
                  color: 'var(--color-bio-green)',
                  fontFamily: 'var(--font-body)',
                  background: 'transparent',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(34,197,94,0.1)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent'
                }}
              >
                {content.ctaSecondary.label}
              </a>
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-3 gap-4 pt-6"
              style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
            >
              {content.stats.map((stat, i) => (
                <div key={i}>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-kpi-md text-bio-green">
                      <AnimatedCounter value={parseFloat(stat.value)} />
                    </span>
                    <span className="font-bold text-lg text-bio-green">
                      {stat.unit}
                    </span>
                  </div>
                  <p className="text-xs mt-1 leading-tight" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {stat.label}
                  </p>
                  {stat.source && (
                    <p className="text-xs" style={{ color: 'rgba(34,197,94,0.4)', fontFamily: 'var(--font-mono)' }}>
                      {stat.source}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Video Presentation */}
          <div className="flex justify-center lg:justify-end w-full">
            <div 
              className="relative w-[90%] lg:w-[80%] h-[350px] lg:h-[480px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 hover:scale-[1.02]" 
              style={{ border: '3px solid rgba(255,255,255,0.1)' }}
              aria-hidden="true"
            >
              <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              src="/asset/0514-01_1778772713704.mp4"
            />
            {/* Subtle glow/overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-tech-navy/40 to-transparent pointer-events-none" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none" />
            <p className="sr-only">
              Video demostrativo del sistema robótico SARFBIO-01 operando en el campo.
            </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce"
        aria-hidden="true"
      >
        <span className="text-overline text-white/25">
          Scroll
        </span>
        <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, rgba(34,197,94,0.5), transparent)' }} />
      </div>
    </section>
  )
}

function LeafParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(12)].map((_, i) => (
        <LeafParticle key={i} index={i} />
      ))}
    </div>
  )
}

function LeafParticle({ index }: { index: number }) {
  // Generate pseudo-random deterministic values based on index
  const size = 15 + (index * 7) % 25 // 15 to 40px
  const startX = (index * 17) % 100 // 0 to 100vw
  const duration = 20 + (index * 5) % 20 // 20 to 40s
  const delay = (index * 3) % 15 // 0 to 15s
  
  return (
    <motion.div
      className="absolute bottom-[-100px]"
      initial={{ x: `${startX}vw`, y: '100px', opacity: 0, rotate: 0 }}
      animate={{ 
        x: [`${startX}vw`, `${startX + 10}vw`, `${startX - 5}vw`, `${startX + 5}vw`],
        y: ['100px', '-120vh'], 
        opacity: [0, 0.15, 0.25, 0],
        rotate: [0, 45, -45, 90]
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: 'linear'
      }}
      style={{
        width: size,
        height: size * 2.5,
        color: 'var(--color-bio-green)',
        filter: 'blur(1px)'
      }}
    >
      <svg viewBox="0 0 24 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-30">
        <path d="M12 0C18 15 24 45 12 60C0 45 6 15 12 0Z" fill="currentColor"/>
      </svg>
    </motion.div>
  )
}
