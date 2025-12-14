/**
 * AnimatedBackground Component
 * Reusable animated gradient background with blob animations
 * Used across project showcase pages for consistent visual effects
 */

import { cn } from '@/lib/utils'

export interface AnimatedBackgroundProps {
  /**
   * Primary blob color (top-right)
   * @default 'bg-primary'
   */
  primaryColor?: string
  /**
   * Secondary blob color (bottom-left)
   * @default 'bg-secondary'
   */
  secondaryColor?: string
  /**
   * Tertiary blob color (center)
   * @default 'bg-primary'
   */
  tertiaryColor?: string
  /**
   * Additional className for customization
   */
  className?: string
}

export function AnimatedBackground({
  primaryColor = 'bg-primary',
  secondaryColor = 'bg-secondary',
  tertiaryColor = 'bg-primary',
  className,
}: AnimatedBackgroundProps) {
  return (
    <div className={cn('fixed inset-0 overflow-hidden pointer-events-none', className)}>
      {/* Top-right blob */}
      <div
        className={cn(
          'absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob',
          primaryColor
        )}
      />
      {/* Bottom-left blob */}
      <div
        className={cn(
          'absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000',
          secondaryColor
        )}
      />
      {/* Center blob */}
      <div
        className={cn(
          'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000',
          tertiaryColor
        )}
      />
    </div>
  )
}
