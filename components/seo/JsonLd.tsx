// components/seo/JsonLd.tsx — Spec: spec_driven_v01.md Tarea 8.1
import type { SarfbioContent } from '@/types/content'

interface JsonLdProps {
  content: SarfbioContent
}

export function JsonLd({ content }: JsonLdProps) {
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'SARFBIO-01',
    description: content.product.description,
    brand: {
      '@type': 'Organization',
      name: 'SARFBIO Agrotech',
    },
    offers: content.business.hardwareKits.map((kit) => ({
      '@type': 'Offer',
      name: kit.name,
      price: kit.priceUSD,
      priceCurrency: 'USD',
      availability: 'https://schema.org/PreOrder',
    })),
    category: 'Agricultural Robot',
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SARFBIO Agrotech',
    description: 'Sistema Automatizado de Riego Focalizado de Biopreparados',
    foundingLocation: { '@type': 'Place', name: 'Yaracuy, Venezuela' },
    sameAs: [],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  )
}
