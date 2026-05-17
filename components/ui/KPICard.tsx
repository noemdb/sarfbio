// components/ui/KPICard.tsx — Spec: spec_driven_v01.md Tarea 3.1
import { AnimatedCounter } from './AnimatedCounter'
import type { KPIMetric } from '@/types/content'

interface KPICardProps {
  metric: KPIMetric
  animate?: boolean
}

export function KPICard({ metric, animate = true }: KPICardProps) {
  const colorMap = {
    green: {
      text: 'var(--color-bio-green)',
      border: 'rgba(34,197,94,0.25)',
      bg: 'rgba(34,197,94,0.06)',
    },
    amber: {
      text: 'var(--color-soil-amber)',
      border: 'rgba(245,158,11,0.25)',
      bg: 'rgba(245,158,11,0.06)',
    },
    white: {
      text: 'var(--color-mist-white)',
      border: 'rgba(255,255,255,0.15)',
      bg: 'rgba(255,255,255,0.04)',
    },
  }

  const colors = colorMap[metric.color]
  const numericValue =
    typeof metric.value === 'number' ? metric.value : parseFloat(metric.value)

  return (
    <div
      className="rounded-2xl p-6 transition-transform duration-300 hover:scale-[1.02] backdrop-blur-sm"
      style={{
        border: `1px solid ${colors.border}`,
        background: colors.bg,
      }}
    >
      <div
        className="text-5xl font-black tracking-tighter leading-none mb-2"
        style={{ fontFamily: 'var(--font-display)', color: colors.text }}
      >
        {animate ? (
          <AnimatedCounter
            value={numericValue}
            decimals={Number.isInteger(numericValue) ? 0 : 1}
            suffix={metric.unit ?? ''}
          />
        ) : (
          <span>
            {metric.value}
            {metric.unit}
          </span>
        )}
      </div>
      <p className="text-sm font-semibold text-white/90 mb-1">{metric.label}</p>
      <p className="text-xs text-white/50">{metric.description}</p>
    </div>
  )
}
