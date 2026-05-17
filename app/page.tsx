// app/page.tsx — SARFBIO Landing Page (RSC)
// Spec: spec_driven_v01.md — Orquestación de todas las secciones
import type { Metadata } from 'next'
import { getContent } from '@/content/sarfbio-content'
import { JsonLd } from '@/components/seo/JsonLd'
import { NavBar } from '@/components/landing/NavBar'
import { HeroSection } from '@/components/landing/HeroSection'
import { ProblemSection } from '@/components/landing/ProblemSection'
import { ProductSection } from '@/components/landing/ProductSection'
import { BiofluidSection } from '@/components/landing/BiofluidSection'
import { MetricsSection } from '@/components/landing/MetricsSection'
import { TechBreakdownSection } from '@/components/landing/TechBreakdownSection'
import { BusinessModelSection } from '@/components/landing/BusinessModelSection'
import { ValidationSection } from '@/components/landing/ValidationSection'
import { TeamSection } from '@/components/landing/TeamSection'
import { CTASection } from '@/components/landing/CTASection'
import { Footer } from '@/components/landing/Footer'

const content = getContent()

export const metadata: Metadata = {
  title: content.meta.title,
  description: content.meta.description,
  keywords: content.meta.keywords.join(', '),
  openGraph: {
    title: content.meta.title,
    description: content.meta.description,
    images: [{ url: content.meta.ogImage, width: 1200, height: 630 }],
    type: 'website',
    locale: 'es_VE',
    siteName: 'SARFBIO',
  },
  twitter: {
    card: 'summary_large_image',
    title: content.meta.title,
    description: content.meta.description,
    images: [content.meta.ogImage],
  },
  robots: { index: true, follow: true },
}

export default function Page() {
  return (
    <>
      <JsonLd content={content} />

      <NavBar />

      <main id="main-content">
        {/* 1. Hero — Above the fold */}
        <HeroSection content={content.hero} />

        {/* 2. Problem — El dolor del campo */}
        <ProblemSection content={content.problem} />

        {/* 3. Product — SARFBIO-01 */}
        <ProductSection content={content.product} />

        {/* 4. Biofluid — Partículas bioluminiscentes */}
        <BiofluidSection content={content.biofluid} />

        {/* 5. Metrics — Validación de campo */}
        <MetricsSection content={content.metrics} />

        {/* 6. Tech Breakdown — Anatomía + Exploded View */}
        <TechBreakdownSection content={content.techBreakdown} />

        {/* 7. Business Model — Kits + BioBox */}
        <BusinessModelSection content={content.business} />

        {/* 8. Validation — Field proof */}
        <ValidationSection content={content.validation} />

        {/* 9. Team — Flavio, Marcial, Juan */}
        <TeamSection content={content.team} />

        {/* 10. CTA — De prototipo a soberanía alimentaria */}
        <CTASection content={content.cta} />
      </main>

      <Footer />
    </>
  )
}
