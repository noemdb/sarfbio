"use client";

import { useEffect, useState, useRef } from "react";

const teamMembers = [
  {
    id: "founder1",
    name: "Dr. Carlos Martínez",
    role: "Fundador & Agrónomo",
    expertise: "Agronomía, Biopreparados",
    bio: "Especialista en biopreparados y agricultura orgánica con 15 años de experiencia en campo.",
  },
  {
    id: "founder2",
    name: "Ing. María González",
    role: "CTO & Ingeniera Robótica",
    expertise: "Robótica, Automatización",
    bio: "Ingeniera con especialidad en robótica agrícola y sistemas autónomos.",
  },
  {
    id: "founder3",
    name: "Arq. Felipe Rodríguez",
    role: "Diseño & Comunidad",
    expertise: "Hardware Abierto, Diseño",
    bio: "Especialista en diseño abierto y construcción de comunidades de makers.",
  },
];

export function TeamSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
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

  return (
    <section
      id="team"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-24 lg:mb-32">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-foreground/50 mb-8">
            <span className="w-12 h-px bg-primary/50" />
            Equipo
          </span>
          <h2 className={`text-5xl md:text-6xl lg:text-7xl font-display tracking-tight leading-tight transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}>
            Equipo Detrás de SARFBIO
          </h2>
          <p className={`text-lg text-foreground/70 mt-6 max-w-2xl transition-all duration-1000 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}>
            Agrónomos, ingenieros y diseñadores apasionados por agricultura sustentable e innovación abierta.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className={`group relative rounded-xl overflow-hidden transition-all duration-500 ${
                isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
              }}
              onMouseEnter={() => setHoveredId(member.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Background Card */}
              <div className="bg-card border border-border rounded-xl p-8 h-full flex flex-col relative">
                {/* Hover background effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="relative z-10">
                  {/* Avatar placeholder */}
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 mb-6 flex items-center justify-center text-2xl font-display text-primary">
                    {member.name.charAt(0)}
                  </div>

                  {/* Name */}
                  <h3 className="text-2xl font-display text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {member.name}
                  </h3>

                  {/* Role */}
                  <p className="text-primary text-sm font-mono mb-4">
                    {member.role}
                  </p>

                  {/* Expertise */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {member.expertise.split(", ").map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Bio */}
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                {/* Bottom border highlight on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className={`mt-20 pt-16 border-t border-border transition-all duration-1000 delay-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}>
          <div className="text-center">
            <h3 className="text-2xl lg:text-3xl font-display text-foreground mb-4">
              Únete a la comunidad SARFBIO
            </h3>
            <p className="text-foreground/70 mb-8 max-w-2xl mx-auto">
              Estamos buscando contribuidores, desarrolladores y agricultores interesados en revolucionar la agricultura con nosotros.
            </p>
            <a
              href="https://github.com/sarfbio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-300 font-medium"
            >
              Colaborar en GitHub
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
