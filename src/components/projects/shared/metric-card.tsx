'use client'

import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface MetricCardProps {
  icon: LucideIcon
  label: string
  value: string
  subtitle: ReactNode
  /** Optional variant for different accent colors */
  variant?: 'primary' | 'secondary' | 'accent'
  /** Custom animation delay for staggered animations */
  animationDelay?: number
  className?: string
}

const variantStyles = {
  primary: {
    gradient: 'from-primary/20 to-primary/5',
    iconBg: 'bg-primary/15',
    iconColor: 'text-primary',
  },
  secondary: {
    gradient: 'from-secondary/20 to-secondary/5',
    iconBg: 'bg-secondary/15',
    iconColor: 'text-secondary',
  },
  accent: {
    gradient: 'from-accent/20 to-accent/5',
    iconBg: 'bg-accent/15',
    iconColor: 'text-accent-foreground',
  },
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  subtitle,
  variant = 'primary',
  animationDelay = 0,
  className,
}: MetricCardProps) {
  const styles = variantStyles[variant]

  return (
    <div
      className={cn('relative group animate-fade-in-up', className)}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Subtle glow effect */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-r rounded-xl blur-xl opacity-20 group-hover:opacity-35 transition-opacity duration-300',
          styles.gradient
        )}
      />
      {/* Card content */}
      <div className="relative bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className={cn('p-3 rounded-xl', styles.iconBg)}>
            <Icon className={cn('h-6 w-6', styles.iconColor)} />
          </div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </span>
        </div>
        <p className="font-display text-2xl font-semibold text-foreground mb-1">{value}</p>
        <div className="text-sm text-muted-foreground">{subtitle}</div>
      </div>
    </div>
  )
}
