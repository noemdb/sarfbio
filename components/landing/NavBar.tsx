'use client'
// components/landing/NavBar.tsx — Navigation SARFBIO
import { useState, useEffect } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Producto', href: '#producto' },
  { label: 'Biofluido', href: '#biofluido' },
  { label: 'Métricas', href: '#metricas' },
  { label: 'Equipo', href: '#equipo' },
  { label: 'Contacto', href: '#contacto' },
]

export function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(15,23,42,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(34,197,94,0.12)' : 'none',
      }}
      aria-label="Navegación principal"
    >
      <div
        className="flex items-center justify-between"
        style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--container-padding)', height: '64px' }}
      >
        {/* Logo */}
        <Link href="#inicio" className="flex items-center gap-2">
          <span
            className="font-black text-xl tracking-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-bio-green)' }}
          >
            SARF
            <span style={{ color: 'white' }}>BIO</span>
          </span>
          <span
            className="hidden sm:block text-xs"
            style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}
          >
            v0.1
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm transition-colors duration-200"
                style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-body)' }}
                onMouseEnter={(e) => {
                  ;(e.target as HTMLElement).style.color = 'var(--color-bio-green)'
                }}
                onMouseLeave={(e) => {
                  ;(e.target as HTMLElement).style.color = 'rgba(255,255,255,0.6)'
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-4">
          <a
            href="#contacto"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
            style={{
              background: 'var(--color-bio-green)',
              color: 'var(--color-tech-navy)',
              fontFamily: 'var(--font-body)',
            }}
            onMouseEnter={(e) => {
              ;(e.target as HTMLElement).style.background = 'var(--color-bio-green-light)'
            }}
            onMouseLeave={(e) => {
              ;(e.target as HTMLElement).style.background = 'var(--color-bio-green)'
            }}
          >
            Colaborar
          </a>

          <button
            className="md:hidden p-2 rounded-lg"
            style={{ border: '1px solid rgba(34,197,94,0.2)', color: 'rgba(255,255,255,0.7)' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label="Menú de navegación"
          >
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden px-4 pb-4"
          style={{ background: 'rgba(15,23,42,0.98)', borderTop: '1px solid rgba(34,197,94,0.1)' }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-3 text-sm"
              style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-body)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contacto"
            className="block mt-3 py-2 text-center rounded-full text-sm font-semibold"
            style={{ background: 'var(--color-bio-green)', color: 'var(--color-tech-navy)' }}
            onClick={() => setMobileOpen(false)}
          >
            Colaborar
          </a>
        </div>
      )}
    </nav>
  )
}
