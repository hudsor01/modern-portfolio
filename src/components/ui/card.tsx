'use client'

import type * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const cardVariants = cva(
  'flex flex-col rounded-md border text-card-foreground transition-all duration-300 ease-out',
  {
    variants: {
      variant: {
        default: 'bg-card shadow-sm border-border',
        luxury:
          'bg-card border-border shadow-sm hover:border-border-hover hover:shadow-md hover:-translate-y-1',
        elevated: 'bg-card border-border shadow-md hover:shadow-lg hover:-translate-y-1',
        primary: 'bg-primary/5 border-primary/20 shadow-sm hover:border-primary/40 hover:shadow-md',
        stat: 'bg-card border-border p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-1',
        outline: 'bg-transparent border-border hover:bg-card/50 hover:border-border-hover',
      },
      size: {
        sm: 'gap-4 py-4',
        default: 'gap-6 py-6',
        lg: 'gap-8 py-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Card({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof cardVariants>) {
  return (
    <div data-slot="card" className={cn(cardVariants({ variant, size }), className)} {...props} />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className
      )}
      {...props}
    />
  )
}

// Polymorphic via `as` so consumers can render CardTitle as the correct
// semantic heading for the document outline (h2/h3/etc.) without forking
// the styling. Defaults to <div> for backwards compatibility with existing
// consumers that don't need a heading (e.g. dashboards, status panels).
type CardTitleProps<T extends React.ElementType = 'div'> = {
  as?: T
} & Omit<React.ComponentPropsWithoutRef<T>, 'as'>

function CardTitle<T extends React.ElementType = 'div'>({
  as,
  className,
  ...props
}: CardTitleProps<T>) {
  const Component = (as ?? 'div') as React.ElementType
  return (
    <Component
      data-slot="card-title"
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('px-6', className)} {...props} />
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent }
