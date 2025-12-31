'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface SectionCardProps {
  /** Section title */
  title: string
  /** Title color variant */
  titleVariant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'muted'
  /** Card content */
  children: ReactNode
  /** Optional animation delay for staggered animations */
  animationDelay?: number
  className?: string
}

const titleColorMap = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  accent: 'text-accent-foreground',
  success: 'text-secondary', // Using secondary (forest green) for success
  warning: 'text-accent-foreground', // Using accent (bronze) for warning
  muted: 'text-muted-foreground',
}

export function SectionCard({
  title,
  titleVariant = 'primary',
  children,
  animationDelay = 0,
  className,
}: SectionCardProps) {
  return (
    <div
      className={cn(
        'bg-card border border-border rounded-2xl p-8 animate-fade-in-up',
        className
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <h2
        className={cn(
          'font-display text-xl font-semibold mb-6',
          titleColorMap[titleVariant]
        )}
      >
        {title}
      </h2>
      {children}
    </div>
  )
}
