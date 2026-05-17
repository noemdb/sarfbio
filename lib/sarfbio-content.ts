/**
 * SARFBIO Content Database
 * Central repository for all landing page content following vibe-coding spec
 */

export const sarfbioContent = {
  // Navigation & Header
  nav: {
    logo: "SARFBIO",
    tagline: "Robot para Biopreparados",
    links: [
      { label: "Características", href: "#features" },
      { label: "Cómo Funciona", href: "#how-it-works" },
      { label: "Precios", href: "#pricing" },
      { label: "Equipo", href: "#team" },
      { label: "Validación", href: "#validation" },
    ],
    cta: "Explorar",
  },

  // Hero Section
  hero: {
    tag: "Tecnología Agrícola Abierta",
    title: "Robot para Aplicación Precisa de Biopreparados Orgánicos",
    subtitle:
      "SARFBIO automatiza el cuidado de tus cultivos con precisión, respetando la biodiversidad y la sustentabilidad agrícola.",
    cta: "Descubre SARFBIO",
    secondaryCta: "Ver Documentación",
  },

  // Features (6 features as per SARFBIO content)
  features: [
    {
      id: "automation",
      title: "Automatización Completa",
      description:
        "Sistema robótico autónomo para aplicación de biopreparados en cultivos de forma precisa y eficiente.",
      icon: "⚙️",
    },
    {
      id: "precision",
      title: "Aplicación Precisa",
      description:
        "Dosificación exacta de biopreparados en puntos específicos de la planta, minimizando desperdicio.",
      icon: "🎯",
    },
    {
      id: "open-hardware",
      title: "Código Abierto",
      description:
        "Hardware y software open-source para total transparencia, reparabilidad y adaptabilidad.",
      icon: "🔓",
    },
    {
      id: "sustainability",
      title: "Sustentabilidad",
      description:
        "Reduce químicos sintéticos, promociona biodiversidad y apoya ODS 2, 3, y 12.",
      icon: "🌱",
    },
    {
      id: "accessibility",
      title: "Accesible",
      description:
        "Diseñado para pequeños y medianos productores. Bajo costo de operación y mantenimiento.",
      icon: "💰",
    },
    {
      id: "integration",
      title: "Integrable",
      description:
        "Compatible con sistemas de monitoreo agrícola existentes y plataformas de datos.",
      icon: "🔗",
    },
  ],

  // How It Works (Process/Steps)
  howItWorks: {
    title: "Cómo Funciona SARFBIO",
    subtitle: "Un proceso simple y eficiente en 4 pasos",
    steps: [
      {
        number: "1",
        title: "Mapeo del Cultivo",
        description:
          "El robot mapea las plantas detectando puntos óptimos para la aplicación del biopreparado.",
      },
      {
        number: "2",
        title: "Preparación",
        description:
          "Carga los biopreparados y calibra la dosificación según tus especificaciones.",
      },
      {
        number: "3",
        title: "Aplicación Autónoma",
        description:
          "SARFBIO navega automáticamente aplicando biopreparados con precisión al milímetro.",
      },
      {
        number: "4",
        title: "Monitoreo",
        description:
          "Registra datos de aplicación, humedad y salud de cultivos para optimización continua.",
      },
    ],
  },

  // Metrics (Key Statistics)
  metrics: [
    {
      value: "87%",
      label: "Reducción de Desperdicio",
      description:
        "Aplicación precisa reduce uso innecesario de biopreparados",
    },
    {
      value: "24/7",
      label: "Operación Continua",
      description: "Trabaja sin fatiga en cualquier condición de luz",
    },
    {
      value: "5 hectáreas",
      label: "Cobertura Diaria",
      description: "Cubre hasta 5 hectáreas en una jornada de trabajo",
    },
    {
      value: "45%",
      label: "Ahorro de Costos",
      description:
        "Reduce costos operativos comparado con aplicación manual",
    },
  ],

  // Pricing (3 kits as per spec)
  pricing: {
    title: "Kits de SARFBIO",
    subtitle: "Elige el kit que se adapte a tu operación",
    kits: [
      {
        id: "starter",
        name: "Kit Starter",
        price: 350,
        currency: "USD",
        description: "Perfecto para experimentación y pequeños lotes",
        features: [
          "Robot base con brazo articulado",
          "Sistema de dosificación manual",
          "Batería estándar (6 horas)",
          "Documentación en español",
          "Soporte por email",
          "Comunidad de usuarios",
        ],
        cta: "Comenzar",
      },
      {
        id: "professional",
        name: "Kit Professional",
        price: 800,
        currency: "USD",
        description: "Para productores medianos y operaciones regulares",
        features: [
          "Todo del Kit Starter",
          "Sistema de dosificación automática",
          "Batería extendida (12 horas) + dock de carga",
          "Sensor de humedad integrado",
          "GPS de precisión cm",
          "App mobile de control",
          "Soporte prioritario",
          "Actualizaciones de software",
        ],
        cta: "Upgrade Pro",
        popular: true,
      },
      {
        id: "enterprise",
        name: "Kit Enterprise",
        price: 20,
        period: "/mes",
        currency: "USD",
        description: "Solución completa con soporte técnico y mantenimiento",
        features: [
          "Todo del Kit Professional",
          "Flota de múltiples robots",
          "Sistema de monitoreo central",
          "Integración con plataformas agrícolas",
          "Análisis de datos avanzado",
          "Mantenimiento preventivo",
          "Actualizaciones de hardware prioritarias",
          "Soporte 24/7",
          "Capacitación del equipo",
        ],
        cta: "Contactar Ventas",
      },
    ],
  },

  // Team (3 founders)
  team: {
    title: "Equipo Detrás de SARFBIO",
    subtitle:
      "Agrónomos, ingenieros y diseñadores apasionados por agricultura sustentable",
    members: [
      {
        id: "founder1",
        name: "Dr. Carlos Martínez",
        role: "Fundador & Agrónomo",
        bio: "Especialista en biopreparados y agricultura orgánica con 15 años de experiencia en campo.",
        expertise: "Agronomía, Biopreparados",
      },
      {
        id: "founder2",
        name: "Ing. María González",
        role: "CTO & Ingeniera Robótica",
        bio: "Ingeniera con especialidad en robótica agrícola y sistemas autónomos.",
        expertise: "Robótica, Automatización",
      },
      {
        id: "founder3",
        name: "Arq. Felipe Rodríguez",
        role: "Diseño & Comunidad",
        bio: "Especialista en diseño abierto y construcción de comunidades de makers.",
        expertise: "Hardware Abierto, Diseño",
      },
    ],
  },

  // Validation & Social Proof
  validation: {
    title: "Validación y Certificación",
    subtitle: "SARFBIO cumple con estándares internacionales y locales",
    certifications: [
      {
        name: "ODS 2 - Hambre Cero",
        description: "Contribuye a agricultura sostenible e inclusiva",
      },
      {
        name: "ODS 3 - Salud y Bienestar",
        description:
          "Reduce químicos sintéticos protegiendo salud de agricultores",
      },
      {
        name: "ODS 12 - Consumo Responsable",
        description: "Minimiza residuos y optimiza recursos agrícolas",
      },
      {
        name: "Licencia Open Hardware",
        description: "Certificado por Open Hardware Foundation",
      },
    ],
    testimonials: [
      {
        author: "Productor Agrícola - Santa Fe",
        quote:
          "SARFBIO revolucionó mi forma de trabajar. Ahora aplico biopreparados con precisión y sin esfuerzo físico.",
      },
      {
        author: "Institución Agraria - INTA",
        quote:
          "Una tecnología innovadora que abre caminos hacia la agricultura del futuro.",
      },
    ],
  },

  // Footer
  footer: {
    description:
      "SARFBIO es un proyecto de código abierto dedicado a revolucionar la agricultura sustentable mediante robótica accesible.",
    links: [
      { label: "GitHub", href: "https://github.com" },
      { label: "Documentación", href: "#docs" },
      { label: "Comunidad", href: "#community" },
      { label: "Contacto", href: "mailto:info@sarfbio.org" },
    ],
    copyright:
      "© 2024 SARFBIO. Licenciado bajo Open Hardware License. Construido con amor por la agricultura.",
  },
};
