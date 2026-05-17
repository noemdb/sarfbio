"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";

const footerLinks = {
  Producto: [
    { name: "Características", href: "#features" },
    { name: "Cómo Funciona", href: "#how-it-works" },
    { name: "Precios", href: "#pricing" },
    { name: "Validación", href: "#validation" },
  ],
  Comunidad: [
    { name: "Documentación", href: "https://github.com/sarfbio/docs" },
    { name: "GitHub", href: "https://github.com/sarfbio" },
    { name: "Discord", href: "#" },
    { name: "Estado", href: "#" },
  ],
  Empresa: [
    { name: "Acerca de", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Voluntarios", href: "#", badge: "¡Únete!" },
    { name: "Contacto", href: "mailto:info@sarfbio.org" },
  ],
  Legal: [
    { name: "Privacidad", href: "#" },
    { name: "Términos", href: "#" },
    { name: "Open Hardware", href: "#" },
  ],
};

const socialLinks = [
  { name: "GitHub", href: "https://github.com/sarfbio" },
  { name: "Discord", href: "#" },
  { name: "Twitter", href: "#" },
];

function AnimatedWaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(100, 200, 150, 0.3)";
      ctx.lineWidth = 1;

      for (let wave = 0; wave < 3; wave++) {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 5) {
          const y =
            height * 0.5 +
            Math.sin(x * 0.01 + time + wave * 0.5) * 30 +
            Math.sin(x * 0.02 + time * 1.5 + wave) * 20;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      time += 0.02;
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

export function FooterSection() {
  return (
    <footer className="relative bg-background">
      {/* Gradient banner */}
      <div className="relative w-full h-[240px] md:h-[300px] overflow-hidden bg-gradient-to-br from-primary/20 via-card to-accent/10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
      </div>

      {/* Footer content — black background, white text */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Main Footer */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="col-span-2">
              <a href="#" className="inline-flex items-center gap-3 mb-6">
                <img 
                  src="/sarfbio-logo.jpg" 
                  alt="SARFBIO" 
                  className="h-8 w-auto rounded"
                />
                <span className="text-2xl font-display text-foreground">SARFBIO</span>
              </a>

              <p className="text-foreground/60 leading-relaxed mb-8 max-w-xs text-sm">
                SARFBIO es un proyecto de código abierto dedicado a revolucionar la agricultura sustentable mediante robótica accesible e innovadora.
              </p>

              {/* Social Links */}
              <div className="flex gap-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-foreground/50 hover:text-foreground transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-medium text-foreground mb-6">{title}</h3>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-foreground/50 hover:text-foreground transition-colors inline-flex items-center gap-2"
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {link.name}
                        {"badge" in link && link.badge && (
                          <span className="text-xs px-2 py-0.5 bg-accent text-white rounded-full">
                            {link.badge}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-foreground/40">
            &copy; 2024 SARFBIO. Licenciado bajo Open Hardware License. Construido con amor por la agricultura.
          </p>

          <div className="flex items-center gap-4 text-sm text-white/30">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#eca8d6]" />
              All agents operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
