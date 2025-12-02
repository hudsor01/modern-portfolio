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
    'animate-pulse': pulse && !shimmer,
  })

  // Determine variant-specific classes with modern design
  const variantClasses = {
    default: 'h-4 w-full',
    text: 'h-4 w-full',
    card: 'h-[320px] w-full rounded-xl',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-10 w-24 rounded-lg',
    image: 'aspect-video w-full rounded-lg',
    table: 'h-8 w-full',
  }

  return (
    <div
      data-slot="skeleton"
      data-variant={variant}
      className={cn(
        'bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg',
        animationClasses,
        variantClasses[variant],
        shimmer && 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-600/20 before:to-transparent',
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
