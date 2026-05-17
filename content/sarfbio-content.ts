// content/sarfbio-content.ts — ÚNICA fuente de verdad del contenido SARFBIO
// Spec: spec_driven_v01.md — Tarea 1.2
// Datos reales: SARFBIO-01, Finca "El Chaparral", Yaracuy Venezuela

import type { SarfbioContent } from '@/types/content'

export const sarfbioContent: SarfbioContent = {
  meta: {
    title: 'SARFBIO — Precisión Quirúrgica y Orgánica',
    description:
      'Robot agrícola inteligente para dispensación automatizada de biopreparados. Protege tus cultivos de maíz y cacao con tecnología de precisión accesible.',
    keywords: [
      'robot agrícola',
      'biopreparados',
      'agricultura de precisión',
      'ESP32',
      'automatización agrícola',
      'Venezuela',
      'Yaracuy',
      'SARFBIO',
    ],
    ogImage: '/images/og-image.jpg',
    twitterHandle: '@sarfbio',
  },

  hero: {
    headline: 'Precisión Quirúrgica,\nNaturaleza Orgánica.',
    subheadline:
      'El primer robot agrícola venezolano que aplica biopreparados exactamente donde cada planta lo necesita.',
    tagline: 'SARFBIO — Sistema Automatizado de Riego Focalizado de Biopreparados',
    ctaPrimary: { label: 'Conocer el Robot', href: '#producto', variant: 'primary' },
    ctaSecondary: {
      label: 'Ver Validación de Campo',
      href: '#validacion',
      variant: 'secondary',
    },
    stats: [
      {
        value: '40',
        unit: '%',
        label: 'Cultivos perdidos por plagas anualmente',
        source: 'FAO',
      },
      {
        value: '3',
        unit: 'h',
        label: 'Diarias perdidas en aplicación manual',
        source: 'Encuesta Campo',
      },
      {
        value: '45',
        unit: 'min',
        label: 'Autonomía por ciclo de batería',
        source: 'SARFBIO-01',
      },
    ],
  },

  problem: {
    sectionTitle: 'El Doble Costo de la Aplicación Tradicional',
    sectionSubtitle:
      '¿Cuántos recursos está dispuesto a sacrificar un agricultor cuando la tecnología puede hacerlo de forma orgánica?',
    problemStatement:
      'La aplicación manual exige esfuerzo físico extremo y genera desperdicio crítico. Los biopreparados requieren focalización precisa (tallo, hoja o raíz). El método manual genera cobertura desigual y pérdida económica directa.',
    rhetoricalQuestion: '¿Y si la tecnología pudiera devolver ese tiempo de forma orgánica?',
    globalStats: [
      {
        value: '40',
        unit: '%',
        label: 'De los cultivos mundiales se pierden anualmente por plagas',
        source: 'FAO',
      },
      {
        value: '3',
        unit: 'Horas',
        label: 'El tiempo diario que un pequeño agricultor pierde en aplicación manual y extenuante',
        source: 'Encuesta SARFBIO',
      },
    ],
    painPoints: [
      {
        id: 'fatigue',
        title: 'Fatiga Física Severa',
        description:
          'La mochila pulverizadora es pesada y agota la salud del productor.',
        score: 3.4,
        maxScore: 5,
        icon: 'body',
      },
      {
        id: 'coverage',
        title: 'Cobertura Desigual',
        description:
          'Rociado "al voleo" impreciso. Los biopreparados requieren aplicación focalizada.',
        score: 3.3,
        maxScore: 5,
        icon: 'spray',
      },
      {
        id: 'pain',
        title: 'Dolor Físico Crónico',
        description:
          'Dolor de espalda y brazos por movimientos repetitivos con carga.',
        score: 3.2,
        maxScore: 5,
        icon: 'pain',
      },
      {
        id: 'waste',
        title: 'Desperdicio de Material',
        description:
          'Pérdida económica directa por aplicación imprecisa de insumos costosos.',
        score: 3.1,
        maxScore: 5,
        icon: 'waste',
      },
    ],
  },

  product: {
    sectionTitle: 'SARFBIO-01: Precisión Quirúrgica y Orgánica',
    tagline: 'Un robot que entiende cada planta.',
    description:
      'Vehículo robótico con brazo articulado de precisión, controlado por ESP32 con WiFi integrado. Opera por control remoto y aplica el biopreparado exactamente donde la planta lo necesita: en la raíz o en la hoja.',
    autonomyMinutes: 45,
    components: [
      {
        id: 'brain',
        name: 'Cerebro',
        description: 'Microcontrolador ESP32 con capacidades WiFi integradas.',
        annotation3DPosition: [0.2, 0.5, 0],
        icon: 'cpu',
      },
      {
        id: 'arm',
        name: 'Aplicación Inteligente',
        description: 'Brazo robótico de precisión impulsado por servomotores.',
        annotation3DPosition: [0.4, 0.8, 0.2],
        icon: 'arm',
      },
      {
        id: 'drive',
        name: 'Tracción',
        description:
          'Vehículo con ruedas accionado por motores DC para navegación fluida en el terreno.',
        annotation3DPosition: [-0.3, -0.2, 0],
        icon: 'wheel',
      },
      {
        id: 'spray',
        name: 'Diferenciador Clave',
        description:
          'Rociado Alto y Bajo. Aplica el biopreparado exactamente donde la planta lo necesita, eliminando el desperdicio.',
        annotation3DPosition: [0.5, 0.3, 0.3],
        icon: 'spray',
      },
    ],
    differentiators: [
      {
        id: 'precision',
        title: 'Aplicación Focalizada',
        description: 'Dos modos: Rociado Alto (hoja) y Rociado Bajo (raíz).',
        vsTraditional: 'vs. rociado al voleo indiscriminado',
      },
      {
        id: 'organic',
        title: '100% Orgánico',
        description: 'Optimizado para biopreparados naturales, no agroquímicos.',
        vsTraditional: 'vs. fumigación química convencional',
      },
      {
        id: 'remote',
        title: 'Control Remoto',
        description: 'El agricultor opera desde distancia, sin carga física.',
        vsTraditional: 'vs. mochila pulverizadora de 15kg',
      },
      {
        id: 'accessible',
        title: 'Costo Accesible',
        description: 'Componentes estándar ESP32, fabricación local posible.',
        vsTraditional: 'vs. drones agrícolas ($2000+)',
      },
    ],
  },

  biofluid: {
    sectionTitle: 'Biología en Movimiento',
    description:
      'Cada biopreparado es una solución viva. SARFBIO asegura que llegue intacto y preciso a su destino.',
    sprayModes: [
      {
        id: 'high',
        label: 'Rociado Alto',
        targetZone: 'Hoja y tallo superior',
        description:
          'El brazo se eleva para cubrir el follaje completo de la planta.',
      },
      {
        id: 'low',
        label: 'Rociado Bajo',
        targetZone: 'Raíz y base',
        description:
          'El brazo desciende para aplicación directa en zona radicular.',
      },
    ],
    bioboxFormula: [
      {
        name: 'Extracto de Neem',
        quantity: '500ml',
        purpose: 'Repelente natural contra gusano cogollero',
        costUSD: 3.5,
      },
      {
        name: 'Extracto de Ajo',
        quantity: '300ml',
        purpose: 'Ahuyenta insectos y previene hongos',
        costUSD: 1.2,
      },
      {
        name: 'Extracto de Ají Picante',
        quantity: '200ml',
        purpose: 'Irrita y repele plagas sin dañar la planta',
        costUSD: 0.8,
      },
      {
        name: 'Beauveria bassiana',
        quantity: '50g',
        purpose: 'Hongo benéfico que ataca específicamente al gusano cogollero',
        costUSD: 2.5,
      },
      {
        name: 'Melaza de Caña',
        quantity: '100ml',
        purpose: 'Alimento para microorganismos benéficos',
        costUSD: 0.6,
      },
      {
        name: 'Jabón Potásico',
        quantity: '30ml',
        purpose: 'Pegante que mantiene la mezcla en la hoja',
        costUSD: 0.4,
      },
    ],
  },

  metrics: {
    sectionTitle: 'Validación de Campo Absoluta',
    kpis: [
      {
        id: 'producers',
        value: 12,
        label: 'Productores locales encuestados',
        description: 'Con contingencias reales de campo documentadas',
        color: 'green',
      },
      {
        id: 'interest',
        value: '100',
        unit: '%',
        label: 'Interés de adopción (5/5)',
        description: 'Todos los productores encuestados expresaron interés máximo',
        color: 'green',
      },
      {
        id: 'savings',
        value: '50',
        unit: ' USD',
        label: 'Ahorro por ciclo',
        description: 'En tiempo, mano de obra e insumos orgánicos',
        color: 'amber',
      },
    ],
    surveyResults: [
      { label: 'Fatiga física', score: 3.4, maxScore: 5 },
      { label: 'Cobertura desigual', score: 3.3, maxScore: 5 },
      { label: 'Dolor espalda/brazos', score: 3.2, maxScore: 5 },
      { label: 'Desperdicio producto', score: 3.1, maxScore: 5 },
    ],
    comparisonTable: [
      {
        dimension: 'Tiempo',
        manual: 'Manual e improductivo',
        sarfbio: 'Automatizado (4.5/5 importancia). Libera al agricultor.',
        highlight: true,
      },
      {
        dimension: 'Esfuerzo',
        manual: 'Carga física, fatiga, interrupción',
        sarfbio: 'Cero carga física. Operación a control remoto.',
        highlight: true,
      },
      {
        dimension: 'Economía',
        manual: 'Costo continuo en tiempo e insumos',
        sarfbio: 'Ahorro de $50 USD por ciclo en tiempo e insumos orgánicos.',
        highlight: true,
      },
    ],
  },

  techBreakdown: {
    sectionTitle: 'Anatomía del SARFBIO-01',
    components: [
      {
        id: 'arm-structure',
        name: 'Brazo y Estructura',
        category: 'application',
        description: 'Sostiene y mueve la boquilla para rociar con precisión',
        costUSD: 123,
        explodedOffset: [0, 1.5, 0],
      },
      {
        id: 'battery-electronics',
        name: 'Batería y Electrónica',
        category: 'brain',
        description: 'Cerebro del robot + energía para que funcione',
        costUSD: 99,
        explodedOffset: [0, -0.5, 0.8],
      },
      {
        id: 'vehicle-wheels',
        name: 'Vehículo con Ruedas',
        category: 'locomotion',
        description: 'Permite que el robot se desplace por el cultivo',
        costUSD: 113,
        explodedOffset: [0, -1.5, 0],
      },
      {
        id: 'pump-tank',
        name: 'Bomba y Tanque',
        category: 'application',
        description: 'Guarda y aplica el biopreparado en las plantas',
        costUSD: 63,
        explodedOffset: [0.8, 0, 0],
      },
      {
        id: 'remote-control',
        name: 'Control Remoto',
        category: 'brain',
        description: 'Para que el agricultor maneje el robot a distancia',
        costUSD: 30,
        explodedOffset: [-0.8, 0.5, 0],
      },
    ],
  },

  business: {
    sectionTitle: 'Modelo de Negocio Híbrido: Ecosistema Rentable',
    hardwareKits: [
      {
        id: 'educativo',
        name: 'Kit SARFBIO Educativo',
        priceUSD: 350,
        costUSD: 290,
        marginPercent: 17,
        description:
          'Para huertos escolares y proyectos educativos. Capital para reinversión.',
        featured: false,
      },
      {
        id: 'basico',
        name: 'Kit SARFBIO Básico',
        priceUSD: 800,
        costUSD: 600,
        marginPercent: 25,
        description:
          'Solución completa para el pequeño productor. Margen de ganancia del 25%.',
        featured: true,
      },
    ],
    subscriptions: [
      {
        id: 'biobox-maiz',
        name: 'BioBox Maíz',
        priceUSD: 20,
        coverage: '~0.1 hectárea (1,000 m²)',
        formula: 'maiz',
      },
      {
        id: 'biobox-cacao',
        name: 'BioBox Cacao',
        priceUSD: 20,
        coverage: '~0.1 hectárea (1,000 m²)',
        formula: 'cacao',
      },
      {
        id: 'biobox-educativo',
        name: 'BioBox Educativo',
        priceUSD: 20,
        coverage: 'Cultivos hidropónicos',
        formula: 'educativo',
      },
    ],
    valueAddedServices: [
      {
        id: 'maintenance',
        name: 'Mantenimiento Preventivo',
        description: 'Servicio técnico periódico en campo',
      },
      {
        id: 'academy',
        name: 'SARFBIO Academy',
        description:
          'Capacitación en uso de tecnología abierta y biopreparados',
      },
    ],
  },

  validation: {
    sectionTitle: 'Validación de Campo Absoluta',
    farmName: 'Finca "El Chaparral"',
    producersCount: 12,
    interestPercent: 100,
    fieldTests: 'Pruebas de campo validadas',
    alignment: [
      {
        sdgNumber: 2,
        title: 'Hambre Cero',
        description: 'Protección de cultivos para seguridad alimentaria',
      },
      {
        sdgNumber: 3,
        title: 'Salud y Bienestar',
        description: 'Eliminación de exposición directa a químicos',
      },
      {
        sdgNumber: 12,
        title: 'Producción Responsable',
        description: 'Uso eficiente de biopreparados orgánicos',
      },
    ],
  },

  team: {
    sectionTitle: 'Conoce al Equipo',
    origin:
      'La idea surge al ver en la finca de nuestro COO Juan Benítez Moreno, cómo aplicaban productos para el cuidado de los cultivos.',
    purpose:
      'Liberar al agricultor de la carga manual, devolviéndole el tiempo para gestionar y crecer.',
    vision:
      'Ser el estándar de automatización accesible para la agricultura orgánica en la región en los próximos 5 años.',
    members: [
      {
        id: 'flavio',
        name: 'Flavio Luigi Toaiari Moreno',
        role: 'CTO',
        title: 'Chief Technology Officer',
        imageUrl: '/images/team/flavio.jpg',
      },
      {
        id: 'marcial',
        name: 'Marcial Gregorio Valenzuela Rodríguez',
        role: 'CEO',
        title: 'Chief Executive Officer',
        imageUrl: '/images/team/marcial.jpg',
      },
      {
        id: 'juan',
        name: 'Juan Alejandro Benítez Moreno',
        role: 'COO',
        title: 'Chief Operating Officer',
        imageUrl: '/images/team/juan.jpg',
      },
    ],
  },

  cta: {
    headline: 'De Prototipo a Soberanía Alimentaria',
    subheadline:
      'Con tu apoyo, SARFBIO deja de ser un proyecto escolar y se convierte en una herramienta de impacto regional.',
    needs: [
      {
        type: 'funding',
        title: 'Financiamiento',
        description:
          'Para la fabricación de 10 unidades piloto y pruebas de campo en diferentes cultivos (maíz y cacao).',
      },
      {
        type: 'partnership',
        title: 'Alianzas Estratégicas',
        description:
          'Conexión con cooperativas agrícolas o agricultores urbanos/periurbanos para el desarrollo de las pruebas.',
      },
    ],
    form: {
      namePlaceholder: 'Tu nombre o institución',
      emailPlaceholder: 'tu@email.com',
      messagePlaceholder: '¿Cómo quieres colaborar con SARFBIO?',
      submitLabel: 'Enviar Mensaje',
    },
  },
}

export function getContent(): SarfbioContent {
  return sarfbioContent
}
