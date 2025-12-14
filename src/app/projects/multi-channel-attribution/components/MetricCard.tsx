'use client'


import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  icon: LucideIcon
  label: string
  value: string
  subtitle: string | React.ReactNode
  gradientFrom: string
  gradientTo: string
  iconBgClass: string
  iconColorClass: string
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  subtitle,
  gradientFrom,
  gradientTo,
  iconBgClass,
  iconColorClass,
}: MetricCardProps) {
  return (
    <div
      className="relative group"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300`} />
      <div className="relative glass-interactive rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 ${iconBgClass} rounded-xl`}>
            <Icon className={`h-6 w-6 ${iconColorClass}`} />
          </div>
          <span className="typography-small text-muted-foreground uppercase tracking-wider">{label}</span>
        </div>
        <p className="typography-h2 border-none pb-0 text-2xl mb-1">{value}</p>
        {typeof subtitle === 'string' ? (
          <p className="typography-small text-muted-foreground">{subtitle}</p>
        ) : (
          subtitle
        )}
      </div>
    </div>
  )
}
