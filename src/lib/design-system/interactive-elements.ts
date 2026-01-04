/**
 * Interactive Elements Design System
 *
 * Provides standardized interactive behaviors, hover states, focus patterns,
 * loading states, and modal/overlay patterns for consistent user experience
 * across all project pages.
 */

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// ============================================================================
// HOVER STATE VARIANTS
// ============================================================================

/**
 * Standardized hover state patterns for interactive elements
 */
export const hoverVariants = cva('', {
  variants: {
    variant: {
      // Subtle hover with slight elevation
      subtle: 'transition-all duration-300 ease-out hover:shadow-md hover:-translate-y-0.5',

      // Card-like hover with border and shadow changes
      card: 'transition-all duration-300 ease-out hover:border-primary/40 hover:shadow-lg hover:-translate-y-1',

      // Button-like hover with background changes
      button: 'transition-all duration-300 ease-out hover:bg-primary/90 hover:shadow-md',

      // Link-like hover with color changes
      link: 'transition-all duration-300 ease-out hover:text-primary hover:underline',

      // Ghost hover for minimal elements
      ghost: 'transition-all duration-300 ease-out hover:bg-muted hover:text-foreground',

      // Scale hover for interactive icons
      scale: 'transition-all duration-300 ease-out hover:scale-110 hover:text-primary',

      // Glow effect for special elements
      glow: 'transition-all duration-300 ease-out hover:shadow-lg hover:shadow-primary/25',

      // Slide effect for navigation elements
      slide: 'transition-all duration-300 ease-out hover:translate-x-1',

      // None for elements that shouldn't have hover effects
      none: '',
    },
    intensity: {
      low: '',
      medium: '',
      high: '',
    },
  },
  defaultVariants: {
    variant: 'subtle',
    intensity: 'medium',
  },
  compoundVariants: [
    // Only apply intensity when variant is not 'none'
    {
      variant: ['subtle', 'card', 'button', 'link', 'ghost', 'scale', 'glow', 'slide'],
      intensity: 'low',
      class: 'hover:opacity-80',
    },
    {
      variant: ['subtle', 'card', 'button', 'link', 'ghost', 'scale', 'glow', 'slide'],
      intensity: 'medium',
      class: 'hover:opacity-90',
    },
    {
      variant: ['subtle', 'card', 'button', 'link', 'ghost', 'scale', 'glow', 'slide'],
      intensity: 'high',
      class: 'hover:opacity-100',
    },
  ],
})

// ============================================================================
// FOCUS STATE VARIANTS
// ============================================================================

/**
 * Standardized focus patterns for accessibility and keyboard navigation
 */
