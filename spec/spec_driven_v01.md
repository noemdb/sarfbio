# SARFBIO — ESPECIFICACIÓN TÉCNICA DE IMPLEMENTACIÓN vNEXT
## Landing Page Interactiva · Staff/Principal Frontend Architect Level

> **Clasificación:** Execution Blueprint + Architecture RFC + Implementation Spec  
> **Versión:** 1.0.0  
> **Stack:** Next.js 16.2 · React 19 · TypeScript 5.x strict · Tailwind CSS 4.x · Three.js / R3F  
> **Audiencia:** Agentes autónomos de código, equipos frontend senior, pipelines AI-assisted coding

---

# 1. VISIÓN ARQUITECTÓNICA GLOBAL

## 1.1 Objetivos Técnicos

| ID | Objetivo | Métrica de Éxito |
|----|----------|-----------------|
| OT-01 | Experiencia cinematográfica AgriTech premium | Puntuación visual subjetiva ≥ 9/10 en evaluaciones de usuario |
| OT-02 | Zero layout shift durante carga de escenas 3D | CLS < 0.05 |
| OT-03 | Contenido above-the-fold visible en < 1.2s | LCP < 1.8s en red 4G |
| OT-04 | Interactividad fluida a 60fps en escenas 3D | INP < 200ms; frame-time < 16.6ms |
| OT-05 | SEO indexable sin depender de canvas | 100% contenido semántico en HTML estático |
| OT-06 | Separación absoluta contenido / presentación | Zero strings hardcodeados en componentes visuales |

## 1.2 Principios de Diseño Arquitectónico

**P1 — Content-First Rendering:** Todo contenido textual y estructural se renderiza server-side o en el HTML estático inicial. Las escenas 3D son *progressive enhancement*, nunca bloqueantes.

**P2 — Island Architecture para 3D:** Cada escena Three.js es una isla client-side aislada. El resto de la página puede hidratarse y ser interactiva independientemente. Implementado via `dynamic()` de Next.js con `ssr: false`.

**P3 — GPU Budget Discipline:** Presupuesto de GPU estricto. Máximo 2 escenas Three.js activas simultáneamente (una visible + una en preload). Las escenas fuera del viewport se suspenden via `useIntersectionObserver` + `frameloop="demand"`.

**P4 — Zero Content Coupling:** Los componentes visuales consumen exclusivamente tipos de `@/types/content.ts`. Nunca importan directamente de `sarfbio-content.ts`. El contenido se inyecta via props tipadas.

**P5 — Motion Hierarchy:** Tres capas de animación con responsabilidades estrictas:
- **CSS Transforms:** Microinteracciones, hovers, transiciones de estado UI
- **Framer Motion:** Animaciones de entrada scroll-triggered, stagger systems, layout transitions
- **GLSL / Three.js:** Animaciones de mundo 3D, shaders de fluidos, partículas

## 1.3 Rendering Strategy

```
┌─────────────────────────────────────────────────┐
│  app/page.tsx (RSC - Server Component)          │
│  ├── <NavBar />           → RSC + Client Island  │
│  ├── <HeroSection />      → RSC shell            │
│  │   └── <HeroScene3D />  → Client Island (lazy) │
│  ├── <ProblemSection />   → RSC                  │
│  ├── <ProductSection />   → RSC shell            │
│  │   └── <RobotScene3D /> → Client Island (lazy) │
│  ├── <MetricsSection />   → RSC                  │
│  ├── <BiofluidSection />  → RSC shell            │
│  │   └── <BioScene3D />   → Client Island (lazy) │
│  ├── <TechBreakdown />    → RSC shell            │
│  │   └── <ExplodedView /> → Client Island (lazy) │
│  ├── <BusinessSection />  → RSC                  │
│  ├── <TeamSection />      → RSC                  │
│  ├── <CTASection />       → RSC + Client Island  │
│  └── <Footer />           → RSC                  │
└─────────────────────────────────────────────────┘
```

**Hydration Strategy:** Selective / Progressive. Los RSC no se hidratan. Las islas client se hidratan lazy con `loading="lazy"` + IntersectionObserver. El critical path (NavBar, Hero text, CTA) se hidrata inmediatamente.

## 1.4 Client / Server Boundaries

| Componente | Boundary | Justificación |
|-----------|----------|---------------|
| `app/page.tsx` | Server | Renderiza estructura, metadata, contenido estático |
| `features/hero/HeroScene3D` | `'use client'` | Three.js requiere DOM/WebGL |
| `features/robot/RobotScene3D` | `'use client'` | Three.js requiere DOM/WebGL |
| `components/ui/AnimatedCounter` | `'use client'` | Requiere `requestAnimationFrame` |
| `components/ui/NavBar` | `'use client'` | Requiere scroll listeners, estado de menú |
| `features/contact/ContactForm` | `'use client'` | Maneja estado de formulario y Resend API calls |
| `components/landing/*` | Server (por defecto) | Contenido estático renderizable server-side |

## 1.5 Asset Strategy

```
/public/
├── models/           → glTF/GLB con Draco compression
│   ├── sarfbio-robot.glb         (~800KB compressed)
│   ├── corn-plant.glb            (~300KB compressed)
│   ├── cacao-plant.glb           (~300KB compressed)
│   └── biofluid-emitter.glb      (~150KB compressed)
├── textures/
│   ├── robot-atlas.ktx2          → Basis Universal, GPU-ready
│   ├── terrain-heightmap.png     → 512x512, grayscale
│   └── leaf-normal.ktx2          → Normal maps
├── videos/
│   └── hero-loop.mp4             → Fallback para dispositivos sin WebGL
└── images/
    ├── og-image.jpg              → 1200x630, < 100KB
    └── team/                     → WebP, responsive sizes
```

**Formato KTX2/Basis Universal para texturas:** Compresión GPU-nativa, decodificación en hardware. Se transcode en runtime via `@react-three/drei`'s `KTX2Loader`. Evita upload de JPEG al GPU (costoso en memoria).

## 1.6 Animation Strategy

```
Scroll Progress (0% → 100%)
    │
    ├── 0-15%   → Hero: fade-in text, robot float animation
    ├── 15-30%  → Problem: stats count-up, pain points reveal
    ├── 30-50%  → Product: robot 3D interactive, arm demo
    ├── 50-65%  → Biofluid: particle flow scene
    ├── 65-80%  → Metrics: chart animations, KPI counters
    ├── 80-90%  → Business model cards
    └── 90-100% → Team + CTA
```

**Implementación de scroll-driven:** `useScroll()` de Framer Motion como fuente de verdad para scroll progress. Se transforma a `MotionValue` y se distribuye via Context para evitar re-renders en cascade.

## 1.7 Responsive Strategy

| Breakpoint | Estrategia 3D | Layout |
|-----------|---------------|--------|
| `2xl` (≥1536px) | Full cinematic, todas las escenas | Side-by-side, hero fullscreen |
| `xl` (≥1280px) | Full 3D, reduced detail | Side-by-side |
| `lg` (≥1024px) | Full 3D, LOD reducido | Stacked con overlay |
| `md` (≥768px) | 3D simplificado, particles off | Stacked |
| `sm` (≥640px) | 3D básico o video fallback | Mobile layout |
| `xs` (<640px) | Video fallback obligatorio, cero Three.js | Mobile full |

**Conditional Rendering Mobile:** `useMediaQuery('(prefers-reduced-motion: reduce)')` y `useMediaQuery('(max-width: 639px)')` determinan si se montan o no las escenas Three.js. En mobile, se reemplaza por video loop o imagen estática animada con CSS.

## 1.8 SEO Strategy

- `generateMetadata()` en `app/page.tsx` con OpenGraph completo
- `structured data` JsonLD: `Product`, `Organization`, `WebPage`
- Heading hierarchy: H1 único (Hero tagline), H2 por sección, H3 para subsecciones
- Todas las escenas 3D tienen `aria-label` descriptivo y contenido fallback en `<noscript>`
- `sitemap.xml` y `robots.txt` generados via route handlers

## 1.9 Performance Budget

| Métrica | Target | Hard Limit |
|---------|--------|-----------|
| LCP | < 1.8s | < 2.5s |
| INP | < 100ms | < 200ms |
| CLS | < 0.05 | < 0.1 |
| TBT | < 150ms | < 300ms |
| FCP | < 1.2s | < 1.8s |
| JS Bundle (initial) | < 120KB gzipped | < 180KB |
| 3D Scene total assets | < 2MB por escena | < 3MB |
| Hero LCP image | < 50KB | < 80KB |

---

# 2. AUDITORÍA DEL TEMPLATE EXISTENTE

## 2.1 `/components/landing` — Directrices de Auditoría

Dado que el template no está especificado en detalle, se establece el protocolo de auditoría que el agente ejecutor debe aplicar:

### Componentes a REUTILIZAR (candidatos probables)

| Componente | Acción | Justificación |
|-----------|--------|---------------|
| `NavBar` / `Header` | Reutilizar + refactorizar | Adaptar colores al sistema de tokens SARFBIO |
| `Section` wrapper | Reutilizar | Abstracción de padding/max-width útil |
| `Button` / `CTA` | Reutilizar con variantes SARFBIO | Componente UI fundamental |
| `Badge` | Reutilizar | Útil para tags de producto |
| `Card` | Reutilizar si es headless | Adaptar estilos |
| `Footer` | Reutilizar base | Re-contenido completo |

### Componentes a ELIMINAR

- Toda página demo (`/app/demo/**`)
- Layouts redundantes no utilizados (`/app/(demo)/layout.tsx`)
- Providers de tema genérico no aplicables a landing single-page
- Componentes de autenticación del template
- Componentes de dashboard o analytics del template

### Componentes a REFACTORIZAR

| Componente | Transformación | Motivo |
|-----------|---------------|--------|
| `HeroSection` template | Reconstruir desde cero | Requiere integración Three.js custom |
| `FeaturesGrid` | Refactorizar a `ProductFeatures` | Re-contenido y re-estilar |
| `PricingSection` | Refactorizar a `BusinessModel` | Diferente estructura de datos |
| `TestimonialsSection` | Refactorizar a `ValidationSection` | Contenido distinto (encuestas campo) |

### Deuda Técnica Detectada (patrones comunes en templates)

**DT-01:** Hardcoding de strings en componentes — resolver via `sarfbio-content.ts`  
**DT-02:** Imports no tree-shaken de icon libraries — auditar y reemplazar por SVG inline o imports named  
**DT-03:** Providers innecesarios en root layout — remover todos los no-utilizados  
**DT-04:** CSS global contaminado con estilos demo — limpiar `globals.css`  
**DT-05:** `any` types en componentes UI — tipar estrictamente antes de reutilizar  

### Server vs Client Component Conversion

**Convertir a Server Component:**
- `FeaturesSection` (si actualmente es client sin necesidad)
- `Footer` (contenido estático)
- `TeamSection` (contenido estático)

**Mantener / Convertir a Client Component:**
- `NavBar` (scroll state, mobile menu)
- Todo componente con `useState`, `useEffect`, event listeners

---

# 3. ESTRUCTURA FINAL DEL PROYECTO

