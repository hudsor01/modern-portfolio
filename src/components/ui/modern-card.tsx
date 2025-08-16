import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const modernCardVariants = cva(
  'relative rounded-xl border transition-all duration-300 ease-out backdrop-blur-sm',
  {
    variants: {
      variant: {
        // Glassmorphism default cards
        default: 'bg-gray-800/50 border-gray-700 shadow-lg hover:border-cyan-500/50 hover:-translate-y-1',
        
        // Elevated glassmorphism cards
        elevated: 'bg-gray-800/60 border-gray-700 shadow-xl hover:border-cyan-500/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10',
        
        // Subtle background cards
        subtle: 'bg-gray-900/30 border-gray-800 shadow-sm hover:bg-gray-800/40 hover:border-gray-700',
        
        // Interactive cards with modern hover states
        interactive: 'bg-gray-800/50 border-gray-700 shadow-lg hover:border-cyan-500/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer',
        
        // Primary accent cards with cyan gradients
        primary: 'bg-gradient-to-br from-cyan-900/20 via-gray-800/50 to-gray-800/50 border-cyan-500/30 shadow-lg hover:border-cyan-400 hover:shadow-cyan-500/25',
        
        // Highlight cards for key content
        highlight: 'bg-gradient-to-br from-blue-900/20 via-gray-800/60 to-gray-800/60 border-blue-500/30 shadow-xl hover:border-blue-400 hover:shadow-blue-500/25',
        
        // Success state cards
        success: 'bg-gradient-to-br from-emerald-900/20 via-gray-800/50 to-gray-800/50 border-emerald-500/30 shadow-lg hover:border-emerald-400',
        
        // Outline style with modern glassmorphism
        outline: 'bg-gray-900/20 border-gray-600 hover:bg-gray-800/30 hover:border-cyan-500/50'
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
    className={cn('text-xl md:text-2xl font-bold leading-none tracking-tight text-white', className)}
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
    className={cn('text-base md:text-lg text-gray-300 leading-relaxed', className)}
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
    className={cn('flex items-center pt-4 border-t border-gray-700/30', className)}
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