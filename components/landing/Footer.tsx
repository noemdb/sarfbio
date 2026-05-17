'use client'
// components/landing/Footer.tsx — SARFBIO Footer
export function Footer() {
  return (
    <footer
      style={{
        background: '#030608',
        borderTop: '1px solid rgba(34,197,94,0.1)',
        padding: '3rem var(--container-padding)',
      }}
    >
      <div
        className="flex flex-col md:flex-row items-center justify-between gap-6"
        style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}
      >
        <div>
          <span
            className="font-black text-2xl"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-bio-green)' }}
          >
            SARF<span style={{ color: 'rgba(255,255,255,0.5)' }}>BIO</span>
          </span>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)' }}>
            Sistema Automatizado de Riego Focalizado de Biopreparados
          </p>
        </div>

        <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-body)' }}>
          © 2024 SARFBIO Agrotech · Yaracuy, Venezuela · Proyecto Open Hardware
        </p>

        <div className="flex items-center gap-4">
          <a
            href="mailto:info@sarfbio.org"
            className="text-xs transition-colors duration-200"
            style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--color-bio-green)')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.3)')}
          >
            info@sarfbio.org
          </a>
        </div>
      </div>
    </footer>
  )
}