export const focusVariants = cva('outline-hidden transition-all duration-150 ease-out', {
  variants: {
    variant: {
      // Standard focus ring
      default: 'focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-2',

      // Primary focus for important elements
      primary: 'focus-visible:ring-[3px] focus-visible:ring-primary/50 focus-visible:ring-offset-2',

      // Destructive focus for dangerous actions
      destructive:
        'focus-visible:ring-[3px] focus-visible:ring-destructive/50 focus-visible:ring-offset-2',

      // Inset focus for form elements
      inset: 'focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset',

      // Border focus for outlined elements
      border: 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

// ============================================================================
// CLICK FEEDBACK VARIANTS
// ============================================================================

/**
 * Standardized click feedback patterns for immediate user response
 */
export const clickFeedbackVariants = cva('', {
  variants: {
    variant: {
      // Standard click feedback
      default: 'transition-transform duration-150 ease-out active:scale-95',

      // Subtle click for sensitive elements
      subtle: 'transition-transform duration-150 ease-out active:scale-98',

      // Strong click for primary actions
      strong: 'transition-transform duration-150 ease-out active:scale-90',

      // Bounce effect for playful interactions
      bounce: 'transition-transform duration-150 ease-out active:scale-95 active:animate-pulse',

      // None for elements that shouldn't have click feedback
      none: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

// ============================================================================
// LOADING STATE VARIANTS
// ============================================================================

/**
 * Standardized loading state patterns
 */
export const loadingVariants = cva('transition-all duration-300 ease-out', {
  variants: {
    variant: {
      // Spinner loading
      spinner: 'animate-spin',

      // Pulse loading
      pulse: 'animate-pulse',

      // Shimmer loading
      shimmer:
        'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-600/20 before:to-transparent',

      // Skeleton loading
      skeleton: 'bg-muted animate-pulse rounded',

      // Fade loading
      fade: 'opacity-50 animate-pulse',

      // Disabled state
      disabled: 'opacity-50 pointer-events-none cursor-not-allowed',
    },
  },
  defaultVariants: {
    variant: 'pulse',
  },
})

// ============================================================================
// MODAL/OVERLAY VARIANTS
// ============================================================================

/**
 * Standardized modal and overlay patterns
 */
export const overlayVariants = cva('fixed inset-0 z-50 transition-all duration-300 ease-out', {
  variants: {
    variant: {
      // Standard modal overlay
      modal: 'bg-black/50 backdrop-blur-sm',

      // Drawer overlay
      drawer: 'bg-black/30 backdrop-blur-xs',

      // Popover overlay (transparent)
      popover: 'bg-transparent',

      // Loading overlay
      loading: 'bg-background/80 backdrop-blur-sm',

      // Error overlay
      error: 'bg-destructive/10 backdrop-blur-sm',
    },
    animation: {
      // Fade in/out
      fade: 'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',

      // Scale in/out
      scale:
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',

      // Slide in/out
      slide:
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
    },
  },
  defaultVariants: {
    variant: 'modal',
    animation: 'fade',
  },
})

/**
 * Modal content variants
 */
export const modalContentVariants = cva(
  'fixed z-50 grid w-full gap-4 rounded-lg border bg-background p-6 shadow-lg transition-all duration-300 ease-out',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        full: 'max-w-[calc(100vw-2rem)]',
      },
      position: {
        center: 'top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]',
        top: 'top-[10%] left-[50%] translate-x-[-50%]',
        bottom: 'bottom-[10%] left-[50%] translate-x-[-50%]',
      },
      animation: {
        fade: 'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        scale:
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        slide:
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
      },
    },
    defaultVariants: {
      size: 'md',
      position: 'center',
      animation: 'scale',
    },
  }
)

// ============================================================================
// REFRESH/DATA LOADING VARIANTS
// ============================================================================

/**
 * Standardized data refresh and loading patterns
 */
export const refreshVariants = cva('transition-all duration-300 ease-out', {
  variants: {
    state: {
      // Idle state
      idle: 'opacity-100',

      // Loading state
      loading: 'opacity-70 animate-pulse pointer-events-none',

      // Success state
      success: 'opacity-100 animate-bounce',

      // Error state
      error: 'opacity-100 animate-shake',

      // Refreshing state
      refreshing: 'opacity-80 animate-spin',
    },
  },
  defaultVariants: {
    state: 'idle',
  },
})

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Combines multiple interactive variants into a single className string
 */
export function combineInteractiveVariants({
  hover,
  focus,
  click,
  loading,
  className,
}: {
  hover?: VariantProps<typeof hoverVariants>
  focus?: VariantProps<typeof focusVariants>
  click?: VariantProps<typeof clickFeedbackVariants>
  loading?: VariantProps<typeof loadingVariants>
  className?: string
}) {
  return cn(
    hover && hoverVariants(hover),
    focus && focusVariants(focus),
    click && clickFeedbackVariants(click),
    loading && loadingVariants(loading),
    className
  )
}

/**
 * Creates standardized interactive button classes
 */
export function createInteractiveButton({
  variant: _variant = 'default',
  size: _size = 'default',
  disabled = false,
  loading = false,
  className,
}: {
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'link' | 'destructive'
  size?: 'sm' | 'default' | 'lg' | 'xl' | 'icon'
  disabled?: boolean
  loading?: boolean
  className?: string
} = {}) {
  const interactiveClasses = combineInteractiveVariants({
    hover: { variant: disabled || loading ? 'none' : 'button' },
    focus: { variant: 'default' },
    click: { variant: disabled || loading ? 'none' : 'default' },
  })

  // Check if interactive classes already include transition-all
  const hasTransition = interactiveClasses.includes('transition-all')

  return cn(
    // Base button styles
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium',

    // Add transition-all only if not already included
    !hasTransition && 'transition-all duration-300 ease-out',

    // Interactive states
    interactiveClasses,

    // Loading/disabled states
    disabled && 'opacity-50 pointer-events-none cursor-not-allowed',
    loading && loadingVariants({ variant: 'disabled' }),

    className
  )
}

/**
 * Creates standardized interactive card classes
 */
export function createInteractiveCard({
  variant: _variant = 'default',
  interactive = true,
  loading = false,
  className,
}: {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost'
  interactive?: boolean
  loading?: boolean
  className?: string
} = {}) {
  const interactiveClasses = interactive
    ? combineInteractiveVariants({
        hover: { variant: loading ? 'none' : 'card' },
        focus: { variant: 'border' },
        click: { variant: loading ? 'none' : 'subtle' },
      })
    : ''

  // Check if interactive classes already include transition-all
  const hasTransition = interactiveClasses.includes('transition-all')

  return cn(
    // Base card styles
    'rounded-xl border bg-card text-card-foreground',

    // Add transition-all only if interactive and not already included
    interactive && !hasTransition && 'transition-all duration-300 ease-out',

    // Interactive states
    interactiveClasses,

    // Loading state
    loading && loadingVariants({ variant: 'fade' }),

    className
  )
}

/**
 * Creates standardized modal/overlay classes
 */
export function createModalClasses({
  overlay = { variant: 'modal', animation: 'fade' },
  content = { size: 'md', position: 'center', animation: 'scale' },
  className,
}: {
  overlay?: VariantProps<typeof overlayVariants>
  content?: VariantProps<typeof modalContentVariants>
  className?: string
} = {}) {
  return {
    overlay: overlayVariants(overlay),
    content: cn(modalContentVariants(content), className),
  }
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type HoverVariant = VariantProps<typeof hoverVariants>
export type FocusVariant = VariantProps<typeof focusVariants>
export type ClickFeedbackVariant = VariantProps<typeof clickFeedbackVariants>
export type LoadingVariant = VariantProps<typeof loadingVariants>
export type OverlayVariant = VariantProps<typeof overlayVariants>
export type ModalContentVariant = VariantProps<typeof modalContentVariants>
export type RefreshVariant = VariantProps<typeof refreshVariants>
