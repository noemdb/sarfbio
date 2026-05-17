# SARFBIO — PRODUCTION PLATFORM SPECIFICATION v2.0

## Operational-Grade Interactive AgriTech Platform

### Principal Engineer / Platform Architecture Edition

> **Clasificación:** Production Platform Specification
> **Evolución de:** Execution Blueprint v1.0
> **Objetivo:** Transformar la landing experiencial en una plataforma frontend resiliente, observable, extensible y operacionalmente madura.
> **Nivel:** Principal / Distinguished Engineer
> **Horizonte:** 24–36 meses de escalabilidad

---

# 1. VISIÓN ESTRATÉGICA DE PLATAFORMA

## 1.1 Cambio de Paradigma

La especificación original modelaba:

```txt
Landing Page Cinemática
```

La nueva arquitectura modela:

```txt
Interactive AgriTech Platform
```

La landing deja de ser:

* un artefacto visual aislado

y pasa a ser:

* la primera superficie de una plataforma operacional escalable.

---

# 2. PRINCIPIOS RECTORES DE PRODUCCIÓN

| ID    | Principio               | Descripción                                           |
| ----- | ----------------------- | ----------------------------------------------------- |
| PP-01 | Operational First       | Toda experiencia visual debe ser observable y medible |
| PP-02 | Failure Containment     | Ninguna falla visual puede romper la plataforma       |
| PP-03 | GPU Budget Governance   | GPU es un recurso limitado y administrado             |
| PP-04 | Deterministic Rendering | Rendering consistente entre dispositivos              |
| PP-05 | Progressive Capability  | Experiencias adaptativas según capacidad real         |
| PP-06 | Runtime Isolation       | Escenas 3D aisladas operacionalmente                  |
| PP-07 | Accessibility by Design | Accesibilidad como sistema, no feature                |
| PP-08 | Edge Native Delivery    | Distribución global optimizada desde diseño           |
| PP-09 | Telemetry Everywhere    | Todo evento importante genera métricas                |
| PP-10 | Platform Evolvability   | Toda decisión habilita futuras capacidades            |

---

# 3. PLATFORM ARCHITECTURE

# 3.1 Topología General

```txt
┌───────────────────────────────────────────────┐
│                CLIENT RUNTIME                 │
├───────────────────────────────────────────────┤
│                                               │
│  React 19 + RSC Runtime                       │
│  ├── Landing Shell                            │
│  ├── Motion Runtime                           │
│  ├── Scene Orchestrator                       │
│  ├── GPU Resource Manager                     │
│  ├── Accessibility Layer                      │
│  ├── Telemetry Runtime                        │
│  └── Error Recovery Runtime                   │
│                                               │
├───────────────────────────────────────────────┤
│               PLATFORM SERVICES               │
├───────────────────────────────────────────────┤
│                                               │
│  Content Engine                               │
│  Asset Pipeline                               │
│  Localization Engine                          │
│  Experimentation Runtime                      │
│  Analytics Layer                              │
│  Form Gateway                                 │
│                                               │
├───────────────────────────────────────────────┤
│                EDGE DELIVERY                  │
├───────────────────────────────────────────────┤
│                                               │
│  CDN Edge Cache                               │
│  GLB Streaming                                │
│  Texture Negotiation                          │
│  Brotli / HTTP3                               │
│  ISR / Full Route Cache                       │
│                                               │
└───────────────────────────────────────────────┘
```

---

# 4. RUNTIME GOVERNANCE LAYER

# 4.1 Runtime Domains

La plataforma se divide en dominios aislados:

| Dominio               | Responsabilidad                    |
| --------------------- | ---------------------------------- |
| Rendering Runtime     | Canvas + WebGL lifecycle           |
| Motion Runtime        | Scroll, timelines, synchronization |
| Content Runtime       | Content hydration                  |
| Telemetry Runtime     | Metrics + tracing                  |
| Recovery Runtime      | Error recovery                     |
| Accessibility Runtime | Capability adaptation              |
| Asset Runtime         | Streaming y caching                |

