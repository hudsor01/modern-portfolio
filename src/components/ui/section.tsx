import React from 'react'
import { cn } from '@/lib/utils'
import { sectionStyles } from '@/lib/component-styles'
import { VariantProps } from 'class-variance-authority'

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionStyles> {
  as?: 'section' | 'div' | 'article'
  container?: boolean | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  id?: string
}

export function Section({
  as: Component = 'section',
  className,
  children,
  spacing,
  background,
  container,
  ...props
}: SectionProps) {
  const containerClass = container
    ? typeof container === 'boolean'
      ? 'container mx-auto px-4 sm:px-6 lg:px-8'
      : `container mx-auto px-4 sm:px-6 lg:px-8 ${
          container === 'sm'
            ? 'max-w-3xl'
            : container === 'md'
              ? 'max-w-4xl'
              : container === 'lg'
                ? 'max-w-6xl'
                : container === 'xl'
                  ? 'max-w-7xl'
                  : ''
        }`
    : ''

  return (
    <Component className={cn(sectionStyles({ spacing, background }), className)} {...props}>
      {container ? <div className={containerClass}>{children}</div> : children}
    </Component>
  )
}