```
sarfbio-landing/
├── app/
│   ├── layout.tsx                    → Root layout, providers mínimos, fonts
│   ├── page.tsx                      → Single landing page (RSC)
│   ├── globals.css                   → CSS custom properties, Tailwind base
│   ├── sitemap.ts                    → Sitemap generator
│   └── robots.ts                     → Robots.txt generator
│
├── components/
│   ├── landing/                      → Secciones de la landing (RSC por defecto)
│   │   ├── HeroSection.tsx
│   │   ├── ProblemSection.tsx
│   │   ├── ProductSection.tsx
│   │   ├── BiofluidSection.tsx
│   │   ├── MetricsSection.tsx
│   │   ├── TechBreakdownSection.tsx
│   │   ├── BusinessModelSection.tsx
│   │   ├── ValidationSection.tsx
│   │   ├── TeamSection.tsx
│   │   ├── CTASection.tsx
│   │   └── index.ts                  → Barrel export
│   │
│   ├── ui/                           → Componentes UI reutilizables
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Section.tsx               → Wrapper padding/max-width
│   │   ├── AnimatedCounter.tsx       → 'use client'
│   │   ├── NavBar.tsx                → 'use client'
│   │   ├── Footer.tsx
│   │   ├── KPICard.tsx
│   │   └── index.ts
│   │
│   └── seo/
│       ├── JsonLd.tsx                → Structured data components
│       └── MetaTags.tsx
│
├── features/                         → Domain-driven feature modules
│   ├── hero/
│   │   ├── HeroScene3D.tsx           → 'use client', Three.js canvas
│   │   ├── HeroParticles.tsx         → Particle system
│   │   └── HeroText.tsx              → Animated text overlay
│   │
│   ├── robot/
│   │   ├── RobotScene3D.tsx          → 'use client'
│   │   ├── RobotModel.tsx            → glTF loader + animation controller
│   │   ├── RobotAnnotations.tsx      → 3D HTML overlays (R3F <Html>)
│   │   └── RobotControls.tsx        → Orbit/auto-rotate controls
│   │
│   ├── crops/
│   │   ├── CropScene3D.tsx           → 'use client'
│   │   ├── CornPlant.tsx
│   │   └── CacaoPlant.tsx
│   │
│   ├── biofluid/
│   │   ├── BiofluidScene3D.tsx       → 'use client'
│   │   ├── FluidParticles.tsx        → Custom shader particles
│   │   └── SprayNozzle.tsx
│   │
│   ├── exploded/
│   │   ├── ExplodedView3D.tsx        → 'use client'
│   │   └── ComponentLabels.tsx
│   │
│   ├── metrics/
│   │   ├── MetricsChart.tsx          → Recharts / ApexCharts
│   │   └── SurveyChart.tsx           → Bar chart encuesta campo
│   │
│   └── contact/
│       ├── ContactForm.tsx           → 'use client', Resend
│       └── contactSchema.ts          → Zod schema
│
├── lib/
│   ├── three/
│   │   ├── loaders.ts                → glTF, KTX2, Draco loader setup
│   │   ├── materials.ts              → Shared PBR materials
│   │   ├── lights.ts                 → Standard lighting presets
│   │   └── postprocessing.ts        → Bloom, DOF config
│   │
│   ├── motion/
│   │   ├── variants.ts               → Framer Motion variant library
│   │   ├── transitions.ts            → Shared transition configs
│   │   └── scroll.ts                 → Scroll utility hooks
│   │
│   ├── resend.ts                     → Resend client singleton
│   └── utils.ts                      → cn(), formatters, helpers
│
├── hooks/
│   ├── useScrollProgress.ts          → Global scroll MotionValue
│   ├── useIntersectionScene.ts       → Suspend/resume Three.js scenes
│   ├── useMediaQuery.ts              → Responsive breakpoint hooks
│   ├── useReducedMotion.ts           → prefers-reduced-motion
│   ├── useGPUTier.ts                 → detect-gpu integration
│   └── useAnimatedCounter.ts         → Number count-up animation
│
├── types/
│   ├── content.ts                    → ALL content interfaces (source of truth)
│   ├── three.ts                      → Three.js / R3F type extensions
│   └── index.ts                      → Barrel export
│
├── content/
│   └── sarfbio-content.ts            → Single source of all content data
│
├── public/
│   ├── models/
│   ├── textures/
│   ├── videos/
│   └── images/
│
├── styles/
│   └── design-tokens.css             → CSS custom properties (colors, spacing, typography)
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json                     → strict: true, paths configurados
└── package.json
```

### Naming Conventions

- **Componentes:** PascalCase, sufijo de tipo (`Section`, `Scene3D`, `Card`, `Modal`)
- **Hooks:** camelCase, prefijo `use`
- **Tipos:** PascalCase, sin prefijo `I` (interfaces), sufijo `Type` solo cuando hay ambigüedad
- **Archivos de contenido:** kebab-case
- **Features:** kebab-case directory, PascalCase componentes internos
- **CSS classes:** Tailwind utilities exclusivamente; clases custom en `design-tokens.css`

---

# 4. FASES DE IMPLEMENTACIÓN

---

## FASE 1 — Arquitectura Base

### Tarea 1.1 — Setup del Proyecto y Design Tokens

#### Objetivo
Establecer el entorno Next.js 16.2 limpio, configurar TypeScript strict, Tailwind 4.x, y definir el sistema de design tokens de SARFBIO. Esta tarea es el cimiento; ninguna otra tarea puede iniciarse sin ella.

#### Archivos Afectados
```
next.config.ts
tailwind.config.ts
tsconfig.json
app/globals.css
styles/design-tokens.css
```

#### Implementación

1. Inicializar proyecto: `npx create-next-app@latest sarfbio-landing --typescript --tailwind --app --turbopack`
2. Configurar `tsconfig.json` con `strict: true` y paths aliases
3. Definir sistema de design tokens como CSS custom properties
4. Configurar Tailwind 4.x para consumir las CSS custom properties

#### Código de Referencia

