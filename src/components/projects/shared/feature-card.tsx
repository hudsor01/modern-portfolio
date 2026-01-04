'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface FeatureCardProps {
  /** Card title */
  title: string
  /** Title color variant */
  titleVariant?: 'primary' | 'secondary' | 'accent'
  /** Card content - typically a list */
  children: ReactNode
  className?: string
}

const titleColorMap = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  accent: 'text-accent-foreground',
}

export function FeatureCard({
  title,
  titleVariant = 'primary',
  children,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        'bg-muted/50 rounded-xl p-6 border border-border',
        className
      )}
    >
      <h3 className={cn('font-semibold mb-3', titleColorMap[titleVariant])}>
        {title}
      </h3>
      {children}
    </div>
  )
}