---

# 5. ADR-002 — RSC BOUNDARY GOVERNANCE

## Status

Accepted

---

## Contexto

React Server Components introducen:

* serialization boundaries
* hydration propagation
* client bundle contamination

Sin reglas estrictas:

* el bundle crece exponencialmente
* se pierde SSR purity
* aumenta hydration cost

---

## Reglas Obligatorias

# RSC-01 — Server by Default

Todo componente es Server Component salvo prueba contraria.

---

# RSC-02 — Client Islands Minimalistas

Los únicos módulos client-side permitidos:

```txt
features/**/Scene3D.tsx
motion/**
interactive-ui/**
```

---

# RSC-03 — Forbidden Across Boundaries

NO permitido:

```ts
functions
THREE.Mesh
class instances
Date
Map
Set
symbols
```

---

# RSC-04 — Bundle Governance

Toda isla client debe reportar:

```txt
bundle size
hydration time
mount time
```

---

# RSC-05 — Server-only Enforcement

Uso obligatorio:

```ts
import 'server-only'
```

en:

* content adapters
* CMS loaders
* analytics ingestion

---

# 6. GPU RESOURCE MANAGEMENT SYSTEM

# 6.1 GPU Lifecycle Architecture

Nueva capa obligatoria:

```txt
GPU Resource Manager
```

---

# Responsabilidades

| Recurso       | Gestión           |
| ------------- | ----------------- |
| Textures      | disposal          |
| Materials     | pooling           |
| Geometries    | disposal          |
| Framebuffers  | cleanup           |
| WebGL Context | recovery          |
| Shaders       | compilation cache |

---

# 6.2 Memory Budgets

| Recurso         | Budget   |
| --------------- | -------- |
| VRAM            | < 200MB  |
| Draw Calls      | < 120    |
| Triangles       | < 500k   |
| Texture Atlases | < 8      |
| Active Canvases | 2 máximo |
| Shader Programs | < 20     |

---

# 6.3 GPU Manager API

```ts
interface GPUResourceManager {
  allocateTexture(): void
  releaseTexture(): void
  disposeScene(): void
  recoverContext(): void
  reportMemoryPressure(): void
}
```

---

# 6.4 WebGL Context Recovery

Obligatorio:

```ts
canvas.addEventListener('webglcontextlost')
canvas.addEventListener('webglcontextrestored')
```

---

# 6.5 Adaptive Degradation Matrix

| Capability      | Rendering Strategy  |
| --------------- | ------------------- |
| High GPU        | Full cinematic      |
| Mid GPU         | Reduced particles   |
| Low GPU         | Static lighting     |
| Critical Memory | Video fallback      |
| Context Lost    | Static poster image |

---

# 7. OBSERVABILITY ARCHITECTURE

# 7.1 Telemetry Stack

| Layer          | Tool           |
| -------------- | -------------- |
| Errors         | Sentry         |
| Performance    | Web Vitals     |
| Tracing        | OpenTelemetry  |
| UX Analytics   | PostHog        |
| Session Replay | rrweb          |
| GPU Metrics    | Custom Runtime |

---

# 7.2 Mandatory Metrics

## Rendering

```txt
scene_mount_time
gltf_decode_duration
shader_compile_time
frame_drops
gpu_memory_estimate
```

---

## UX

```txt
scroll_engagement
cta_visibility
scene_interaction_rate
dropoff_per_section
```

---

## Runtime

```txt
hydration_duration
bundle_execution_time
resource_retry_count
webgl_context_loss
```

---

# 7.3 Performance Observer Layer

```ts
PerformanceObserver
```

obligatorio para:

* Long Tasks
* Layout Shift
* Paint Timing
* Largest Contentful Paint

---

# 8. ACCESSIBILITY SYSTEM