```css
/* styles/design-tokens.css */
:root {
  /* Brand Colors */
  --color-bio-green: #22C55E;      /* Primary - leaf green */
  --color-bio-green-dark: #16A34A;
  --color-bio-green-light: #86EFAC;
  --color-tech-navy: #0F172A;      /* Deep background */
  --color-tech-navy-mid: #1E293B;
  --color-circuit-gray: #334155;
  --color-soil-amber: #F59E0B;     /* Accent - warm earth */
  --color-mist-white: #F8FAFC;

  /* Typography Scale */
  --font-display: 'Syne', sans-serif;        /* Headings - geometric, tech */
  --font-body: 'DM Sans', sans-serif;        /* Body - clean, readable */
  --font-mono: 'JetBrains Mono', monospace;  /* Technical data */

  --text-hero: clamp(3rem, 6vw, 6rem);
  --text-section: clamp(2rem, 4vw, 3.5rem);
  --text-subsection: clamp(1.25rem, 2vw, 1.75rem);

  /* Spacing */
  --section-padding-y: clamp(5rem, 10vw, 8rem);
  --container-max: 1400px;
  --container-padding: clamp(1.5rem, 5vw, 4rem);

  /* 3D Scene Dimensions */
  --scene-height-desktop: 700px;
  --scene-height-tablet: 500px;
  --scene-height-mobile: 350px;

  /* Animation */
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --duration-fast: 200ms;
  --duration-normal: 400ms;
  --duration-slow: 800ms;
}
```

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.tsx', './components/**/*.tsx', './features/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        'bio-green': 'var(--color-bio-green)',
        'bio-green-dark': 'var(--color-bio-green-dark)',
        'tech-navy': 'var(--color-tech-navy)',
        'tech-navy-mid': 'var(--color-tech-navy-mid)',
        'circuit-gray': 'var(--color-circuit-gray)',
        'soil-amber': 'var(--color-soil-amber)',
        'mist-white': 'var(--color-mist-white)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      fontSize: {
        hero: 'var(--text-hero)',
        section: 'var(--text-section)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(34, 197, 94, 0.6)' },
        }
      }
    }
  }
}
export default config
```

```ts
// tsconfig.json (paths section)
{
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./components/*"],
      "@/features/*": ["./features/*"],
      "@/lib/*": ["./lib/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/types/*": ["./types/*"],
      "@/content/*": ["./content/*"]
    }
  }
}
```

#### Interfaces TypeScript

```ts
// types/content.ts — ÚNICA fuente de verdad para tipos de contenido
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
  annotation3DPosition: [number, number, number] // World space position for R3F <Html>
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
  explodedOffset: [number, number, number] // Used by ExplodedView to position pieces
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
```

#### Dependencias
```bash
npm install next@latest react@latest react-dom@latest typescript@latest
npm install @next/font
# Dev
npm install -D @types/react @types/node tailwindcss @tailwindcss/postcss
```

#### Performance
- CSS custom properties = zero runtime cost
- Tailwind 4 genera CSS mínimo via full tree-shaking
- Fonts via `next/font` = preloading automático, no FOUC

#### Riesgos
- **R1:** Tailwind 4 aún en adopción temprana — verificar compatibilidad con plugins requeridos
- **R2:** `next/font` con fuentes custom (Syne, DM Sans) requiere licencias Google Fonts

#### Criterios de Aceptación
- [ ] `npx tsc --noEmit` pasa sin errores
- [ ] Tailwind genera correctamente las clases de design tokens
- [ ] Fonts se cargan sin FOUC en desarrollo
- [ ] CSS custom properties visibles en DevTools con valores correctos

---

### Tarea 1.2 — Content Layer: `sarfbio-content.ts`

#### Objetivo
Crear la única fuente de verdad de contenido del proyecto. Todo texto, número, URL, y dato mostrado en la landing proviene exclusivamente de este archivo. Ningún string es hardcodeado en componentes.

#### Archivos Afectados
```
content/sarfbio-content.ts
types/content.ts  (ya definido en 1.1)
```

#### Implementación

1. Crear `content/sarfbio-content.ts` implementando `SarfbioContent`
2. Exportar como `export const sarfbioContent: SarfbioContent = { ... }`
3. Agregar función helper `getContent()` para acceso tipado
4. Validar en build que ningún campo es `undefined` o `null`

#### Código de Referencia

```ts
// content/sarfbio-content.ts
import type { SarfbioContent } from '@/types/content'

export const sarfbioContent: SarfbioContent = {
  meta: {
    title: 'SARFBIO — Precisión Quirúrgica y Orgánica',
    description: 'Robot agrícola inteligente para dispensación automatizada de biopreparados. Protege tus cultivos de maíz y cacao con tecnología de precisión.',
    keywords: ['robot agrícola', 'biopreparados', 'agricultura de precisión', 'ESP32', 'automatización agrícola', 'Venezuela', 'Yaracuy'],
    ogImage: '/images/og-image.jpg',
    twitterHandle: '@sarfbio',
  },

  hero: {
    headline: 'Precisión Quirúrgica,\nNaturaleza Orgánica.',
    subheadline: 'El primer robot agrícola venezolano que aplica biopreparados exactamente donde cada planta lo necesita.',
    tagline: 'SARFBIO — Sistema Automatizado de Riego Focalizado de Biopreparados',
    ctaPrimary: { label: 'Conocer el Robot', href: '#producto', variant: 'primary' },
    ctaSecondary: { label: 'Ver Validación de Campo', href: '#validacion', variant: 'secondary' },
    stats: [
      { value: '40', unit: '%', label: 'Cultivos perdidos por plagas anualmente', source: 'FAO' },
      { value: '3', unit: 'h', label: 'Diarias perdidas en aplicación manual', source: 'Encuesta Campo' },
      { value: '45', unit: 'min', label: 'Autonomía por ciclo de batería', source: 'SARFBIO-01' },
    ]
  },

  problem: {
    sectionTitle: 'El Doble Costo de la Aplicación Tradicional',
    sectionSubtitle: '¿Cuántos recursos está dispuesto a sacrificar un agricultor cuando la tecnología puede hacerlo de forma orgánica?',
    problemStatement: 'La aplicación manual exige esfuerzo físico extremo y genera desperdicio crítico. Los biopreparados requieren focalización precisa (tallo, hoja o raíz). El método manual genera cobertura desigual y pérdida económica directa.',
    rhetoricalQuestion: '¿Y si la tecnología pudiera devolver ese tiempo de forma orgánica?',
    globalStats: [
      { value: '40', unit: '%', label: 'De los cultivos mundiales se pierden anualmente por plagas', source: 'FAO' },
      { value: '3', unit: 'Horas', label: 'El tiempo diario que un pequeño agricultor pierde en aplicación manual y extenuante', source: 'Encuesta SARFBIO' },
    ],
    painPoints: [
      { id: 'fatigue', title: 'Fatiga Física Severa', description: 'La mochila pulverizadora es pesada y agota la salud del productor.', score: 3.4, maxScore: 5, icon: 'body' },
      { id: 'coverage', title: 'Cobertura Desigual', description: 'Rociado "al voleo" impreciso. Los biopreparados requieren aplicación focalizada.', score: 3.3, maxScore: 5, icon: 'spray' },
      { id: 'pain', title: 'Dolor Físico Crónico', description: 'Dolor de espalda y brazos por movimientos repetitivos con carga.', score: 3.2, maxScore: 5, icon: 'pain' },
      { id: 'waste', title: 'Desperdicio de Material', description: 'Pérdida económica directa por aplicación imprecisa de insumos costosos.', score: 3.1, maxScore: 5, icon: 'waste' },
    ]
  },

  product: {
    sectionTitle: 'SARFBIO-01: Precisión Quirúrgica y Orgánica',
    tagline: 'Un robot que entiende cada planta.',
    description: 'Vehículo robótico con brazo articulado de precisión, controlado por ESP32 con WiFi integrado. Opera por control remoto y aplica el biopreparado exactamente donde la planta lo necesita: en la raíz o en la hoja.',
    autonomyMinutes: 45,
    components: [
      { id: 'brain', name: 'Cerebro', description: 'Microcontrolador ESP32 con capacidades WiFi integradas.', annotation3DPosition: [0.2, 0.5, 0], icon: 'cpu' },
      { id: 'arm', name: 'Aplicación Inteligente', description: 'Brazo robótico de precisión impulsado por servomotores.', annotation3DPosition: [0.4, 0.8, 0.2], icon: 'arm' },
      { id: 'drive', name: 'Tracción', description: 'Vehículo con ruedas accionado por motores DC para navegación fluida en el terreno.', annotation3DPosition: [-0.3, -0.2, 0], icon: 'wheel' },
      { id: 'spray', name: 'Diferenciador Clave', description: 'Rociado Alto y Bajo. Aplica el biopreparado exactamente donde la planta lo necesita, eliminando el desperdicio.', annotation3DPosition: [0.5, 0.3, 0.3], icon: 'spray' },
    ],
    differentiators: [
      { id: 'precision', title: 'Aplicación Focalizada', description: 'Dos modos: Rociado Alto (hoja) y Rociado Bajo (raíz).', vsTraditional: 'vs. rociado al voleo indiscriminado' },
      { id: 'organic', title: '100% Orgánico', description: 'Optimizado para biopreparados naturales, no agroquímicos.', vsTraditional: 'vs. fumigación química convencional' },
      { id: 'remote', title: 'Control Remoto', description: 'El agricultor opera desde distancia, sin carga física.', vsTraditional: 'vs. mochila pulverizadora de 15kg' },
      { id: 'accessible', title: 'Costo Accesible', description: 'Componentes estándar ESP32, fabricación local posible.', vsTraditional: 'vs. drones agrícolas ($2000+)' },
    ]
  },

  biofluid: {
    sectionTitle: 'Biología en Movimiento',
    description: 'Cada biopreparado es una solución viva. SARFBIO asegura que llegue intacto y preciso a su destino.',
    sprayModes: [
      { id: 'high', label: 'Rociado Alto', targetZone: 'Hoja y tallo superior', description: 'El brazo se eleva para cubrir el follaje completo de la planta.' },
      { id: 'low', label: 'Rociado Bajo', targetZone: 'Raíz y base', description: 'El brazo desciende para aplicación directa en zona radicular.' },
    ],
    bioboxFormula: [
      { name: 'Extracto de Neem', quantity: '500ml', purpose: 'Repelente natural contra gusano cogollero', costUSD: 3.50 },
      { name: 'Extracto de Ajo', quantity: '300ml', purpose: 'Ahuyenta insectos y previene hongos', costUSD: 1.20 },
      { name: 'Extracto de Ají Picante', quantity: '200ml', purpose: 'Irrita y repele plagas sin dañar la planta', costUSD: 0.80 },
      { name: 'Beauveria bassiana', quantity: '50g', purpose: 'Hongo benéfico que ataca específicamente al gusano cogollero', costUSD: 2.50 },
      { name: 'Melaza de Caña', quantity: '100ml', purpose: 'Alimento para microorganismos benéficos', costUSD: 0.60 },
      { name: 'Jabón Potásico', quantity: '30ml', purpose: 'Pegante que mantiene la mezcla en la hoja', costUSD: 0.40 },
    ]
  },

  metrics: {
    sectionTitle: 'Validación de Campo Absoluta',
    kpis: [
      { id: 'producers', value: 12, label: 'Productores locales encuestados', description: 'Con contingencias reales de campo documentadas', color: 'green' },
      { id: 'interest', value: '100', unit: '%', label: 'Interés de adopción (5/5)', description: 'Todos los productores encuestados expresaron interés máximo', color: 'green' },
      { id: 'savings', value: '$50', label: 'USD ahorro por ciclo', description: 'En tiempo, mano de obra e insumos orgánicos', color: 'amber' },
    ],
    surveyResults: [
      { label: 'Fatiga física', score: 3.4, maxScore: 5 },
      { label: 'Cobertura desigual', score: 3.3, maxScore: 5 },
      { label: 'Dolor espalda/brazos', score: 3.2, maxScore: 5 },
      { label: 'Desperdicio producto', score: 3.1, maxScore: 5 },
    ],
    comparisonTable: [
      { dimension: 'Tiempo', manual: 'Manual e improductivo', sarfbio: 'Automatizado (4.5/5 importancia). Libera al agricultor.', highlight: true },
      { dimension: 'Esfuerzo', manual: 'Carga física, fatiga, interrupción', sarfbio: 'Cero carga física. Operación a control remoto.', highlight: true },
      { dimension: 'Economía', manual: 'Costo continuo en tiempo e insumos', sarfbio: 'Ahorro de $50 USD por ciclo en tiempo e insumos orgánicos.', highlight: true },
    ]
  },

  techBreakdown: {
    sectionTitle: 'Anatomía del SARFBIO-01',
    components: [
      { id: 'arm-structure', name: 'Brazo y Estructura', category: 'application', description: 'Sostiene y mueve la boquilla para rociar con precisión', costUSD: 123, explodedOffset: [0, 1.5, 0] },
      { id: 'battery-electronics', name: 'Batería y Electrónica', category: 'brain', description: 'Cerebro del robot + energía para que funcione', costUSD: 99, explodedOffset: [0, -0.5, 0.8] },
      { id: 'vehicle-wheels', name: 'Vehículo con Ruedas', category: 'locomotion', description: 'Permite que el robot se desplace por el cultivo', costUSD: 113, explodedOffset: [0, -1.5, 0] },
      { id: 'pump-tank', name: 'Bomba y Tanque', category: 'application', description: 'Guarda y aplica el biopreparado en las plantas', costUSD: 63, explodedOffset: [0.8, 0, 0] },
      { id: 'remote-control', name: 'Control Remoto', category: 'brain', description: 'Para que el agricultor maneje el robot a distancia', costUSD: 30, explodedOffset: [-0.8, 0.5, 0] },
    ]
  },

  business: {
    sectionTitle: 'Modelo de Negocio Híbrido: Ecosistema Rentable',
    hardwareKits: [
      { id: 'educativo', name: 'Kit SARFBIO Educativo', priceUSD: 350, costUSD: 290, marginPercent: 17, description: 'Para huertos escolares y proyectos educativos. Capital para reinversión.', featured: false },
      { id: 'basico', name: 'Kit SARFBIO Básico', priceUSD: 800, costUSD: 600, marginPercent: 25, description: 'Solución completa para el pequeño productor. Margen de ganancia del 25%.', featured: true },
    ],
    subscriptions: [
      { id: 'biobox-maiz', name: 'BioBox Maíz', priceUSD: 20, coverage: '~0.1 hectárea (1,000 m²)', formula: 'maiz' },
      { id: 'biobox-cacao', name: 'BioBox Cacao', priceUSD: 20, coverage: '~0.1 hectárea (1,000 m²)', formula: 'cacao' },
      { id: 'biobox-educativo', name: 'BioBox Educativo', priceUSD: 20, coverage: 'Cultivos hidropónicos', formula: 'educativo' },
    ],
    valueAddedServices: [
      { id: 'maintenance', name: 'Mantenimiento Preventivo', description: 'Servicio técnico periódico en campo' },
      { id: 'academy', name: 'SARFBIO Academy', description: 'Capacitación en uso de tecnología abierta y biopreparados' },
    ]
  },

  validation: {
    sectionTitle: 'Validación de Campo Absoluta',
    farmName: 'Finca "El Chaparral"',
    producersCount: 12,
    interestPercent: 100,
    fieldTests: 'Pruebas de campo validadas',
    alignment: [
      { sdgNumber: 2, title: 'Hambre Cero', description: 'Protección de cultivos para seguridad alimentaria' },
      { sdgNumber: 3, title: 'Salud y Bienestar', description: 'Eliminación de exposición directa a químicos' },
      { sdgNumber: 12, title: 'Producción Responsable', description: 'Uso eficiente de biopreparados orgánicos' },
    ]
  },

  team: {
    sectionTitle: 'Conoce al Equipo',
    origin: 'La idea surge al ver en la finca de nuestro COO Juan Benítez Moreno, cómo aplicaban productos para el cuidado de los cultivos.',
    purpose: 'Liberar al agricultor de la carga manual, devolviéndole el tiempo para gestionar y crecer.',
    vision: 'Ser el estándar de automatización accesible para la agricultura orgánica en la región en los próximos 5 años.',
    members: [
      { id: 'flavio', name: 'Flavio Luigi Toaiari Moreno', role: 'CTO', title: 'Chief Technology Officer', imageUrl: '/images/team/flavio.jpg' },
      { id: 'marcial', name: 'Marcial Gregorio Valenzuela Rodríguez', role: 'CEO', title: 'Chief Executive Officer', imageUrl: '/images/team/marcial.jpg' },
      { id: 'juan', name: 'Juan Alejandro Benítez Moreno', role: 'COO', title: 'Chief Operating Officer', imageUrl: '/images/team/juan.jpg' },
    ]
  },

  cta: {
    headline: 'De Prototipo a Soberanía Alimentaria',
    subheadline: 'Con tu apoyo, SARFBIO deja de ser un proyecto escolar y se convierte en una herramienta de impacto regional.',
    needs: [
      { type: 'funding', title: 'Financiamiento', description: 'Para la fabricación de 10 unidades piloto y pruebas de campo en diferentes cultivos (maíz y cacao).' },
      { type: 'partnership', title: 'Alianzas Estratégicas', description: 'Conexión con cooperativas agrícolas o agricultores urbanos/periurbanos para el desarrollo de las pruebas.' },
    ],
    form: {
      namePlaceholder: 'Tu nombre o institución',
      emailPlaceholder: 'tu@email.com',
      messagePlaceholder: '¿Cómo quieres colaborar con SARFBIO?',
      submitLabel: 'Enviar Mensaje',
    }
  }
}

export function getContent(): SarfbioContent {
  return sarfbioContent
}
```

#### Criterios de Aceptación
- [ ] `npx tsc --noEmit` valida sin errores con el archivo de contenido
- [ ] Todos los campos de `SarfbioContent` están poblados (sin `undefined`)
- [ ] Función `getContent()` retorna el objeto tipado correctamente

---

## FASE 2 — Infraestructura 3D

### Tarea 2.1 — ADR-001: Decisión de Motor 3D

#### Objetivo
Documentar la decisión arquitectónica formal de seleccionar Three.js + React Three Fiber como motor 3D, con justificación técnica exhaustiva y trade-offs explícitos.

#### ADR-001: Motor de Visualización 3D

**Status:** Accepted  
**Contexto:** La landing requiere escenas 3D interactivas de un robot agrícola, plantas, y fluidos. La selección del motor determina bundle size, API de desarrollo, performance, y capacidad futura.

**Opciones evaluadas:**

| Criterio | Three.js + R3F | Babylon.js | Spline | A-Frame |
|---------|---------------|------------|--------|---------|
| Bundle size (min+gz) | ~165KB (+R3F 13KB) | ~270KB | Runtime externo | ~80KB |
| React integration | Nativa (R3F = React renderer) | Via hooks custom | iFrame/embed | Limitada |
| GLSL custom shaders | Full control | Full control | Sin acceso | Limitado |
| glTF/GLB support | ✅ vía `useGLTF` | ✅ nativo | ✅ nativo | ✅ |
| Post-processing | `@react-three/postprocessing` | Built-in | Sin control | No |
| Community / ecosystem | Mayor (2023-2025) | Sólido | Limitado | Niche |
| Learning curve equipo | Moderada (conocido) | Alta | Baja | Baja |
| Physics (futuro) | `@react-three/rapier` | AmmoJS/Havok | No | No |
| Precio/Licencia | MIT | Apache 2 | Freemium/Proprietary | MIT |

**Decisión:** Three.js + React Three Fiber (@react-three/fiber) + @react-three/drei

**Justificación:**
1. **API React-nativa:** R3F convierte el scene graph de Three.js en un árbol React. Los componentes 3D son componentes React con hooks, context, y suspense nativos.
2. **Bundle óptimo:** 165KB vs. 270KB de Babylon.js es significativo para mobile performance budget.
3. **Ecosystem drei:** `@react-three/drei` provee primitivas reutilizables (`useGLTF`, `OrbitControls`, `Html`, `Environment`, `Sparkles`) que eliminan semanas de boilerplate.
4. **Spline descartado:** Dependencia de runtime externo, sin control sobre shaders custom requeridos para biofluid particles.
5. **Control total sobre shaders:** Las escenas de biopreparados requieren GLSL custom para simulación de fluidos. Solo Three.js/R3F y Babylon.js soportan esto.

**Trade-offs aceptados:**
- Three.js no tiene physics engine built-in (mitigado con `@react-three/rapier` si se requiere)
- Curva de aprendizaje mayor a Spline (mitigado por experiencia previa del equipo)
- Bundle mayor que soluciones CSS-only (justificado por el valor visual aportado)

---

### Tarea 2.2 — Setup de la Infraestructura 3D

#### Objetivo
Configurar los loaders, sistemas de iluminación base, materiales compartidos, y el entorno de rendering que todas las escenas Three.js consumirán.

#### Archivos Afectados
```
lib/three/loaders.ts
lib/three/materials.ts
lib/three/lights.ts
lib/three/postprocessing.ts
hooks/useGPUTier.ts
hooks/useIntersectionScene.ts
```

#### Implementación

1. Instalar dependencias 3D
2. Configurar DRACOLoader y KTX2Loader globalmente (una sola instancia)
3. Crear sistema de materiales PBR compartidos
4. Crear hook `useGPUTier` para adaptive rendering
5. Crear hook `useIntersectionScene` para suspend/resume

#### Código de Referencia

```ts
// lib/three/loaders.ts
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

let dracoLoader: DRACOLoader | null = null
let ktx2Loader: KTX2Loader | null = null

export function getDracoLoader(): DRACOLoader {
  if (!dracoLoader) {
    dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
    dracoLoader.preload()
  }
  return dracoLoader
}

export function getKTX2Loader(renderer: THREE.WebGLRenderer): KTX2Loader {
  if (!ktx2Loader) {
    ktx2Loader = new KTX2Loader()
    ktx2Loader.setTranscoderPath('/basis/')
    ktx2Loader.detectSupport(renderer)
  }
  return ktx2Loader
}

// Configure useGLTF to use Draco globally (call once at app init)
export function configureGlobalLoaders() {
  useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
}
```

```ts
// lib/three/lights.ts
import type { ComponentProps } from 'react'

export interface LightingPreset {
  ambient: { intensity: number; color: string }
  directional: {
    position: [number, number, number]
    intensity: number
    color: string
    castShadow: boolean
  }
  hemisphere?: {
    skyColor: string
    groundColor: string
    intensity: number
  }
  environment?: string // HDRI preset name for @react-three/drei Environment
}

export const LIGHTING_PRESETS = {
  // Para hero scene: ambiente de campo al atardecer
  heroField: {
    ambient: { intensity: 0.4, color: '#ffeedd' },
    directional: {
      position: [5, 8, 5],
      intensity: 1.8,
      color: '#ffcc88',
      castShadow: true,
    },
    hemisphere: { skyColor: '#87CEEB', groundColor: '#4a7a4a', intensity: 0.5 },
    environment: 'sunset',
  },
  // Para robot closeup: estudio técnico limpio
  techStudio: {
    ambient: { intensity: 0.6, color: '#e8f4ff' },
    directional: {
      position: [3, 5, 3],
      intensity: 2.0,
      color: '#ffffff',
      castShadow: false,
    },
    environment: 'city',
  },
  // Para biofluid: dark dramático
  bioDark: {
    ambient: { intensity: 0.2, color: '#001a00' },
    directional: {
      position: [2, 4, 2],
      intensity: 1.5,
      color: '#22c55e',
      castShadow: false,
    },
  },
} as const satisfies Record<string, LightingPreset>
```

```ts
// hooks/useGPUTier.ts
'use client'
import { useState, useEffect } from 'react'

export type GPUTier = 'low' | 'medium' | 'high'

interface GPUConfig {
  tier: GPUTier
  maxParticles: number
  shadowsEnabled: boolean
  postprocessingEnabled: boolean
  maxPixelRatio: number
  frameloop: 'always' | 'demand'
}

export function useGPUTier(): GPUConfig {
  const [tier, setTier] = useState<GPUTier>('medium')

  useEffect(() => {
    // Heuristic detection basada en device memory y hardwareConcurrency
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4
    const cores = navigator.hardwareConcurrency ?? 4
    const isMobile = /Mobi|Android/i.test(navigator.userAgent)

    if (isMobile || memory <= 2 || cores <= 2) {
      setTier('low')
    } else if (memory >= 8 && cores >= 8) {
      setTier('high')
    } else {
      setTier('medium')
    }
  }, [])

  const configs: Record<GPUTier, Omit<GPUConfig, 'tier'>> = {
    low: {
      maxParticles: 50,
      shadowsEnabled: false,
      postprocessingEnabled: false,
      maxPixelRatio: 1,
      frameloop: 'demand',
    },
    medium: {
      maxParticles: 500,
      shadowsEnabled: false,
      postprocessingEnabled: false,
      maxPixelRatio: 1.5,
      frameloop: 'demand',
    },
    high: {
      maxParticles: 2000,
      shadowsEnabled: true,
      postprocessingEnabled: true,
      maxPixelRatio: 2,
      frameloop: 'always',
    },
  }

  return { tier, ...configs[tier] }
}
```

```ts
// hooks/useIntersectionScene.ts
'use client'
import { useRef, useState, useEffect } from 'react'

/**
 * Suspende el frame loop de Three.js cuando la escena sale del viewport.
 * Crítico para no desperdiciar GPU en escenas no visibles.
 */
export function useIntersectionScene(threshold = 0.1) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting
        setIsVisible(visible)
        if (visible) setHasBeenVisible(true)
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return {
    containerRef,
    isVisible,
    hasBeenVisible, // Para lazy-mount: solo montar la escena después de la primera intersección
    frameloop: isVisible ? ('always' as const) : ('never' as const),
  }
}
```

#### Dependencias
```bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing
npm install -D @types/three
```

#### Performance
- Draco decoder via CDN de Google = zero bundle size adicional
- Un solo `DRACOLoader` instanciado globalmente — evita múltiples decoders en memoria
- `frameloop="demand"` por defecto = GPU en reposo cuando no hay cambios
- `useIntersectionScene` = scenes fuera de viewport no consumen GPU

#### Riesgos
- **R1:** `KTX2Loader` requiere archivos Basis Transcoder en `/public/basis/`. Si no están presentes, las texturas KTX2 fallan silenciosamente. Fallback: JPEG.
- **R2:** `useGPUTier` es una heurística. Devices con GPU potente pero poca RAM reportarán `low`. Considerar añadir canvas benchmark en iteración futura.

#### Criterios de Aceptación
- [ ] `configureGlobalLoaders()` llamado exactamente una vez en el root layout
- [ ] Hook `useIntersectionScene` pausa `frameloop` cuando la escena sale del viewport (verificable con DevTools GPU profiler)
- [ ] `useGPUTier` retorna valores correctos en Desktop High-End, Mobile Mid-Range

---

### Tarea 2.3 — Canvas Base y SceneWrapper Compartido

#### Objetivo
Crear el componente `SceneWrapper` que encapsula el `<Canvas>` de R3F con configuración consistente, error boundary, loading state, y responsive sizing. Todas las escenas lo usan como base.

#### Archivos Afectados
```
components/ui/SceneWrapper.tsx    → 'use client'
components/ui/SceneFallback.tsx   → Static fallback for no-WebGL
```

#### Código de Referencia

```tsx
// components/ui/SceneWrapper.tsx
'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useRef, type ReactNode } from 'react'
import { useIntersectionScene } from '@/hooks/useIntersectionScene'
import { useGPUTier } from '@/hooks/useGPUTier'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface SceneWrapperProps {
  children: ReactNode
  className?: string
  height?: string
  fallback?: ReactNode
  loadingFallback?: ReactNode
  cameraFov?: number
  cameraPosition?: [number, number, number]
  shadows?: boolean
}

