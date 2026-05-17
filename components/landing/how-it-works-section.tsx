"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    number: "01",
    title: "Mapeo",
    subtitle: "del Cultivo",
    description: "SARFBIO detecta y mapea las plantas identificando puntos óptimos para la aplicación del biopreparado.",
  },
  {
    number: "02",
    title: "Preparación",
    subtitle: "del Biopreparado",
    description: "Carga los biopreparados y calibra la dosificación según tus especificaciones y necesidades del cultivo.",
  },
  {
    number: "03",
    title: "Aplicación",
    subtitle: "Autónoma",
    description: "SARFBIO navega automáticamente aplicando biopreparados con precisión milimétrica en cada planta.",
  },
  {
    number: "04",
    title: "Monitoreo",
    subtitle: "& Datos",
    description: "Registra datos de aplicación, humedad y salud del cultivo para optimización continua y trazabilidad.",
  },
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-card overflow-hidden"
    >
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/[0.05] blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header — titre + image cerisier */}
        <div className="relative mb-0 lg:mb-0 grid lg:grid-cols-2 gap-4 lg:gap-12 items-end">
          {/* Titre colonne gauche */}
          <div className="overflow-hidden pb-0 lg:pb-32">
            <div className={`transition-all duration-1000 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"}`}>
              <span className="inline-flex items-center gap-3 text-sm font-mono text-foreground/50 mb-8">
                <span className="w-12 h-px bg-primary/50" />
                Cómo Funciona
              </span>
            </div>
            
            <h2 className={`text-5xl md:text-6xl lg:text-7xl font-display tracking-tight leading-tight transition-all duration-1000 delay-100 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
            }`}>
              <span className="block">Proceso simple</span>
              <span className="block">en 4 pasos</span>
            </h2>
          </div>


        </div>

        {/* Steps Layout - 4 columns or responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-20">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`relative text-left p-8 border rounded-lg transition-all duration-500 ${
                activeStep === index 
                  ? "bg-primary/10 border-primary/50 shadow-lg shadow-primary/20" 
                  : "bg-background border-border hover:border-primary/30"
              }`}
            >
              {/* Step number */}
              <span className={`text-5xl font-display transition-colors duration-300 ${
                activeStep === index ? "text-primary" : "text-foreground/20"
              }`}>
                {step.number}
              </span>

              {/* Title */}
              <h3 className="text-2xl lg:text-3xl font-display mt-6 mb-2 text-foreground">
                {step.title}
              </h3>
              <span className="text-lg text-foreground/60 font-display block mb-4">
                {step.subtitle}
              </span>

              {/* Description */}
              <p className={`text-foreground/70 leading-relaxed transition-opacity duration-300 ${
                activeStep === index ? "opacity-100" : "opacity-80"
              }`}>
                {step.description}
              </p>

              {/* Active indicator line */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-primary transition-transform duration-500 origin-left rounded-t-lg ${
                activeStep === index ? "scale-x-100" : "scale-x-0"
              }`} />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-progress {
          animation: progress 6s linear forwards;
        }
      `}</style>
    </section>
  );
}