# 8.1 Accessibility Runtime

Nueva capa:

```txt
Accessibility Capability Engine
```

---

# 8.2 Capability Matrix

| Capability             | Adaptación         |
| ---------------------- | ------------------ |
| Reduced Motion         | disable particles  |
| Vestibular Sensitivity | static camera      |
| Screen Reader          | semantic narration |
| Keyboard Only          | no hidden focus    |
| Low Vision             | high contrast      |
| Cognitive Load         | simplified mode    |

---

# 8.3 Motion Governance

Toda animación debe clasificarse:

| Nivel      | Permitido                 |
| ---------- | ------------------------- |
| Essential  | Sí                        |
| Decorative | configurable              |
| Intensive  | disable on reduced motion |

---

# 8.4 Semantic Mirroring

Toda escena 3D requiere:

```html
<section hidden>
```

con:

* descripción semántica
* narrativa equivalente
* contenido indexable

---

# 9. EDGE DELIVERY ARCHITECTURE

# 9.1 CDN Strategy

| Asset     | Cache Policy     |
| --------- | ---------------- |
| GLB       | immutable 1y     |
| KTX2      | immutable 1y     |
| JS Chunks | immutable hashed |
| HTML      | ISR              |
| Fonts     | immutable        |

---

# 9.2 Protocol Stack

Obligatorio:

```txt
HTTP/3
Brotli
Early Hints
Preconnect
Priority Hints
```

---

# 9.3 Asset Negotiation

## Textures

| Device   | Format |
| -------- | ------ |
| High-end | KTX2   |
| Mid      | WebP   |
| Low      | JPEG   |

---

# 9.4 Streaming Strategy

GLB streaming:

* chunked loading
* progressive reveal
* mesh prioritization

---

# 10. CONTENT PLATFORM

# 10.1 Content Architecture v2

```txt
content/
├── locales/
│   ├── es/
│   ├── en/
│   └── pt/
├── schemas/
├── adapters/
├── experiments/
└── transforms/
```

---

# 10.2 Content Validation

Todo contenido validado con:

```ts
zod
```

---

# 10.3 CMS Readiness

La plataforma debe poder migrar a:

* Sanity
* Contentful
* Payload CMS

sin reescribir componentes.

---

# 10.4 Experimentation Runtime

Soporte obligatorio para:

```txt
A/B testing
headline variants
CTA variants
section ordering
```

---

# 11. ERROR RECOVERY ARCHITECTURE

# 11.1 Error Isolation

Cada escena:

* tiene ErrorBoundary propia
* recovery path independiente

---

# 11.2 Failure Modes

| Failure        | Recovery          |
| -------------- | ----------------- |
| GLB fail       | static image      |
| Texture fail   | fallback material |
| Shader fail    | standard material |
| WebGL fail     | video             |
| Hydration fail | server shell      |

---

# 11.3 Retry Strategy

```txt
exponential backoff
max 3 retries
timeout escalation
```

---

# 12. SECURITY ARCHITECTURE

# 12.1 Form Security

Protecciones obligatorias:

* CSRF
* rate limiting
* honeypots
* bot scoring
* schema sanitization

---

# 12.2 CSP Policy

```txt
default-src 'self'
img-src https:
script-src 'self'
worker-src blob:
```

---

# 12.3 API Isolation

Forms:

* server actions only
* no public API keys
* no direct provider exposure

---

# 13. ASSET PIPELINE ARCHITECTURE

# 13.1 3D Asset Pipeline

```txt
Blender
   ↓
glTF Transform
   ↓
Mesh Optimization
   ↓
Texture Atlasing
   ↓
Draco Compression
   ↓
KTX2 Transcoding
   ↓
Validation
   ↓
CI Artifact Publish
```

---

# 13.2 CI Validation Rules

