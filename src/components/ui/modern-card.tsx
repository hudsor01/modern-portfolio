import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const modernCardVariants = cva(
  'relative rounded-xl border transition-all duration-200 ease-out',
  {
    variants: {
      variant: {
        // Clean slate cards - primary style
        default: 'bg-slate-800/90 border-slate-700 shadow-lg hover:bg-slate-700/90 hover:border-slate-600',
        
        // Elevated cards for important content
        elevated: 'bg-slate-800/95 border-slate-600 shadow-xl hover:bg-slate-700/95 hover:border-slate-500 hover:shadow-2xl',
        
        // Subtle cards for background elements
        subtle: 'bg-slate-900/50 border-slate-800 shadow-sm hover:bg-slate-800/60 hover:border-slate-700',
        
        // Interactive cards with hover states
        interactive: 'bg-slate-800/90 border-slate-700 shadow-lg hover:bg-slate-700/90 hover:border-blue-600 hover:shadow-xl cursor-pointer',
        
        // Primary accent cards for key features
        primary: 'bg-gradient-to-br from-blue-900/40 via-slate-800/90 to-slate-800/90 border-blue-800/50 shadow-lg hover:border-blue-600 hover:shadow-blue-500/20',
        
        // Success state cards
        success: 'bg-gradient-to-br from-emerald-900/40 via-slate-800/90 to-slate-800/90 border-emerald-800/50 shadow-lg hover:border-emerald-600',
        
        // Outline style for minimal design
        outline: 'bg-transparent border-slate-600 hover:bg-slate-800/30 hover:border-slate-500'
      },
      size: {
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
        xl: 'p-10'
      },
      radius: {
        default: 'rounded-xl',
        lg: 'rounded-2xl',
        xl: 'rounded-3xl'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      radius: 'default'
    }
  }
)

export interface ModernCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof modernCardVariants> {
  asChild?: boolean
}

const ModernCard = React.forwardRef<HTMLDivElement, ModernCardProps>(
  ({ className, variant, size, radius, asChild: _asChild = false, ...props }, ref) => {
    return (
      <div
        className={cn(modernCardVariants({ variant, size, radius, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
ModernCard.displayName = 'ModernCard'

// Header component for cards
const ModernCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-2', className)}
    {...props}
  />
))
ModernCardHeader.displayName = 'ModernCardHeader'

// Title component
const ModernCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-xl font-semibold leading-none tracking-tight text-white', className)}
    {...props}
  />
))
ModernCardTitle.displayName = 'ModernCardTitle'

// Description component
const ModernCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-slate-300 leading-relaxed', className)}
    {...props}
  />
))
ModernCardDescription.displayName = 'ModernCardDescription'

// Content component
const ModernCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pt-0', className)} {...props} />
))
ModernCardContent.displayName = 'ModernCardContent'

// Footer component
const ModernCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-4 border-t border-slate-700/50', className)}
    {...props}
  />
))
ModernCardFooter.displayName = 'ModernCardFooter'

export {
  ModernCard,
  ModernCardHeader,
  ModernCardFooter,
  ModernCardTitle,
  ModernCardDescription,
  ModernCardContent,
  modernCardVariants
}