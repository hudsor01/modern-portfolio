'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const sectionCardVariants = cva(
  'flex flex-col rounded-2xl border transition-all duration-300 ease-out',
  {
    variants: {
      variant: {
        default: 'bg-card border-border shadow-sm',
        glass: 'glass border-border/50 shadow-sm backdrop-blur-sm',
        gradient: 'bg-gradient-to-br from-card via-card to-muted/50 border-border shadow-md',
      },
      padding: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
)

const sectionCardHeaderVariants = cva('flex flex-col space-y-2', {
  variants: {
    padding: {
      sm: 'mb-3',
      md: 'mb-4',
      lg: 'mb-6',
    },
  },
  defaultVariants: {
    padding: 'md',
  },
})

const sectionCardTitleVariants = cva('font-display font-semibold leading-tight text-foreground', {
  variants: {
    padding: {
      sm: 'text-lg',
      md: 'text-xl',
      lg: 'text-2xl',
    },
  },
  defaultVariants: {
    padding: 'md',
  },
})

const sectionCardDescriptionVariants = cva('text-muted-foreground leading-relaxed', {
  variants: {
    padding: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    padding: 'md',
  },
})

interface SectionCardProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof sectionCardVariants> {
  title: string
  description?: string
  children: React.ReactNode
}

const SectionCard = React.forwardRef<HTMLDivElement, SectionCardProps>(
  ({ className, variant, padding, title, description, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(sectionCardVariants({ variant, padding }), className)}
        {...props}
      >
        <div className={cn(sectionCardHeaderVariants({ padding }))}>
          <h3 className={cn(sectionCardTitleVariants({ padding }))}>{title}</h3>
          {description && (
            <p className={cn(sectionCardDescriptionVariants({ padding }))}>{description}</p>
          )}
        </div>
        <div className="flex-1">{children}</div>
      </div>
    )
  }
)

SectionCard.displayName = 'SectionCard'

export { SectionCard, sectionCardVariants }
export type { SectionCardProps }
