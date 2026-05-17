'use client'
// components/landing/ExplodedViewSVG.tsx
import React from 'react'
import { motion, useTransform } from 'framer-motion'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { Cpu, CircleDot, Droplet, Battery, Radio } from 'lucide-react'
import type { TechBreakdownContent } from '@/types/content'

interface Props {
  content: TechBreakdownContent
}

export function ExplodedViewSVG({ content }: Props) {
  const { scrollYProgress } = useScrollProgress()
  
  // Transformaciones de explosión basadas en el scroll
  // Rango del scroll aproximado para la sección (ej. 0.55 a 0.8)
  const yBrain = useTransform(scrollYProgress, [0.55, 0.8], [0, -100])
  const yTraction = useTransform(scrollYProgress, [0.55, 0.8], [0, 100])
  const xApplication = useTransform(scrollYProgress, [0.55, 0.8], [0, -100])
  const xPower = useTransform(scrollYProgress, [0.55, 0.8], [0, 100])

  return (
    <div className="relative w-full max-w-lg mx-auto h-[600px] bg-[#020617]/50 rounded-[2.5rem] border border-white/5 overflow-hidden flex items-center justify-center shadow-2xl p-6">
      {/* Fondo Blueprint Grid */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Líneas de Escala e Indicadores High-Tech */}
      <div className="absolute inset-6 border border-white/10 rounded-[2rem] pointer-events-none flex flex-col justify-between p-4">
        <div className="flex justify-between text-[10px] font-mono text-white/30">
          <span>MODEL: SARFBIO-01</span>
          <span>SCALE: 1:10</span>
        </div>
        <div className="flex justify-between text-[10px] font-mono text-white/30">
          <span>DESENSAMBLADO MULTIAXIAL</span>
          <span>ESTADO: ONLINE</span>
        </div>
      </div>

      {/* Contenedor Central del Diagrama */}
      <div className="relative w-full h-full flex items-center justify-center">
        
        {/* Línea Central de Enlace (Guía del Blueprint) */}
        <div className="absolute w-[2px] h-[350px] bg-dashed bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none" />
        <div className="absolute h-[2px] w-[350px] bg-dashed bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

        {/* 1. CEREBRO / CONTROL (Top) */}
        <motion.div 
          style={{ y: yBrain }}
          className="absolute -translate-y-24 z-10 flex flex-col items-center group cursor-pointer"
        >
          <div className="w-16 h-16 bg-[#0f172a] border border-green-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.15)] group-hover:border-green-500/80 transition-colors duration-300">
            <Cpu className="text-bio-green w-8 h-8 animate-pulse" />
          </div>
          <span className="text-[10px] font-mono text-green-400 mt-2 bg-slate-950/80 px-2 py-0.5 rounded border border-green-500/20">
            CONTROL (ESP32)
          </span>
        </motion.div>

        {/* 2. TRACCIÓN / RUEDAS (Bottom) */}
        <motion.div 
          style={{ y: yTraction }}
          className="absolute translate-y-24 z-10 flex flex-col items-center group cursor-pointer"
        >
          <span className="text-[10px] font-mono text-amber-400 mb-2 bg-slate-950/80 px-2 py-0.5 rounded border border-amber-500/20">
            TRACCIÓN (4WD)
          </span>
          <div className="w-16 h-16 bg-[#0f172a] border border-amber-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.15)] group-hover:border-amber-500/80 transition-colors duration-300">
            <CircleDot className="text-[#f59e0b] w-8 h-8" />
          </div>
        </motion.div>

        {/* 3. APLICACIÓN / TANQUE (Left) */}
        <motion.div 
          style={{ x: xApplication }}
          className="absolute -translate-x-24 z-10 flex items-center gap-2 group cursor-pointer"
        >
          <div className="w-16 h-16 bg-[#0f172a] border border-blue-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.15)] group-hover:border-blue-500/80 transition-colors duration-300">
            <Droplet className="text-blue-400 w-8 h-8" />
          </div>
          <div className="flex flex-col items-start bg-slate-950/80 p-1.5 rounded border border-blue-500/20">
            <span className="text-[9px] font-mono text-blue-400 font-bold">APLICACIÓN</span>
            <span className="text-[8px] font-mono text-white/50">BioBox Spray</span>
          </div>
        </motion.div>

        {/* 4. POTENCIA / BATERÍA (Right) */}
        <motion.div 
          style={{ x: xPower }}
          className="absolute translate-x-24 z-10 flex items-center gap-2 group cursor-pointer flex-row-reverse"
        >
          <div className="w-16 h-16 bg-[#0f172a] border border-purple-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.15)] group-hover:border-purple-500/80 transition-colors duration-300">
            <Battery className="text-purple-400 w-8 h-8" />
          </div>
          <div className="flex flex-col items-end bg-slate-950/80 p-1.5 rounded border border-purple-500/20">
            <span className="text-[9px] font-mono text-purple-400 font-bold">POTENCIA</span>
            <span className="text-[8px] font-mono text-white/50">LiPo 12V 4Ah</span>
          </div>
        </motion.div>

        {/* Núcleo Central Estático (Enlace de control de telemetría) */}
        <div className="w-8 h-8 bg-slate-900 border border-white/20 rounded-full flex items-center justify-center z-0 shadow-lg">
          <Radio className="text-white/40 w-4 h-4" />
        </div>

      </div>
    </div>
  )
}
