// types/content.ts — ÚNICA fuente de verdad para tipos de contenido SARFBIO
// Spec: spec_driven_v01.md — Tarea 1.1

export interface SarfbioContent {
  meta: MetaContent
  hero: HeroContent
  problem: ProblemContent
  product: ProductContent
  biofluid: BiofluidContent
  metrics: MetricsContent
  techBreakdown: TechBreakdownContent
  business: BusinessContent
  validation: ValidationContent
  team: TeamContent
  cta: CTAContent
}

export interface MetaContent {
  title: string
  description: string
  keywords: string[]
  ogImage: string
  twitterHandle: string
}

export interface HeroContent {
  headline: string
  subheadline: string
  tagline: string
  ctaPrimary: CTAButton
  ctaSecondary: CTAButton
  stats: StatItem[]
}

export interface StatItem {
  value: string
  unit: string
  label: string
  source?: string
}

export interface CTAButton {
  label: string
  href: string
  variant: 'primary' | 'secondary' | 'ghost'
}

export interface ProblemContent {
  sectionTitle: string
  sectionSubtitle: string
  problemStatement: string
  globalStats: StatItem[]
  painPoints: PainPoint[]
  rhetoricalQuestion: string
}

export interface PainPoint {
  id: string
  title: string
  description: string
  score: number
  maxScore: number
  icon: string
}

export interface ProductContent {
  sectionTitle: string
  tagline: string
  description: string
  components: HardwareComponent[]
  differentiators: Differentiator[]
  autonomyMinutes: number
}

export interface HardwareComponent {
  id: string
  name: string
  description: string
  annotation3DPosition: [number, number, number]
  icon: string
}

export interface Differentiator {
  id: string
  title: string
  description: string
  vsTraditional: string
}

export interface BiofluidContent {
  sectionTitle: string
  description: string
  sprayModes: SprayMode[]
  bioboxFormula: BioboxIngredient[]
}

export interface SprayMode {
  id: 'high' | 'low'
  label: string
  targetZone: string
  description: string
}

export interface BioboxIngredient {
  name: string
  quantity: string
  purpose: string
  costUSD: number
}

export interface MetricsContent {
  sectionTitle: string
  kpis: KPIMetric[]
  surveyResults: SurveyResult[]
  comparisonTable: ComparisonRow[]
}

export interface KPIMetric {
  id: string
  value: string | number
  unit?: string
  label: string
  description: string
  color: 'green' | 'amber' | 'white'
}

export interface SurveyResult {
  label: string
  score: number
  maxScore: number
}

export interface ComparisonRow {
  dimension: string
  manual: string
  sarfbio: string
  highlight: boolean
}

export interface TechBreakdownContent {
  sectionTitle: string
  components: TechComponent[]
}

export interface TechComponent {
  id: string
  name: string
  category: 'brain' | 'locomotion' | 'application' | 'power'
  description: string
  costUSD: number
  explodedOffset: [number, number, number]
}

export interface BusinessContent {
  sectionTitle: string
  hardwareKits: ProductKit[]
  subscriptions: SubscriptionProduct[]
  valueAddedServices: Service[]
}

export interface ProductKit {
  id: string
  name: string
  priceUSD: number
  costUSD: number
  marginPercent: number
  description: string
  featured: boolean
}

export interface SubscriptionProduct {
  id: string
  name: string
  priceUSD: number
  coverage: string
  formula: 'maiz' | 'cacao' | 'educativo'
}

export interface Service {
  id: string
  name: string
  description: string
}

export interface ValidationContent {
  sectionTitle: string
  farmName: string
  producersCount: number
  interestPercent: number
  fieldTests: string
  alignment: SDGAlignment[]
}

export interface SDGAlignment {
  sdgNumber: number
  title: string
  description: string
}

export interface TeamContent {
  sectionTitle: string
  origin: string
  purpose: string
  vision: string
  members: TeamMember[]
}

export interface TeamMember {
  id: string
  name: string
  role: string
  title: string
  imageUrl: string
  linkedinUrl?: string
}

export interface CTAContent {
  headline: string
  subheadline: string
  needs: NeedItem[]
  form: {
    namePlaceholder: string
    emailPlaceholder: string
    messagePlaceholder: string
    submitLabel: string
  }
}

export interface NeedItem {
  type: 'funding' | 'partnership'
  title: string
  description: string
}
