'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface FeatureCardProps {
  /** Card title */
  title: string
  /** Card content - typically a list */
  children: ReactNode
  className?: string
}

export function FeatureCard({ title, children, className }: FeatureCardProps) {
  return (
    <div className={cn('bg-muted/50 rounded-xl p-6 border border-border', className)}>
      <h3 className={'font-semibold mb-3'}>{title}</h3>
      {children}
    </div>
  )
}
