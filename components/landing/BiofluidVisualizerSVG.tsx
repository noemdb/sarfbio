'use client'
// components/landing/BiofluidVisualizerSVG.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { Droplets, Sprout, Combine } from 'lucide-react'

interface Props {
  mode: 'high' | 'low'
}

export function BiofluidVisualizerSVG({ mode }: Props) {
  // Animación del brazo/dispensador
  const dispenserVariants = {
    high: { y: 40 },
    low: { y: 160 }
  }

  return (
    <div className="relative w-full max-w-lg mx-auto h-[400px] bg-[#020617]/50 rounded-[2rem] border border-white/5 overflow-hidden flex flex-col items-center py-6 shadow-2xl">
      
      {/* Fondo y Grid Sutil */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='%23ffffff'/%3E%3C/svg%3E")`,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Dispensador (Brazo) */}
      <motion.div 
        variants={dispenserVariants}
        initial={false}
        animate={mode}
        transition={{ type: 'spring', stiffness: 50, damping: 15 }}
        className="absolute top-0 z-20 flex flex-col items-center"
      >
        <div className="w-1.5 h-24 bg-gradient-to-b from-slate-800 to-slate-500" />
        <div className="w-16 h-12 bg-slate-800 border border-slate-600 rounded-xl flex items-center justify-center relative shadow-[0_0_20px_rgba(34,197,94,0.2)]">
          <Combine className="text-bio-green w-6 h-6" />
          <div className="absolute -bottom-2 w-4 h-2 bg-slate-500 rounded-b-md" />
        </div>
      </motion.div>

      {/* Partículas Cayendo */}
      <div className="absolute inset-0 flex justify-center z-10 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: mode === 'high' ? 120 : 240 }}
            animate={{ 
              opacity: [0, 1, 0], 
              y: [mode === 'high' ? 120 : 240, mode === 'high' ? 260 : 320],
              x: Math.sin(i * 1.5) * 15
            }}
            transition={{
              duration: 1.2,
              delay: i * 0.2,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="absolute"
          >
            <Droplets 
              className="w-5 h-5 text-bio-green opacity-80" 
              style={{ filter: 'drop-shadow(0 0 6px rgba(34,197,94,0.8))' }} 
            />
          </motion.div>
        ))}
      </div>

      {/* Planta Objetivo */}
      <div className="absolute bottom-12 flex flex-col items-center z-0">
        <motion.div
           animate={{ 
             scale: mode === 'high' ? 1.1 : 1.0, 
             filter: mode === 'high' ? 'drop-shadow(0 0 20px rgba(34,197,94,0.4))' : 'drop-shadow(0 0 0px transparent)' 
           }}
           className="mb-4 z-10"
        >
          <Sprout className={`w-20 h-20 transition-colors duration-500 ${mode === 'high' ? 'text-green-400' : 'text-slate-600'}`} />
        </motion.div>
        
        {/* Raíz / Suelo */}
        <motion.div 
           animate={{ 
             scale: mode === 'low' ? 1.1 : 1.0, 
             backgroundColor: mode === 'low' ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.05)',
             boxShadow: mode === 'low' ? '0 0 30px rgba(34,197,94,0.5)' : 'none'
           }}
           className="w-40 h-8 rounded-full blur-[4px] transition-all duration-500 absolute bottom-[-10px] z-0"
        />
      </div>
    </div>
  )
}