| Rule           | Threshold |
| -------------- | --------- |
| GLB Size       | < 800KB   |
| Texture Atlas  | < 4K      |
| Triangle Count | < 500k    |
| Draw Calls     | < 120     |

---

# 13.3 Automated Validation

Pipeline rechaza:

* oversized textures
* duplicate materials
* excessive meshes
* uncompressed normals

---

# 14. TESTING ARCHITECTURE

# 14.1 Testing Matrix

| Layer         | Tool             |
| ------------- | ---------------- |
| Unit          | Vitest           |
| UI            | RTL              |
| E2E           | Playwright       |
| Accessibility | axe-core         |
| Performance   | Lighthouse CI    |
| Visual        | Chromatic        |
| WebGL         | Snapshot Harness |

---

# 14.2 Performance CI Gates

Build FAIL si:

| Metric | Threshold |
| ------ | --------- |
| LCP    | > 2.5s    |
| Bundle | > 180KB   |
| CLS    | > 0.1     |
| TBT    | > 300ms   |

---

# 15. MOTION ORCHESTRATION SYSTEM

# 15.1 Motion Runtime

Nueva capa:

```txt
Motion Orchestrator
```

---

# Responsabilidades

* scroll synchronization
* scene choreography
* timeline coordination
* adaptive motion scaling

---

# 15.2 Global Motion State

Uso recomendado:

```txt
zustand
```

NO Redux.

---

# 15.3 Scene Synchronization

```txt
Hero
↓
Product Reveal
↓
Biofluid Activation
↓
Exploded View
```

coordinado por un timeline global.

---

# 16. PLATFORM EVOLUTION ROADMAP

# Fase A — Interactive Landing

Estado actual.

---

# Fase B — Intelligent Product Platform

Agregar:

* telemetría IoT
* fleet management
* digital twin

---

# Fase C — Autonomous Agriculture Platform

Agregar:

* crop intelligence
* predictive spraying
* AI agronomy assistant

---

# 17. DEPLOYMENT ARCHITECTURE

# 17.1 Hosting

| Layer     | Provider      |
| --------- | ------------- |
| Frontend  | Vercel        |
| Assets    | Cloudflare R2 |
| CDN       | Cloudflare    |
| Telemetry | Sentry        |
| Analytics | PostHog       |

---

# 17.2 Deployment Strategy

```txt
Preview Deployments
Canary Releases
Feature Flags
Blue/Green Promotion
```

---

# 18. FINAL PRODUCTION READINESS CHECKLIST

# Rendering

* [ ] GPU budgets enforced
* [ ] WebGL recovery implemented
* [ ] Scene disposal verified

---

# Performance

* [ ] Lighthouse CI automated
* [ ] Bundle governance active
* [ ] Streaming validated

---

# Accessibility

* [ ] Reduced motion verified
* [ ] Screen reader parity complete
* [ ] Keyboard navigation complete

---

# Security

* [ ] CSP active
* [ ] Forms protected
* [ ] Rate limits active

---

# Operations

* [ ] Sentry configured
* [ ] Telemetry dashboards active
* [ ] Error alerts configured

---

# Platform

* [ ] Localization ready
* [ ] CMS adapters ready
* [ ] Experimentation runtime ready

---

# 19. PLATFORM MATURITY TARGET

| Área                   | Objetivo |
| ---------------------- | -------- |
| Frontend Architecture  | 9.5/10   |
| Runtime Governance     | 9/10     |
| GPU Management         | 9/10     |
| Accessibility          | 9/10     |
| Operational Excellence | 9/10     |
| Scalability            | 9.5/10   |
| Platform Evolvability  | 10/10    |

---

# CONCLUSIÓN

La arquitectura deja de ser:

```txt
high-end marketing experience
```

y evoluciona hacia:

```txt
operational-grade interactive platform
```

con:

* resiliencia real
* observabilidad completa
* gobierno de runtime
* control de GPU
* edge delivery
* fault tolerance
* evolución multi-producto
