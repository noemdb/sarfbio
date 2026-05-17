"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Check, Zap } from "lucide-react";

const plans = [
  {
    name: "Kit Starter",
    description: "Para experimentación y pequeños lotes",
    price: { monthly: null, annual: 350 },
    period: "USD",
    features: [
      "Robot base con brazo articulado",
      "Sistema de dosificación manual",
      "Batería estándar (6 horas)",
      "Documentación en español",
      "Soporte por email",
      "Comunidad de usuarios",
    ],
    cta: "Comenzar",
    highlight: false,
  },
  {
    name: "Kit Professional",
    description: "Para productores medianos y operaciones regulares",
    price: { monthly: null, annual: 800 },
    period: "USD",
    features: [
      "Todo del Kit Starter",
      "Sistema de dosificación automática",
      "Batería extendida (12 horas) + dock",
      "Sensor de humedad integrado",
      "GPS de precisión cm",
      "App mobile de control",
      "Soporte prioritario",
      "Actualizaciones de software",
    ],
    cta: "Upgrade Pro",
    highlight: true,
  },
  {
    name: "Kit Enterprise",
    description: "Solución completa con soporte y mantenimiento",
    price: { monthly: 20, annual: null },
    period: "/mes USD",
    features: [
      "Todo del Kit Professional",
      "Flota de múltiples robots",
      "Sistema de monitoreo central",
      "Integración con plataformas agrícolas",
      "Análisis de datos avanzado",
      "Mantenimiento preventivo",
      "Actualizaciones de hardware prioritarias",
      "Soporte 24/7",
    ],
    cta: "Contactar Ventas",
    highlight: false,
  },
];

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="pricing" ref={sectionRef} className="relative py-32 lg:py-40">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-20">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-foreground/50 mb-8">
            <span className="w-12 h-px bg-primary/50" />
            Kits de SARFBIO
          </span>
          <h2 className={`text-5xl md:text-6xl lg:text-7xl font-display tracking-tight leading-tight transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}>
            Elige tu Kit
          </h2>
          <p className={`text-lg text-foreground/70 mt-6 max-w-2xl transition-all duration-1000 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}>
            Soluciones diseñadas para cada escala de operación, desde experimentación hasta empresas completas.
          </p>
        </div>

        {/* Pricing cards - Horizontal layout with overlap */}
        <div className="relative">
          <div className="grid lg:grid-cols-3 gap-4 lg:gap-0">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative bg-background border transition-all duration-700 ${
                  plan.highlight 
                    ? "border-foreground lg:-mx-2 lg:z-10 lg:scale-105" 
                    : "border-foreground/10 lg:first:-mr-2 lg:last:-ml-2"
                } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Popular badge */}
                {plan.highlight && (
                  <div className="absolute -top-4 left-8 right-8 flex justify-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-xs font-mono uppercase tracking-widest">
                      <Zap className="w-3 h-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8 lg:p-10">
                  {/* Plan header */}
                  <div className="mb-8 pb-8 border-b border-foreground/10">
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-2xl lg:text-3xl font-display mt-2">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    {plan.price.annual !== null ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl lg:text-6xl font-display">
                          ${plan.price.annual}
                        </span>
                        <span className="text-foreground/60 text-sm">{plan.period}</span>
                      </div>
                    ) : plan.price.monthly !== null ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl lg:text-6xl font-display">
                          ${plan.price.monthly}
                        </span>
                        <span className="text-foreground/60 text-sm">{plan.period}</span>
                      </div>
                    ) : (
                      <span className="text-4xl font-display">Personalizado</span>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-10">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-[#eca8d6] mt-0.5 shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    className={`w-full py-4 flex items-center justify-center gap-2 text-sm font-medium transition-all group ${
                      plan.highlight
                        ? "bg-foreground text-background hover:bg-foreground/90"
                        : "border border-foreground/20 text-foreground hover:border-foreground hover:bg-foreground/5"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom note with icons */}
        <div className={`mt-20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 pt-12 border-t border-foreground/10 transition-all duration-1000 delay-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}>
          <div className="flex flex-wrap gap-6 text-sm text-foreground/60">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              Código Abierto
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              Soporte Local
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              Comunidad Activa
            </span>
          </div>
          <a href="mailto:info@sarfbio.org" className="text-sm underline underline-offset-4 hover:text-foreground transition-colors">
            Consultas especiales
          </a>
        </div>
      </div>

      <style jsx>{`
        .text-stroke {
          -webkit-text-stroke: 1.5px currentColor;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </section>
  );
}
