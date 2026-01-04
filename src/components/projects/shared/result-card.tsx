'use client'

import { cn } from '@/lib/utils'

export interface ResultCardProps {
  /** The main value to display */
  value: string
  /** Label describing the value */
  label: string
  /** Color variant */
  variant?: 'primary' | 'secondary' | 'accent'
  className?: string
}

const variantStyles = {
  primary: {
    bg: 'bg-primary/5',
    border: 'border-primary/20',
    valueColor: 'text-primary',
  },
  secondary: {
    bg: 'bg-secondary/5',
    border: 'border-secondary/20',
    valueColor: 'text-secondary',
  },
  accent: {
    bg: 'bg-accent/10',
    border: 'border-accent/20',
    valueColor: 'text-accent-foreground',
  },
}

export function ResultCard({
  value,
  label,
  variant = 'primary',
  className,
}: ResultCardProps) {
  const styles = variantStyles[variant]

  return (
    <div
      className={cn(
        'rounded-xl p-6 text-center border',
        styles.bg,
        styles.border,
        className
      )}
    >
      <div className={cn('font-display text-2xl font-semibold mb-2', styles.valueColor)}>
        {value}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}