export function SceneWrapper({
  children,
  className = '',
  height = 'var(--scene-height-desktop)',
  fallback,
  loadingFallback,
  cameraFov = 45,
  cameraPosition = [0, 0, 5],
  shadows,
}: SceneWrapperProps) {
  const { containerRef, hasBeenVisible, frameloop } = useIntersectionScene(0.05)
  const gpu = useGPUTier()
  const prefersReducedMotion = useReducedMotion()

  // En reduced motion o GPU low sin WebGL: mostrar fallback estático
  if (prefersReducedMotion && fallback) {
    return <>{fallback}</>
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ height }}
      aria-hidden="true" // Contenido decorativo; el contenido semántico está en el HTML circundante
    >
      {hasBeenVisible && (
        <Suspense fallback={loadingFallback ?? <SceneLoader />}>
          <Canvas
            frameloop={prefersReducedMotion ? 'demand' : frameloop}
            camera={{ fov: cameraFov, position: cameraPosition, near: 0.1, far: 100 }}
            shadows={shadows ?? gpu.shadowsEnabled}
            dpr={[1, gpu.maxPixelRatio]}
            gl={{
              antialias: gpu.tier !== 'low',
              alpha: true,
              powerPreference: 'high-performance',
            }}
            style={{ background: 'transparent' }}
          >
            {children}
          </Canvas>
        </Suspense>
      )}

      {!hasBeenVisible && (loadingFallback ?? <SceneLoader />)}
    </div>
  )
}

function SceneLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-tech-navy/20 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-bio-green border-t-transparent animate-spin" />
        <span className="text-bio-green/70 text-sm font-mono text-xs tracking-widest uppercase">
          Inicializando escena
        </span>
      </div>
    </div>
  )
}
```

#### Criterios de Aceptación
- [ ] El Canvas no se monta hasta que el contenedor entra en viewport
- [ ] `aria-hidden="true"` presente en todos los wrappers de canvas
- [ ] Loading state visible durante carga de assets glTF
- [ ] En `prefers-reduced-motion: reduce`, se muestra el fallback estático

---

## FASE 3 — Sistema de Componentes

### Tarea 3.1 — Componentes UI Base

#### Objetivo
Construir o auditar/adaptar los componentes UI fundamentales con el sistema de tokens SARFBIO. Estos componentes son los building blocks de todas las secciones.

#### Archivos Afectados
```
components/ui/Button.tsx
components/ui/Badge.tsx
components/ui/Card.tsx
components/ui/Section.tsx
components/ui/KPICard.tsx
components/ui/AnimatedCounter.tsx
```

#### Código de Referencia

```tsx
// components/ui/Section.tsx
import type { ReactNode } from 'react'

