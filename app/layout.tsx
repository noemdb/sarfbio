import React from 'react'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

// SARFBIO Typography — Mono-familia basada en Inter
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SARFBIO — Precisión Quirúrgica y Orgánica',
  description:
    'Robot agrícola inteligente para dispensación automatizada de biopreparados. Protege tus cultivos de maíz y cacao con tecnología de precisión accesible.',
  keywords: 'robot agrícola, biopreparados, agricultura de precisión, ESP32, Venezuela, SARFBIO',
  openGraph: {
    title: 'SARFBIO — Precisión Quirúrgica y Orgánica',
    description:
      'El primer robot agrícola venezolano que aplica biopreparados exactamente donde cada planta lo necesita.',
    type: 'website',
    locale: 'es_VE',
    siteName: 'SARFBIO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SARFBIO — Robot AgriTech Venezuela',
  },
  icons: {
    icon: '/asset/favicon.png',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        {/* Skip to content — accessibility */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
        style={{
          background: 'var(--color-tech-navy)',
          color: 'white',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <a
          href="#inicio"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: 'var(--color-bio-green)', color: 'var(--color-tech-navy)' }}
        >
          Saltar al contenido
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
