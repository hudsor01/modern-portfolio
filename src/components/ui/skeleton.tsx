import { cn } from '@/lib/utils'
import * as React from 'react'

type SkeletonVariant = 'default' | 'text' | 'card' | 'avatar' | 'button' | 'image' | 'table'

interface SkeletonProps extends React.ComponentProps<'div'> {
  /**
   * The variant of skeleton to display
   * @default 'default'
   */
  variant?: SkeletonVariant

  /**
   * Whether to show a shimmer effect
   * @default true
   */
  shimmer?: boolean

  /**
   * Whether to show a pulse animation
   * @default true
   */
  pulse?: boolean
}

function Skeleton({
  className,
  variant = 'default',
  shimmer = true,
  pulse = true,
  ...props
}: SkeletonProps) {
  // Determine animation classes based on props
  const animationClasses = cn({
    'animate-pulse': pulse,
    'animate-shimmer': shimmer && !pulse,
    'bg-gradient-to-r from-transparent via-primary/10 to-transparent bg-[length:400%_100%]':
      shimmer,
  })

  // Determine variant-specific classes
  const variantClasses = {
    default: 'h-4 w-full',
    text: 'h-4 w-full',
    card: 'h-[320px] w-full rounded-xl',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-10 w-24 rounded-md',
    image: 'aspect-video w-full rounded-md',
    table: 'h-8 w-full',
  }

  return (
    <div
      data-slot="skeleton"
      data-variant={variant}
      className={cn(
        'bg-primary/10 rounded-md',
        animationClasses,
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}

/**
 * Creates a group of skeleton placeholders for lists or grids
 */
function SkeletonGroup({
  count = 3,
  as: Component = 'div',
  variant = 'default',
  className,
  itemClassName,
  gap = 'gap-4',
  ...props
}: {
  count?: number
  as?: React.ElementType
  variant?: SkeletonVariant
  className?: string
  itemClassName?: string
  gap?: string
} & React.ComponentProps<'div'>) {
  return (
    <Component className={cn('flex flex-col', gap, className)} {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant={variant} className={itemClassName} />
      ))}
    </Component>
  )
}

export { Skeleton, SkeletonGroup }