interface SectionProps {
  id?: string
  className?: string
  children: ReactNode
  variant?: 'dark' | 'darker' | 'accent' | 'light'
  fullBleed?: boolean
  as?: 'section' | 'div' | 'article'
}

export function Section({
  id,
  className = '',
  children,
  variant = 'dark',
  fullBleed = false,
  as: Tag = 'section',
}: SectionProps) {
  const bgMap = {
    dark: 'bg-tech-navy',
    darker: 'bg-[#080e1a]',
    accent: 'bg-tech-navy-mid',
    light: 'bg-mist-white',
  }

  return (
    <Tag
      id={id}
      className={`relative ${bgMap[variant]} py-[var(--section-padding-y)] ${className}`}
    >
      <div
        className={
          fullBleed
            ? 'w-full'
            : 'max-w-[var(--container-max)] mx-auto px-[var(--container-padding)]'
        }
      >
        {children}
      </div>
    </Tag>
  )
}
```

```tsx
// components/ui/KPICard.tsx
import { AnimatedCounter } from './AnimatedCounter'
import type { KPIMetric } from '@/types/content'

interface KPICardProps {
  metric: KPIMetric
  animate?: boolean
}

export function KPICard({ metric, animate = true }: KPICardProps) {
  const colorMap = {
    green: 'text-bio-green border-bio-green/30 bg-bio-green/5',
    amber: 'text-soil-amber border-soil-amber/30 bg-soil-amber/5',
    white: 'text-mist-white border-mist-white/20 bg-mist-white/5',
  }

  return (
    <div
      className={`
        rounded-2xl border p-6
        ${colorMap[metric.color]}
        backdrop-blur-sm
        transition-transform duration-300 hover:scale-[1.02]
        animate-pulse-glow
      `}
    >
      <div className="text-5xl font-display font-black tracking-tighter leading-none mb-2">
        {animate ? (
          <AnimatedCounter
            value={typeof metric.value === 'number' ? metric.value : parseFloat(metric.value)}
            prefix={typeof metric.value === 'string' && metric.value.startsWith('$') ? '$' : ''}
            suffix={metric.unit ?? ''}
          />
        ) : (
          <span>{metric.value}{metric.unit}</span>
        )}
      </div>
      <p className="text-sm font-semibold text-white/90 mb-1">{metric.label}</p>
      <p className="text-xs text-white/50">{metric.description}</p>
    </div>
  )
}
```

```tsx
// components/ui/AnimatedCounter.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'

interface AnimatedCounterProps {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
}

export function AnimatedCounter({
  value,
  duration = 2000,
  prefix = '',
  suffix = '',
  decimals = 0,
}: AnimatedCounterProps) {
  const [current, setCurrent] = useState(0)
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!inView) return

    const startTime = performance.now()
    const startValue = 0

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutCubic(progress)
      const currentValue = startValue + (value - startValue) * eased

      setCurrent(currentValue)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [inView, value, duration])

  return (
    <span ref={ref}>
      {prefix}{current.toFixed(decimals)}{suffix}
    </span>
  )
}
```

#### Interfaces TypeScript

```ts
// Todas las interfaces de componentes UI utilizan los tipos ya definidos en types/content.ts
// Los props adicionales se definen localmente en cada componente
```

#### Dependencias
```bash
npm install react-intersection-observer framer-motion
```

#### Criterios de Aceptación
- [ ] `AnimatedCounter` cuenta desde 0 hasta el valor target al entrar en viewport
- [ ] `KPICard` muestra los 3 variantes de color correctamente
- [ ] `Section` genera el padding correcto en todos los breakpoints

---

## FASE 4 — Escenas Interactivas 3D

### Tarea 4.1 — Hero Scene: Robot Agrícola Animado

#### Objetivo
Construir la escena principal del Hero. El robot SARFBIO-01 en un campo de maíz estilizado, con animación de float, rotación suave, y partículas ambientales. Esta escena define el tono visual de toda la landing.

#### Archivos Afectados
```
features/hero/HeroScene3D.tsx
features/hero/HeroParticles.tsx
features/crops/CornPlant.tsx
```

#### Implementación

1. Crear `HeroScene3D.tsx` con `SceneWrapper` base
2. Implementar carga lazy del modelo `sarfbio-robot.glb` con `useGLTF`
3. Agregar `Environment` preset "sunset" para iluminación realista
4. Implementar `FloatingRobot` component con animación CSS-in-Three
5. Agregar partículas ambientales (polvo de campo, bioluminiscencia)
6. Sistema de scroll-driven: el robot rota ligeramente con el scroll

#### Código de Referencia

```tsx
// features/hero/HeroScene3D.tsx
'use client'

import { Suspense, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Environment, Sparkles, Float } from '@react-three/drei'
import { SceneWrapper } from '@/components/ui/SceneWrapper'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { useGPUTier } from '@/hooks/useGPUTier'
import type * as THREE from 'three'

// Pre-load en paralelo con la página
useGLTF.preload('/models/sarfbio-robot.glb')

function RobotModel() {
  const { scene, animations } = useGLTF('/models/sarfbio-robot.glb')
  const meshRef = useRef<THREE.Group>(null)
  const { scrollYProgress } = useScrollProgress()

  // Animación del brazo robótico en idle: oscilación suave
  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()

    // Rotación Y leve con scroll
    meshRef.current.rotation.y = scrollYProgress.get() * 0.5 + Math.sin(t * 0.3) * 0.05

    // Leve inclinación dramática
    meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.02
  })

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.2}
      floatIntensity={0.8}
    >
      <primitive
        ref={meshRef}
        object={scene}
        scale={[1.2, 1.2, 1.2]}
        position={[0, -0.5, 0]}
      />
    </Float>
  )
}

function AmbientParticles({ count }: { count: number }) {
  return (
    <Sparkles
      count={count}
      scale={6}
      size={1.5}
      speed={0.3}
      color="#22c55e"
      opacity={0.4}
    />
  )
}

// Fallback: imagen estática del robot con CSS animation
function HeroFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <img
        src="/images/robot-hero-static.png"
        alt="Robot SARFBIO-01"
        className="h-full object-contain animate-float opacity-90"
      />
    </div>
  )
}

export function HeroScene3D() {
  const gpu = useGPUTier()

  return (
    <SceneWrapper
      height="var(--scene-height-desktop)"
      cameraPosition={[0, 0.5, 4]}
      cameraFov={40}
      fallback={<HeroFallback />}
    >
      <Suspense fallback={null}>
        <RobotModel />
        {gpu.tier !== 'low' && <AmbientParticles count={gpu.maxParticles / 4} />}
      </Suspense>

      <Environment preset="sunset" background={false} />

      {/* Rim light bio-green para el hero */}
      <pointLight position={[-3, 2, -3]} intensity={2} color="#22c55e" />
      <ambientLight intensity={0.4} color="#ffeedd" />
      <directionalLight position={[5, 8, 5]} intensity={1.8} color="#ffcc88" />
    </SceneWrapper>
  )
}
```

#### Interfaces TypeScript

```ts
// No requiere interfaces adicionales; usa tipos de Three.js y R3F
// Los tipos de los modelos glTF se generan con: npx gltfjsx /public/models/sarfbio-robot.glb
```

#### Performance
- `useGLTF.preload()` inicia la descarga del modelo mientras el HTML se parsea
- `Float` de drei usa un único `useFrame` optimizado
- Partículas via `Sparkles` = instanced mesh, no N draw calls
- `frameloop="demand"` cuando la escena sale del viewport (via `SceneWrapper`)

#### Riesgos
- **R1:** Si el modelo glTF no tiene animaciones, la escena cae al float CSS. Verificar con `animations.length > 0`.
- **R2:** En iOS Safari, WebGL context puede ser limitado a 4 simultáneos. `SceneWrapper` garantiza que solo las escenas visibles estén activas.

#### Criterios de Aceptación
- [ ] Robot se carga y muestra en < 3s en conexión 4G (modelo < 800KB)
- [ ] Animación de float visible y suave (60fps en Desktop Mid-Range)
- [ ] Fallback estático funciona cuando el canvas no se monta (mobile < 640px)
- [ ] Rotación responde al scroll de la página

---

### Tarea 4.2 — Biofluid Dispensing Scene: Partículas de Fluido

#### Objetivo
Visualizar el proceso de dispensación de biopreparados con un sistema de partículas custom. Flujo verde bioluminiscente desde la boquilla hasta la planta. Dos modos: Rociado Alto y Rociado Bajo.

#### Archivos Afectados
```
features/biofluid/BiofluidScene3D.tsx
features/biofluid/FluidParticles.tsx
features/biofluid/SprayNozzle.tsx
```

#### Código de Referencia

```tsx
// features/biofluid/FluidParticles.tsx
'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface FluidParticlesProps {
  mode: 'high' | 'low'
  count: number
  active: boolean
}

// Custom shader para partículas de biopreparado
const PARTICLE_VERTEX_SHADER = `
  attribute float aSize;
  attribute float aAlpha;
  attribute vec3 aVelocity;
  attribute float aLife;

  uniform float uTime;
  uniform float uDeltaTime;

  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vAlpha = aAlpha * (1.0 - aLife);

    // Bio-green con variación sutil
    vColor = mix(
      vec3(0.133, 0.773, 0.369),  // bio-green #22c55e
      vec3(0.529, 0.937, 0.149),  // lime bright
      aLife
    );

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
  }
`

const PARTICLE_FRAGMENT_SHADER = `
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    // Partícula circular con glow
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv);
    if (dist > 0.5) discard;

    float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
  }
`

