import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const professionalCardVariants = cva(
  'relative rounded-lg border transition-all duration-200 ease-out',
  {
    variants: {
      variant: {
        // Default professional card - clean and corporate
        default: 'bg-slate-800/95 border-slate-700/60 shadow-lg hover:bg-slate-700/95 hover:border-slate-600/80',
        
        // Elevated cards for important content like achievements
        elevated: 'bg-slate-800/98 border-slate-600/70 shadow-xl hover:bg-slate-700/98 hover:border-slate-500/90 hover:shadow-2xl',
        
        // Subtle background cards
        subtle: 'bg-slate-900/60 border-slate-800/60 shadow-sm hover:bg-slate-800/70 hover:border-slate-700/80',
        
        // Interactive cards with professional hover states
        interactive: 'bg-slate-800/95 border-slate-700/60 shadow-lg hover:bg-slate-700/95 hover:border-blue-600/40 hover:shadow-xl cursor-pointer',
        
        // Primary cards for key CTAs and important content
        primary: 'bg-gradient-to-br from-blue-950/60 via-slate-800/95 to-slate-800/95 border-blue-800/40 shadow-lg hover:border-blue-600/60 hover:shadow-blue-500/10',
        
        // Success/achievement cards for metrics display
        success: 'bg-gradient-to-br from-emerald-950/40 via-slate-800/95 to-slate-800/95 border-emerald-800/30 shadow-lg hover:border-emerald-600/50',
        
        // Clean outline style for minimal sections
        outline: 'bg-transparent border-slate-600/50 hover:bg-slate-800/20 hover:border-slate-500/70',

        // Professional white cards for light sections
        light: 'bg-white/98 border-slate-200 shadow-lg hover:bg-white hover:border-slate-300 text-slate-900',
        
        // Achievement highlight cards
        highlight: 'bg-gradient-to-br from-slate-800/98 via-slate-700/95 to-slate-800/95 border-slate-600/80 shadow-xl hover:shadow-2xl'
      },
      size: {
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
        xl: 'p-10'
      },
      spacing: {
        tight: 'space-y-3',
        default: 'space-y-4', 
        relaxed: 'space-y-6',
        loose: 'space-y-8'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      spacing: 'default'
    }
  }
)

export interface ProfessionalCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof professionalCardVariants> {
  asChild?: boolean
}

const ProfessionalCard = React.forwardRef<HTMLDivElement, ProfessionalCardProps>(
  ({ className, variant, size, spacing, asChild: _asChild = false, ...props }, ref) => {
    return (
      <div
        className={cn(professionalCardVariants({ variant, size, spacing, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
ProfessionalCard.displayName = 'ProfessionalCard'

// Header component for professional cards
const ProfessionalCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-2 pb-4', className)}
    {...props}
  />
))
ProfessionalCardHeader.displayName = 'ProfessionalCardHeader'

// Title component with professional typography
const ProfessionalCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-xl font-semibold leading-tight tracking-tight text-white', className)}
    {...props}
  />
))
ProfessionalCardTitle.displayName = 'ProfessionalCardTitle'

// Subtitle for role/company information
const ProfessionalCardSubtitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm font-medium text-blue-400', className)}
    {...props}
  />
))
ProfessionalCardSubtitle.displayName = 'ProfessionalCardSubtitle'

// Description component with professional text styling
const ProfessionalCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-slate-300 leading-relaxed', className)}
    {...props}
  />
))
ProfessionalCardDescription.displayName = 'ProfessionalCardDescription'

// Content component
const ProfessionalCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pt-0', className)} {...props} />
))
ProfessionalCardContent.displayName = 'ProfessionalCardContent'

// Footer component with professional styling
const ProfessionalCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center justify-between pt-4 border-t border-slate-700/30', className)}
    {...props}
  />
))
ProfessionalCardFooter.displayName = 'ProfessionalCardFooter'

// Stats/metrics display component
const ProfessionalCardStats = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { 
    value: string
    label: string
    trend?: 'up' | 'down' | 'neutral'
  }
>(({ className, value, label, trend, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-center', className)}
    {...props}
  >
    <div className="text-2xl font-bold text-white mb-1 font-mono">
      {value}
    </div>
    <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">
      {label}
    </div>
    {trend && (
      <div className={cn(
        'text-xs mt-1',
        trend === 'up' && 'text-emerald-400',
        trend === 'down' && 'text-red-400',
        trend === 'neutral' && 'text-slate-400'
      )}>
        {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
      </div>
    )}
  </div>
))
ProfessionalCardStats.displayName = 'ProfessionalCardStats'

// Badge component for technologies, skills, etc.
const ProfessionalCardBadge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    variant?: 'default' | 'secondary' | 'success' | 'blue' | 'outline'
  }
>(({ className, variant = 'default', ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium',
      {
        'bg-slate-700 text-slate-300 border border-slate-600': variant === 'default',
        'bg-slate-600 text-slate-200 border border-slate-500': variant === 'secondary', 
        'bg-emerald-900/50 text-emerald-300 border border-emerald-800/50': variant === 'success',
        'bg-blue-900/50 text-blue-300 border border-blue-800/50': variant === 'blue',
        'bg-transparent text-slate-400 border border-slate-600': variant === 'outline',
      },
      className
    )}
    {...props}
  />
))
ProfessionalCardBadge.displayName = 'ProfessionalCardBadge'

export {
  ProfessionalCard,
  ProfessionalCardHeader,
  ProfessionalCardFooter,
  ProfessionalCardTitle,
  ProfessionalCardSubtitle,
  ProfessionalCardDescription,
  ProfessionalCardContent,
  ProfessionalCardStats,
  ProfessionalCardBadge,
  professionalCardVariants
}