'use client'

import React, { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionContainerProps {
  children: ReactNode
  className?: string
  variant?: 'primary' | 'secondary'
  id?: string
  noGap?: boolean
}

/**
 * Section container for consistent styling and background alternation
 * Use this component to wrap all main sections of the site
 */
export function SectionContainer({
  children,
  className,
  variant = 'primary',
  id,
  noGap = false,
}: SectionContainerProps) {
  return (
    <section
      id={id}
      className={cn(
        'section-transition relative overflow-visible',
        noGap ? 'py-0' : 'py-20 md:py-28 lg:py-32',
        variant === 'primary' ? 'section-bg-primary' : 'section-bg-secondary',
        // Subtle section divider
        variant === 'primary'
          ? 'border-b border-slate-100 dark:border-slate-800/30'
          : 'border-b border-slate-200/30 dark:border-slate-700/20',
        className
      )}
    >
      {/* Subtle gradient overlay for better section transition */}
      {variant === 'secondary' && (
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/10 to-transparent dark:from-blue-900/5 dark:to-transparent pointer-events-none"></div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">{children}</div>
    </section>
  )
}
