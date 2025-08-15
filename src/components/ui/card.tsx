import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const cardVariants = cva(
  [
    "rounded-xl border shadow-sm transition-all duration-200",
    "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
    "@media (prefers-reduced-motion: reduce) { transition-duration: 0.01ms }",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-card text-card-foreground border-border",
          "hover:shadow-md hover:border-border/80",
        ],
        elevated: [
          "bg-card text-card-foreground border-border shadow-lg",
          "hover:shadow-xl hover:-translate-y-1",
        ],
        ghost: [
          "bg-transparent border-transparent",
          "hover:bg-card hover:border-border",
        ],
        outline: [
          "bg-transparent border-2 border-border",
          "hover:bg-card/50 hover:border-primary/30",
        ],
        glass: [
          "bg-white/5 backdrop-blur border border-white/10",
          "hover:bg-white/10 hover:border-white/20",
          "shadow-xl shadow-black/5",
        ],
        gradient: [
          "bg-gradient-to-br from-card via-card to-card/80",
          "border-border/50 shadow-lg",
          "hover:shadow-xl hover:from-card/90 hover:via-card/90 hover:to-card/70",
        ],
        interactive: [
          "bg-card text-card-foreground border-border cursor-pointer",
          "hover:shadow-lg hover:scale-[1.02] hover:border-primary/30",
          "active:scale-[0.98] transition-transform",
        ],
      },
      size: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
      spacing: {
        none: "gap-0",
        sm: "gap-3",
        default: "gap-6",
        lg: "gap-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      spacing: "default",
    },
  }
)

interface CardProps 
  extends React.ComponentProps<'div'>,
    VariantProps<typeof cardVariants> {
  withGradient?: boolean
  interactive?: boolean
  loading?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant, 
    size, 
    spacing,
    withGradient = false, 
    interactive = false,
    loading = false,
    children,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card"
        className={cn(
          cardVariants({ 
            variant: interactive ? "interactive" : variant, 
            size, 
            spacing 
          }),
          withGradient && "card-hover",
          loading && "animate-pulse",
          "flex flex-col",
          className
        )}
        style={withGradient ? { backgroundImage: 'var(--card-gradient)' } : undefined}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        {...props}
      >
        {loading ? (
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
          </div>
        ) : (
          children
        )}
      </div>
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    centered?: boolean
  }
>(({ className, centered = false, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn(
        'flex flex-col gap-1.5',
        centered && 'text-center items-center',
        className
      )}
      {...props}
    />
  )
})
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    gradient?: boolean
    size?: 'sm' | 'default' | 'lg' | 'xl'
  }
>(({ className, gradient = false, size = 'default', ...props }, ref) => {
  const sizeClasses = {
    sm: 'text-lg font-semibold',
    default: 'text-xl font-semibold',
    lg: 'text-2xl font-bold',
    xl: 'text-3xl font-bold',
  }

  return (
    <div
      ref={ref}
      data-slot="card-title"
      className={cn(
        'leading-none tracking-tight',
        sizeClasses[size],
        gradient && 'bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent',
        className
      )}
      {...props}
    />
  )
})
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    muted?: boolean
  }
>(({ className, muted = true, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="card-description"
      className={cn(
        'text-sm leading-relaxed',
        muted ? 'text-muted-foreground' : 'text-foreground',
        className
      )}
      {...props}
    />
  )
})
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    padded?: boolean
  }
>(({ className, padded = false, ...props }, ref) => {
  return (
    <div 
      ref={ref}
      data-slot="card-content" 
      className={cn(
        'flex-1',
        padded && 'p-6',
        className
      )} 
      {...props} 
    />
  )
})
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    justify?: 'start' | 'center' | 'end' | 'between'
  }
>(({ className, justify = 'start', ...props }, ref) => {
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
  }

  return (
    <div 
      ref={ref}
      data-slot="card-footer" 
      className={cn(
        'flex items-center gap-3 mt-auto',
        justifyClasses[justify],
        className
      )} 
      {...props} 
    />
  )
})
CardFooter.displayName = "CardFooter"

// Specialized card components
const StatsCard = React.forwardRef<
  HTMLDivElement,
  Omit<CardProps, 'children'> & {
    title: string
    value: string | number
    description?: string
    icon?: React.ReactNode
    trend?: {
      value: number
      label: string
      direction: 'up' | 'down' | 'neutral'
    }
    color?: 'default' | 'success' | 'warning' | 'error'
  }
>(({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  color = 'default',
  className,
  ...props 
}, ref) => {
  const colorClasses = {
    default: 'text-foreground',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    error: 'text-red-600 dark:text-red-400',
  }

  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-muted-foreground',
  }

  return (
    <Card ref={ref} className={cn("relative", className)} {...props}>
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle size="sm" className="text-muted-foreground font-medium">
          {title}
        </CardTitle>
        {icon && (
          <div className={cn("p-2 rounded-md bg-muted", colorClasses[color])}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent className="pb-2">
        <div className={cn("text-3xl font-bold", colorClasses[color])}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {description && (
          <CardDescription className="mt-1">
            {description}
          </CardDescription>
        )}
      </CardContent>
      {trend && (
        <CardFooter>
          <div className={cn("text-sm font-medium", trendColors[trend.direction])}>
            {trend.direction === 'up' ? '↗' : trend.direction === 'down' ? '↘' : '→'} {trend.value}%
          </div>
          <div className="text-sm text-muted-foreground">{trend.label}</div>
        </CardFooter>
      )}
    </Card>
  )
})
StatsCard.displayName = "StatsCard"

const FeatureCard = React.forwardRef<
  HTMLDivElement,
  Omit<CardProps, 'children'> & {
    title: string
    description: string
    icon?: React.ReactNode
    action?: React.ReactNode
    badge?: string
  }
>(({ title, description, icon, action, badge, className, ...props }, ref) => {
  return (
    <Card ref={ref} className={cn("group", className)} {...props}>
      <CardHeader className="text-center">
        {badge && (
          <div className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary mb-2">
            {badge}
          </div>
        )}
        {icon && (
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            {icon}
          </div>
        )}
        <CardTitle size="lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <CardDescription>{description}</CardDescription>
      </CardContent>
      {action && (
        <CardFooter justify="center">
          {action}
        </CardFooter>
      )}
    </Card>
  )
})
FeatureCard.displayName = "FeatureCard"

const TestimonialCard = React.forwardRef<
  HTMLDivElement,
  Omit<CardProps, 'children'> & {
    quote: string
    author: {
      name: string
      title?: string
      avatar?: string
    }
    rating?: number
  }
>(({ quote, author, rating, className, ...props }, ref) => {
  return (
    <Card ref={ref} variant="elevated" className={className} {...props}>
      <CardContent>
        {rating && (
          <div className="flex gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < rating ? "text-yellow-400" : "text-gray-300"
                )}
              >
                ★
              </div>
            ))}
          </div>
        )}
        <blockquote className="text-lg leading-relaxed mb-6">
          "{quote}"
        </blockquote>
        <div className="flex items-center gap-3">
          {author.avatar && (
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Image 
                src={author.avatar} 
                alt={author.name}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            </div>
          )}
          <div>
            <div className="font-semibold">{author.name}</div>
            {author.title && (
              <div className="text-sm text-muted-foreground">{author.title}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
TestimonialCard.displayName = "TestimonialCard"

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  StatsCard,
  FeatureCard,
  TestimonialCard,
  cardVariants
}
export type { CardProps }