export function FluidParticles({ mode, count, active }: FluidParticlesProps) {
  const meshRef = useRef<THREE.Points>(null)
  const timeRef = useRef(0)

  const { positions, velocities, sizes, alphas, lives } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const alphas = new Float32Array(count)
    const lives = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Emitter position (boquilla del robot)
      positions[i * 3] = (Math.random() - 0.5) * 0.1
      positions[i * 3 + 1] = mode === 'high' ? 0.8 : 0.2
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.1

      // Velocidad: high = dispersión hacia arriba+adelante; low = hacia abajo
      const spread = 0.02
      velocities[i * 3] = (Math.random() - 0.5) * spread
      velocities[i * 3 + 1] = mode === 'high' ? Math.random() * 0.01 : -Math.random() * 0.015
      velocities[i * 3 + 2] = Math.random() * 0.02

      sizes[i] = Math.random() * 3 + 1
      alphas[i] = Math.random()
      lives[i] = Math.random() // vida inicial aleatoria para evitar burst inicial
    }

    return { positions, velocities, sizes, alphas, lives }
  }, [count, mode])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aVelocity', new THREE.BufferAttribute(velocities, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1))
    geo.setAttribute('aLife', new THREE.BufferAttribute(lives, 1))
    return geo
  }, [positions, velocities, sizes, alphas, lives])

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: PARTICLE_VERTEX_SHADER,
      fragmentShader: PARTICLE_FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  }, [])

  useFrame((_, delta) => {
    if (!meshRef.current || !active) return

    timeRef.current += delta
    material.uniforms.uTime.value = timeRef.current

    const posArray = geometry.attributes.position.array as Float32Array
    const velArray = geometry.attributes.aVelocity.array as Float32Array
    const lifeArray = geometry.attributes.aLife.array as Float32Array

    for (let i = 0; i < count; i++) {
      lifeArray[i] += delta * 0.8 // velocidad de envejecimiento

      if (lifeArray[i] >= 1) {
        // Reset al emitter
        posArray[i * 3] = (Math.random() - 0.5) * 0.1
        posArray[i * 3 + 1] = mode === 'high' ? 0.8 : 0.2
        posArray[i * 3 + 2] = (Math.random() - 0.5) * 0.1
        lifeArray[i] = 0
      } else {
        posArray[i * 3] += velArray[i * 3]
        posArray[i * 3 + 1] += velArray[i * 3 + 1]
        posArray[i * 3 + 2] += velArray[i * 3 + 2]
      }
    }

    geometry.attributes.position.needsUpdate = true
    geometry.attributes.aLife.needsUpdate = true
  })

  return <points ref={meshRef} geometry={geometry} material={material} />
}
```

#### Criterios de Aceptación
- [ ] Partículas fluyen visiblemente desde la boquilla hasta la planta
- [ ] Cambio entre modo `high` y `low` cambia la dirección del flujo en < 200ms
- [ ] En GPU `low`, el sistema de partículas cae a imagen estática
- [ ] Blending aditivo genera el efecto bioluminiscente verde

---

### Tarea 4.3 — Technical Breakdown: Exploded View

#### Objetivo
Escena interactiva que desensambla visualmente el SARFBIO-01 en sus componentes, con anotaciones HTML superpuestas y animación de explosión controlada por scroll.

#### Archivos Afectados
```
features/exploded/ExplodedView3D.tsx
features/exploded/ComponentLabels.tsx
```

#### Código de Referencia

```tsx
// features/exploded/ExplodedView3D.tsx
'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Html, Float } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import { SceneWrapper } from '@/components/ui/SceneWrapper'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { useTransform } from 'framer-motion'
import type { TechBreakdownContent } from '@/types/content'

interface ExplodedView3DProps {
  content: TechBreakdownContent
}

export function ExplodedView3D({ content }: ExplodedView3DProps) {
  const { scrollYProgress } = useScrollProgress()

  // El scroll de esta sección (normalizado 0-1) controla el explode factor
  // Se mapea desde el rango de la sección
  const explodeFactor = useTransform(scrollYProgress, [0.6, 0.8], [0, 1])

  return (
    <SceneWrapper
      height="var(--scene-height-desktop)"
      cameraPosition={[0, 1, 6]}
      cameraFov={50}
    >
      {content.components.map((component) => (
        <ExplodedPart
          key={component.id}
          component={component}
          explodeFactor={explodeFactor}
        />
      ))}

      <ambientLight intensity={0.6} color="#e8f4ff" />
      <directionalLight position={[3, 5, 3]} intensity={2.0} color="#ffffff" />
    </SceneWrapper>
  )
}
```

#### Criterios de Aceptación
- [ ] El explode se activa suavemente al hacer scroll en la sección
- [ ] Anotaciones HTML (`<Html>` de drei) se ocultan cuando la cámara está muy lejos
- [ ] Componente colapsa de vuelta al hacer scroll hacia arriba

---

## FASE 5 — Storytelling de Landing

### Tarea 5.1 — HeroSection: Above the Fold

#### Objetivo
Construir la sección Hero completa. Es el elemento de mayor impacto. Debe comunicar el producto en < 3 segundos de primer vistazo.

#### Archivos Afectados
```
components/landing/HeroSection.tsx
features/hero/HeroScene3D.tsx     (ya construido en Fase 4)
features/hero/HeroText.tsx
```

#### Implementación

1. Layout: 60% texto / 40% escena 3D en desktop; stack vertical en mobile
2. Texto principal con animación de entrada staggered
3. Stats bar con `AnimatedCounter`
4. CTAs con hover effects
5. Scroll indicator animado
6. Background: campo estilizado con gradiente radial verde oscuro

#### Código de Referencia

```tsx
// components/landing/HeroSection.tsx
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import type { HeroContent } from '@/types/content'

// Lazy load: no bloquea el HTML crítico
const HeroScene3D = dynamic(
  () => import('@/features/hero/HeroScene3D').then(m => m.HeroScene3D),
  { ssr: false, loading: () => <HeroScenePlaceholder /> }
)

interface HeroSectionProps {
  content: HeroContent
}

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <Section
      id="inicio"
      variant="darker"
      fullBleed
      className="min-h-screen flex items-center relative overflow-hidden"
      as="section"
    >
      {/* Background atmospheric gradients */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-bio-green/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-soil-amber/5 rounded-full blur-[100px]" />
        {/* Circuit pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-[var(--container-max)] mx-auto px-[var(--container-padding)] w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">

          {/* Left: Content */}
          <div className="relative z-10 py-20 lg:py-0">
            {/* Tag line */}
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-bio-green/30 bg-bio-green/10">
              <span className="w-2 h-2 rounded-full bg-bio-green animate-pulse" />
              <span className="text-bio-green text-xs font-mono uppercase tracking-widest">
                {content.tagline}
              </span>
            </div>

            {/* Main headline */}
            <h1 className="font-display font-black text-hero text-white leading-[0.9] tracking-tight mb-6">
              {content.headline.split('\n').map((line, i) => (
                <span key={i} className="block">
                  {i === 1 ? (
                    <span className="text-bio-green">{line}</span>
                  ) : line}
                </span>
              ))}
            </h1>

            {/* Subheadline */}
            <p className="text-white/60 text-lg md:text-xl max-w-[500px] mb-10 leading-relaxed font-body">
              {content.subheadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-16">
              <Button variant="primary" href={content.ctaPrimary.href} size="lg">
                {content.ctaPrimary.label}
              </Button>
              <Button variant="secondary" href={content.ctaSecondary.href} size="lg">
                {content.ctaSecondary.label}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
              {content.stats.map((stat, i) => (
                <div key={i}>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display font-black text-3xl text-bio-green">
                      <AnimatedCounter value={parseFloat(stat.value)} />
                    </span>
                    <span className="text-bio-green font-bold text-xl">{stat.unit}</span>
                  </div>
                  <p className="text-white/50 text-xs mt-1 leading-tight">{stat.label}</p>
                  {stat.source && (
                    <p className="text-bio-green/40 text-xs font-mono">{stat.source}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: 3D Scene */}
          <div className="relative h-[500px] lg:h-[700px]">
            <Suspense fallback={<HeroScenePlaceholder />}>
              <HeroScene3D />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-white/30 text-xs font-mono uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-bio-green/50 to-transparent" />
      </div>
    </Section>
  )
}

function HeroScenePlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-tech-navy/50 rounded-2xl">
      <div className="w-8 h-8 rounded-full border-2 border-bio-green/40 border-t-bio-green animate-spin" />
    </div>
  )
}
```

#### Criterios de Aceptación
- [ ] H1 visible y correcto en < 800ms de navegación
- [ ] `AnimatedCounter` dispara al entrar en viewport, no al mount
- [ ] Layout grid responsive: 2 columnas en lg, 1 columna en mobile
- [ ] Background gradients no causan CLS (position: absolute, no afectan layout)
- [ ] CTAs cumplen contraste WCAG AA (4.5:1 mínimo)

---

### Tarea 5.2 — ProblemSection: El Dolor del Campo

#### Objetivo
Sección de alta densidad emocional. Comunica el problema con impacto visual usando los datos reales de la encuesta de campo. Pain points con animación de reveal staggered.

#### Archivos Afectados
```
components/landing/ProblemSection.tsx
features/metrics/SurveyChart.tsx
```

#### Código de Referencia

```tsx
// components/landing/ProblemSection.tsx
import { Section } from '@/components/ui/Section'
import { SurveyChart } from '@/features/metrics/SurveyChart'
import type { ProblemContent } from '@/types/content'

interface ProblemSectionProps {
  content: ProblemContent
}

export function ProblemSection({ content }: ProblemSectionProps) {
  return (
    <Section id="problema" variant="dark">
      {/* Global stats headline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {content.globalStats.map((stat, i) => (
          <div
            key={i}
            className={`
              p-8 rounded-3xl border
              ${i === 0 ? 'border-bio-green/30 bg-bio-green/5' : 'border-soil-amber/30 bg-soil-amber/5'}
            `}
          >
            <div className="flex items-baseline gap-2 mb-2">
              <span
                className={`font-display font-black text-7xl tracking-tighter ${i === 0 ? 'text-bio-green' : 'text-soil-amber'}`}
              >
                {stat.value}
              </span>
              <span className={`font-display font-bold text-4xl ${i === 0 ? 'text-bio-green' : 'text-soil-amber'}`}>
                {stat.unit}
              </span>
            </div>
            <p className="text-white/70 text-lg font-body leading-snug max-w-[300px]">
              {stat.label}
            </p>
            {stat.source && (
              <p className="text-white/30 text-xs font-mono mt-3">{stat.source}</p>
            )}
          </div>
        ))}
      </div>

      {/* Rhetorical question */}
      <div className="text-center mb-20 max-w-3xl mx-auto">
        <p className="text-2xl md:text-3xl font-display font-bold text-white/90 leading-tight">
          {content.rhetoricalQuestion}
        </p>
      </div>

      {/* Two column: pain points + chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="font-display font-black text-section text-white mb-4">
            {content.sectionTitle}
          </h2>
          <p className="text-white/60 mb-10 leading-relaxed font-body">
            {content.problemStatement}
          </p>

          <div className="space-y-4">
            {content.painPoints.map((point) => (
              <div key={point.id} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white text-sm">{point.title}</span>
                    <span className="text-soil-amber font-mono text-sm font-bold">
                      {point.score}/{point.maxScore}
                    </span>
                  </div>
                  <p className="text-white/50 text-xs mb-2">{point.description}</p>
                  {/* Progress bar */}
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-soil-amber rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${(point.score / point.maxScore) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SurveyChart data={content.painPoints} />
        </div>
      </div>
    </Section>
  )
}
```

#### Criterios de Aceptación
- [ ] Datos del `content.painPoints` se renderizan sin hardcoding
- [ ] Progress bars animan al entrar en viewport (IntersectionObserver)
- [ ] `SurveyChart` renderiza el chart de encuesta con Recharts

---

### Tarea 5.3 — Secciones Restantes (Esquema de Implementación)

Las siguientes secciones siguen el mismo patrón establecido. Se provee el esquema de implementación:

#### `ProductSection`
- Layout: Escena 3D del robot interactivo (izquierda) + features grid (derecha)
- Usa `RobotScene3D` con anotaciones 3D de `HardwareComponent[]`
- Tabla de diferenciadores SARFBIO vs. Tradicional
- Spec técnica: autonomía (45 min), modos de rociado

#### `BiofluidSection`
- Dark background dramático, gradiente verde bioluminiscente
- Escena de partículas `BiofluidScene3D` a full-width
- Toggle interactivo "Rociado Alto / Rociado Bajo" que cambia el modo de partículas
- Fórmula BioBox en cards expandibles

#### `MetricsSection`
- KPI cards con `AnimatedCounter` (12 productores, 100% interés, $50 ahorro)
- Tabla de comparación Manual vs. SARFBIO con hover animations
- Integración con chart de Recharts para survey results

#### `TechBreakdownSection`
- `ExplodedView3D` con scroll-driven animation
- Bill of materials en tabla con costos
- Pricing de Kit Educativo ($350) y Kit Básico ($800)

#### `BusinessModelSection`
- Cards de Kits de Hardware con precios destacados
- Suscripciones BioBox ($20/unidad)
- Modelo flywheel: hardware genera demanda de consumibles

#### `ValidationSection`
- KPIs de validación de campo: 12 productores, 100%, badge de campo
- Alineación ODS 2, 3, 12 con iconos
- Nombre de finca validadora

#### `TeamSection`
- Fotos del equipo en cards con efecto hover
- Origen de la idea (narrativa)
- Propósito y Visión

#### `CTASection`
- Headline de cierre impactante
- Dos cards: Financiamiento + Alianzas Estratégicas
- Formulario de contacto con Resend

---

## FASE 6 — Motion System

### Tarea 6.1 — Variant Library y Scroll Animations

#### Objetivo
Construir la biblioteca completa de variantes de animación para Framer Motion. Todas las animaciones de la landing se definen aquí, no en los componentes individuales.

#### Archivos Afectados
```
lib/motion/variants.ts
lib/motion/transitions.ts
lib/motion/scroll.ts
hooks/useScrollProgress.ts
```

#### Código de Referencia

```ts
// lib/motion/variants.ts
import type { Variants } from 'framer-motion'

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  }
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  }
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 25 }
  }
}

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
  }
}

// Para KPI cards con efecto "slam"
export const statReveal: Variants = {
  hidden: { opacity: 0, scale: 0.5, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 500, damping: 30 }
  }
}
```

```ts
// lib/motion/scroll.ts
import { useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useRef } from 'react'

/**
 * Hook para animaciones parallax basadas en scroll de una sección específica.
 * Más preciso que el scroll global para elementos dentro de secciones.
 */
export function useSectionParallax(outputRange: number[]) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], outputRange)

  return { ref, y, scrollYProgress }
}
```

```tsx
// Ejemplo de uso en componente (patrón estandarizado)
// components/landing/ProblemSection.tsx (parcial)
'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { staggerContainer, fadeInUp } from '@/lib/motion/variants'

function AnimatedPainPoints({ painPoints }: { painPoints: PainPoint[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="space-y-4"
    >
      {painPoints.map((point) => (
        <motion.div key={point.id} variants={fadeInUp}>
          {/* ... */}
        </motion.div>
      ))}
    </motion.div>
  )
}
```

#### Reglas de Uso de Motion (GPU Safety)

| Situación | Tecnología | Justificación |
|-----------|-----------|---------------|
| Hover microinteracciones | CSS `transform` + `transition` | Compositor thread, zero re-render |
| Scroll-driven text reveals | `framer-motion` `useInView` | GPU compositor, no layout recalc |
| Page load stagger | `framer-motion` `variants` | Orquestación declarativa React |
| Animaciones 3D de objetos | Three.js `useFrame` | Ya en contexto WebGL |
| Fluidos / partículas | GLSL Shader | Cómputo en GPU shader units |
| **NUNCA** | `animate: { top, left, width, height }` | Fuerza layout recalc → jank |

#### Criterios de Aceptación
- [ ] Todas las animaciones usan CSS transform properties exclusivamente (no top/left/width/height)
- [ ] `prefers-reduced-motion: reduce` desactiva todas las animaciones de Framer Motion (usando `useReducedMotion` hook)
- [ ] Stagger de entrada visible en secciones con múltiples cards

---

## FASE 7 — Optimización Avanzada

### Tarea 7.1 — Bundle Analysis y Code Splitting

#### Objetivo
Verificar que el bundle inicial cumple el performance budget. Identificar y eliminar dependencias pesadas del critical path.

#### Implementación

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    turbo: {},
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 768, 1024, 1280, 1536],
  },
  // Analizar bundle en CI
  webpack: (config, { isServer }) => {
    if (process.env.ANALYZE === 'true' && !isServer) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: '../bundle-report.html',
        })
      )
    }
    return config
  },
}

export default nextConfig
```

```bash
# Análisis de bundle
ANALYZE=true npm run build
```

#### Estrategias de Optimización

**Three.js Tree-Shaking:**
```ts
// ❌ Import total (550KB+)
import * as THREE from 'three'

// ✅ Import selectivo
import { BufferGeometry, ShaderMaterial, Points } from 'three'
```

**Dynamic Imports para Escenas:**
```ts
// Cada escena es un dynamic import independiente
const HeroScene3D = dynamic(() => import('@/features/hero/HeroScene3D').then(m => m.HeroScene3D), {
  ssr: false,
})
const BiofluidScene3D = dynamic(() => import('@/features/biofluid/BiofluidScene3D').then(m => m.BiofluidScene3D), {
  ssr: false,
})
// etc.
```

**Recharts / ApexCharts — solo importar lo necesario:**
```ts
// ✅ Recharts selective import
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'
```

#### Criterios de Aceptación
- [ ] Bundle inicial (sin 3D) < 120KB gzipped
- [ ] Three.js solo se carga cuando la primera escena entra en viewport
- [ ] `npx next build` sin warnings de large page size

---

### Tarea 7.2 — Image Optimization y Asset Pipeline

#### Objetivo
Optimizar todos los assets estáticos para performance máximo: imágenes, modelos 3D, y texturas.

#### Pipeline de Modelos 3D

```bash
# 1. Convertir modelos a glTF con Draco compression
npx gltf-pipeline -i robot.glb -o sarfbio-robot.glb --draco.compressionLevel 7

# 2. Generar tipos TypeScript del modelo
npx gltfjsx /public/models/sarfbio-robot.glb -t -s

# 3. Verificar tamaño target
ls -lh /public/models/sarfbio-robot.glb
# Target: < 800KB
```

**Polygon Budgets:**
| Modelo | Polígonos Max | LOD |
|--------|--------------|-----|
| `sarfbio-robot.glb` | 15,000 tris | 1 LOD: 5,000 para mobile |
| `corn-plant.glb` | 5,000 tris | N/A |
| `cacao-plant.glb` | 5,000 tris | N/A |
| `biofluid-emitter.glb` | 500 tris | N/A |

**Texture Baking Strategy:**
- Un solo texture atlas de 2048x2048 para el robot (diffuse + normal + roughness en R/G/B channels)
- KTX2/Basis Universal para GPU-native decompression
- Sin texturas mayores a 1024x1024 en mobile (via LOD selection)

#### Criterios de Aceptación
- [ ] Todos los modelos glTF con Draco compression
- [ ] Total de assets 3D por escena < 2MB (post-compresión)
- [ ] Imágenes de team en WebP < 50KB cada una

---

## FASE 8 — Accesibilidad + SEO

### Tarea 8.1 — Metadata Architecture y Structured Data

#### Archivos Afectados
```
app/layout.tsx
app/page.tsx
components/seo/JsonLd.tsx
```

#### Código de Referencia

```ts
// app/page.tsx
import type { Metadata } from 'next'
import { getContent } from '@/content/sarfbio-content'

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
  alternates: { canonical: 'https://sarfbio.com' },
}
```

```tsx
// components/seo/JsonLd.tsx
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
    offers: content.business.hardwareKits.map(kit => ({
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
```

#### Criterios de Aceptación
- [ ] Google Search Console valida structured data sin errores
- [ ] OpenGraph preview correcto en Facebook y LinkedIn
- [ ] Lighthouse SEO score = 100

---

### Tarea 8.2 — Accessibility Audit

#### Checklist de Accesibilidad WCAG 2.1 AA

**Keyboard Navigation:**
- [ ] Tab order lógico: NavBar → Hero CTA → secciones → Footer
- [ ] Focus visible en todos los elementos interactivos (outline bio-green)
- [ ] Menú mobile operable completamente con teclado

**Reduced Motion:**
```ts
// hooks/useReducedMotion.ts
'use client'
import { useEffect, useState } from 'react'

export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return prefersReduced
}
```

**Aria Strategy:**
- Todas las escenas 3D: `aria-hidden="true"` + `role="img"` con `aria-label` descriptivo
- Formulario de contacto: `aria-required`, `aria-describedby` para errores
- Secciones: landmarks semánticos (`<main>`, `<section>`, `<nav>`, `<footer>`)
- Imágenes: `alt` text descriptivo (nunca vacío para imágenes de contenido)

**Screen Reader Fallbacks:**
```tsx
{/* Para cada escena 3D */}
<div aria-hidden="true">
  <SceneWrapper>...</SceneWrapper>
</div>
{/* Contenido equivalente para screen readers */}
<p className="sr-only">
  Visualización 3D del robot SARFBIO-01 mostrando sus componentes: brazo robótico, ESP32, sistema de bombeo.
</p>
```

#### Criterios de Aceptación
- [ ] Lighthouse Accessibility score ≥ 95
- [ ] Verificación con axe-core: 0 violations críticas
- [ ] Operación completa con teclado sin mouse

---

## FASE 9 — Testing + Hardening

### Tarea 9.1 — Testing Strategy

#### Unit Testing (Jest + Testing Library)
```ts
// __tests__/content/sarfbio-content.test.ts
import { getContent } from '@/content/sarfbio-content'
import type { SarfbioContent } from '@/types/content'

describe('sarfbio-content', () => {
  it('tiene todos los campos requeridos poblados', () => {
    const content = getContent()
    expect(content.hero.headline).toBeTruthy()
    expect(content.hero.stats).toHaveLength(3)
    expect(content.team.members).toHaveLength(3)
    // ... validar todos los campos críticos
  })

  it('todos los teamMembers tienen imageUrl válida', () => {
    const content = getContent()
    content.team.members.forEach(member => {
      expect(member.imageUrl).toMatch(/^\/images\/team\//)
    })
  })
})
```

#### Visual Regression (Chromatic / Percy)
```yaml
# .github/workflows/visual-regression.yml
- name: Visual Regression
  run: npx chromatic --project-token=${{ secrets.CHROMATIC_TOKEN }}
```

#### FPS Profiling
```ts
// lib/three/profiler.ts - Solo en desarrollo
export function createFPSProfiler() {
  if (process.env.NODE_ENV !== 'development') return null

  let frames = 0
  let lastTime = performance.now()

  return {
    onFrame: () => {
      frames++
      const now = performance.now()
      if (now - lastTime >= 1000) {
        console.debug(`[3D Scene] FPS: ${frames}`)
        frames = 0
        lastTime = now
      }
    }
  }
}
```

#### Memory Leak Validation
```ts
// En cada scene component, verificar cleanup en useEffect
useEffect(() => {
  return () => {
    // Dispose de geometrías y materiales al unmount
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose()
        if (Array.isArray(object.material)) {
          object.material.forEach(m => m.dispose())
        } else {
          object.material.dispose()
        }
      }
    })
  }
}, [scene])
```

#### Criterios de Aceptación
- [ ] 0 memory leaks detectados en Chrome DevTools Memory profiler tras 10 scroll completos
- [ ] Lighthouse Performance ≥ 90 en mobile
- [ ] FPS ≥ 55 en Desktop Mid-Range (MacBook Air M1) con Hero Scene activa

---

## FASE 10 — Producción

### Tarea 10.1 — Deployment y CI/CD

#### Archivos Afectados
```
.github/workflows/ci.yml
vercel.json
```

#### Código de Referencia

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  lighthouse:
    needs: validate
    runs-on: ubuntu-latest
    steps:
      - name: Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
```

```json
// vercel.json
{
  "headers": [
    {
      "source": "/models/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/textures/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

#### Criterios de Aceptación
- [ ] Deploy automático en Vercel en push a `main`
- [ ] Headers de cache correcto para assets estáticos (modelos, texturas)
- [ ] HTTPS forzado
- [ ] Lighthouse CI pasa con scores ≥ 90 en todas las categorías

---

# 5. SISTEMA 3D — ESPECIFICACIÓN COMPLETA

## 5.1 Canvas Architecture

```
<Canvas>                                    ← R3F renderer, 1 WebGL context por escena
  <Suspense fallback={<LoadingMesh />}>      ← Suspense nativo de React
    <Scene />                               ← Componente de escena específico
  </Suspense>
  <Environment />                           ← HDRI lighting (drei)
  <lights />                                ← Desde presets de lib/three/lights.ts
  [PostProcessing si gpu.tier === 'high']   ← @react-three/postprocessing
</Canvas>
```

**Regla crítica:** Máximo 2 `<Canvas>` activos simultáneamente. iOS Safari limita a 4 contextos WebGL; mantener margen de seguridad.

## 5.2 Suspense Strategy

```tsx
// Patrón estándar para cada scene
<Suspense fallback={<LoadingState />}>
  <ModelComponent /> {/* useGLTF hace el suspense automático */}
</Suspense>
```

`useGLTF` de drei implementa natively el React Suspense pattern: lanza un `Promise` mientras carga, React suspende el render, y cuando la promesa resuelve, React re-renderiza con el modelo disponible. El loading state es el fallback de Suspense, no un estado manual.

## 5.3 Postprocessing Pipeline (GPU High Only)

```tsx
// Solo en GPU tier 'high'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

{gpu.tier === 'high' && (
  <EffectComposer>
    <Bloom
      intensity={0.3}
      luminanceThreshold={0.8}
      luminanceSmoothing={0.9}
      mipmapBlur
    />
    <ChromaticAberration
      blendFunction={BlendFunction.NORMAL}
      offset={[0.0005, 0.0005]}
    />
  </EffectComposer>
)}
```

**Nota:** Bloom en bio-green genera el efecto bioluminiscente necesario para las escenas de biopreparados.

---

# 6. SISTEMA DE MOTION DESIGN

## Decision Tree de Motion

```
¿La animación es solo hover o state change?
  → CSS transform + transition (compositor thread)

¿La animación es scroll-triggered reveal?
  → Framer Motion useInView + variants

¿La animación es compleja, con spring o spring chains?
  → Framer Motion animate prop

¿La animación ocurre dentro de Three.js?
  → useFrame, nunca props de React

¿La animación simula física o partículas?
  → GLSL shader en GPU
```

## Scroll Orchestration Map

```
Viewport Entry de cada sección → trigger animation:

#inicio    → Hero text stagger, counter animations
#problema  → Pain point cards reveal, progress bars fill
#producto  → Robot annotation reveal, feature cards stagger
#biofluido → Particle emission start, mode toggle reveal
#metricas  → KPI counters, chart bar growth
#tecnica   → Exploded view progress
#negocio   → Kit cards flip, pricing reveal
#validacion → Stats pulse, SDG icons sequence
#equipo    → Member cards stagger
#contacto  → Form elements sequential reveal
```

---

# 7. SISTEMA RESPONSIVE

## Mobile Strategy para 3D

```ts
// hooks/useShouldRender3D.ts
'use client'
import { useMediaQuery } from './useMediaQuery'
import { useReducedMotion } from './useReducedMotion'

export function useShouldRender3D(): boolean {
  const isMobile = useMediaQuery('(max-width: 639px)')
  const reducedMotion = useReducedMotion()

  // Mobile: usar video fallback
  // Reduced motion: usar imagen estática
  return !isMobile && !reducedMotion
}
```

## Touch Interactions

En dispositivos touch, las escenas 3D usan `OrbitControls` con:
```ts
<OrbitControls
  enableZoom={false}
  enablePan={false}
  autoRotate={!isMobile}
  autoRotateSpeed={0.5}
  // Touch: solo rotación, sin zoom ni pan para evitar conflicto con scroll
/>
```

---

# 8. PERFORMANCE ENGINEERING

## Core Web Vitals — Plan de Ataque

**LCP (Target < 1.8s):**
- El LCP element será el H1 de la HeroSection (texto, no imagen)
- Fonts preloaded via `next/font`
- Si el LCP element fuera una imagen: `<Image priority />` con `fetchpriority="high"`
- Evitar que Three.js bloquee el render de texto

**INP (Target < 100ms):**
- Event handlers < 50ms processing time
- Three.js en worker separado si INP > 200ms en producción (vía OffscreenCanvas)
- Debounce en scroll handlers: 16ms (1 frame)

**CLS (Target < 0.05):**
- Todos los `SceneWrapper` tienen `height` fija definida por CSS variable (no computed)
- Imágenes con `width` y `height` explícitos o `aspect-ratio`
- Fonts con `font-display: swap` y `size-adjust` para compensar

**TBT (Target < 150ms):**
- Three.js cargado solo después de `visibilitychange: visible`
- Main thread libre durante LCP via `dynamic()` con `ssr: false`

## Frame Loop Optimization

```ts
// En cada scene, usar frameloop="demand" por defecto
// Solo cambiar a "always" durante animaciones activas
const { isAnimating } = useAnimationState()

<Canvas frameloop={isAnimating ? 'always' : 'demand'}>
```

---

# 9. SEO + INDEXACIÓN

## Heading Hierarchy

```html
<h1>Precisión Quirúrgica, Naturaleza Orgánica.</h1>  ← ÚNICO H1

<h2>El Doble Costo de la Aplicación Tradicional</h2>
<h2>SARFBIO-01: Precisión Quirúrgica y Orgánica</h2>
<h2>Biología en Movimiento</h2>
<h2>Validación de Campo Absoluta</h2>
<h2>Anatomía del SARFBIO-01</h2>
<h2>Modelo de Negocio Híbrido</h2>
<h2>Conoce al Equipo</h2>
<h2>De Prototipo a Soberanía Alimentaria</h2>

  <h3>Fatiga Física Severa</h3>        ← Sub-items dentro de secciones
  <h3>Cerebro</h3>
  <h3>etc.</h3>
```

## Crawler-Safe Rendering para 3D

Los crawlers (Googlebot) no ejecutan WebGL. La solución es:

1. Todo contenido semántico en HTML estático (RSC)
2. Escenas 3D marcadas con `aria-hidden="true"`
3. `<noscript>` fallback con descripción textual del robot
4. Structured data JsonLD describe el producto independientemente de las escenas

---

# 10. ACCESIBILIDAD

Ver Tarea 8.2 para checklist completo. Reglas adicionales:

- **Color Contrast:** bio-green (#22C55E) sobre tech-navy (#0F172A) = ratio 8.4:1 ✅ (AA y AAA)
- **Focus trap:** Menú mobile y modales implementan focus trap con `focus-trap-react`
- **Skip to content:** Link oculto al inicio del body: `<a href="#main-content" className="sr-only focus:not-sr-only">Saltar al contenido</a>`

---

# 11. TESTING STRATEGY

## Stack de Testing

| Herramienta | Uso |
|------------|-----|
| Jest + Testing Library | Unit + Integration |
| Playwright | E2E, visual regression |
| Chromatic | Visual regression automática en CI |
| Lighthouse CI | Performance gates en CI |
| axe-core | Accessibility automated checks |
| Chrome DevTools | Memory leaks, FPS profiling manual |

## Test Coverage Mínimo Requerido

- `content/sarfbio-content.ts`: 100% (todos los campos populados)
- `types/content.ts`: 100% (TypeScript es el test)
- `components/ui/*`: Snapshot tests
- `hooks/*`: Unit tests para lógica
- E2E: Flujo crítico (carga → scroll → formulario → submit)

---

# 12. ENTREGABLE FINAL

## Checklist de Implementación (Secuencial)

### Pre-Implementation
- [ ] Verificar disponibilidad de modelos 3D (.glb, .obj, o archivos fuente para convertir)
- [ ] Confirmar fotografías del equipo en alta resolución
- [ ] Confirmar video loop del robot (si disponible) para fallback mobile
- [ ] Dominio y hosting definidos (Vercel recomendado)
- [ ] Resend API key disponible para formulario de contacto

### Fase 1 (Base)
- [ ] 1.1 Setup proyecto, design tokens, Tailwind 4.x
- [ ] 1.2 `sarfbio-content.ts` completo y tipado

### Fase 2 (3D Infrastructure)
- [ ] 2.1 ADR-001 aprobado por el equipo
- [ ] 2.2 Loaders, GPU tier hook, intersection scene hook
- [ ] 2.3 `SceneWrapper` funcional con lazy mount

### Fase 3 (Components)
- [ ] 3.1 Todos los UI base components con tokens SARFBIO
- [ ] `AnimatedCounter` verificado en viewport

### Fase 4 (3D Scenes)
- [ ] 4.1 HeroScene3D con robot animado
- [ ] 4.2 BiofluidScene3D con partículas custom
- [ ] 4.3 ExplodedView3D con scroll-driven

### Fase 5 (Landing Sections)
- [ ] 5.1 HeroSection completa
- [ ] 5.2 ProblemSection con chart
- [ ] 5.3 Todas las secciones restantes

### Fase 6 (Motion)
- [ ] 6.1 Variant library completa
- [ ] Verificar reduced motion en todos los componentes

### Fase 7 (Performance)
- [ ] 7.1 Bundle analysis: initial JS < 120KB
- [ ] 7.2 Models comprimidos con Draco

### Fase 8 (SEO + A11y)
- [ ] 8.1 Metadata + JsonLD
- [ ] 8.2 Axe audit: 0 violations críticas

### Fase 9 (Testing)
- [ ] Tests de contenido pasando
- [ ] Lighthouse Performance ≥ 90 mobile

### Fase 10 (Producción)
- [ ] CI/CD configurado
- [ ] Cache headers para assets
- [ ] Deploy exitoso en Vercel

---

## Riesgos Críticos de Arquitectura

| ID | Riesgo | Probabilidad | Impacto | Mitigación |
|----|--------|-------------|---------|-----------|
| RC-01 | Modelos 3D no disponibles en tiempo de desarrollo | Alta | Crítico | Usar placeholder geometry generada proceduralmente (Three.js BoxGeometry, etc.) hasta disponibilidad de assets |
| RC-02 | WebGL no soportado en target browser de usuarios rurales Venezuela | Media | Alto | Video fallback obligatorio + imagen estática como último recurso. Feature detection con `WebGLRenderingContext` |
| RC-03 | Conectividad limitada de usuarios finales (Venezuela) | Alta | Alto | Draco compression agresiva, lazy load de todo 3D, offline-first para contenido crítico |
| RC-04 | Three.js bundle size excede presupuesto | Media | Medio | Tree-shaking estricto, importar solo módulos usados |
| RC-05 | CLS por carga tardía de escenas 3D | Media | Medio | `min-height` fijo en SceneWrapper con CSS variable, no depender de contenido para height |
| RC-06 | iOS Safari WebGL context limit | Baja | Medio | Máximo 2 Canvas activos (intersección), dispose agresivo |
| RC-07 | Framer Motion + R3F causan re-renders cascada | Media | Alto | Separar scroll MotionValues via Context, no pasar como props; usar `useTransform` en lugar de `useMotionValue` directo |

---

## Recomendaciones Futuras

### Escalabilidad
- Internacionalización: `next-intl` para versión en inglés (captación de alianzas internacionales)
- CMS headless (Sanity o Contentlayer) para que el equipo actualice contenido sin código
- API backend para leads del formulario de contacto (actualmente solo Resend)

### Analytics
- Vercel Analytics para Core Web Vitals en producción
- Hotjar o Microsoft Clarity para heatmaps de interacción con escenas 3D
- Conversión tracking en CTAs (financiamiento, alianzas)

### Digital Twin (Futuro)
- La arquitectura de tipos (`HardwareComponent`, `explodedOffset`) está diseñada para evolucionar hacia un digital twin real
- ESP32 puede exponer telemetría via WebSocket → visualización en tiempo real en la landing
- Three.js + Socket.io: mostrar posición real del robot en campo

### AI Integration Futura
- Vision AI para detección de plagas integrado en la landing (demo interactiva)
- Chatbot SARFBIO Academy: RAG sobre documentación de biopreparados
- Recommender: qué BioBox usar según el cultivo y la plaga detectada

---

> **Versión:** 1.0.0  
> **Generado:** Staff Frontend Architect Level  
> **Objetivo:** Consumo directo por agentes autónomos de código (Cursor, Claude Code, Copilot)  
> **Idioma de código:** English  
> **Idioma de contenido:** Español (Venezuela)
