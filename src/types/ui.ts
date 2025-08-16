/**
 * UI Component Types
 * Contains interface definitions for UI components
 */

import { JSX, ReactNode } from 'react'
import { ImageProps } from 'next/image'
import { ButtonHTMLAttributes } from 'react'
import { ContactFormData } from '@/types/shared-api'

// Framer Motion types
export interface MotionVariant {
  [key: string]: {
    [property: string]: string | number | boolean;
  };
}


// Animation related interfaces
export interface AnimatedHeadingProps {
  text: string | string[]
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  className?: string
  typeSpeed?: number
  deleteSpeed?: number
  delaySpeed?: number
  loop?: boolean
  cursor?: boolean
  cursorBlinking?: boolean
  cursorStyle?: string
  words?: string[]
}

export interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  id?: string
  delay?: number
  duration?: number
  once?: boolean
  placement?: 'left' | 'right' | 'top' | 'bottom' | 'center'
  distance?: number
  damping?: number
  margin?: number
}

export interface TextRevealProps {
  text: string;
  className?: string;
  once?: boolean;
  delay?: number; // Corresponds to delayChildren in the component's variants
  duration?: number; // Corresponds to staggerChildren in the component's variants
  as?: keyof HTMLElementTagNameMap; // More specific: only HTML element tag names
  // Removed speed, staggerChildren, delayChildren as they are superseded by delay/duration or not directly used
}

export interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number
  once?: boolean
}

export interface PageTransitionProps {
  children: ReactNode
  className?: string
  mode?: 'wait' | 'sync' | 'popLayout'
}

// Layout and Section interfaces
export interface SectionProps {
  id?: string
  className?: string
  children: ReactNode
  fullWidth?: boolean
  fullHeight?: boolean
  centered?: boolean
  as?: keyof JSX.IntrinsicElements
}

export interface SectionContainerProps {
  children: ReactNode
  className?: string
  id?: string
  maxWidth?: string
  padding?: string
  margin?: string
  background?: string
}

// Card and Container interfaces
export interface CardProps extends React.ComponentProps<'div'> {
  className?: string
  children: ReactNode
  hoverable?: boolean
  bordered?: boolean
  compact?: boolean
}

// Image and Media interfaces
export interface OptimizedImageProps extends Omit<ImageProps, 'onLoadingComplete'> {
  fallbackSrc?: string
  fallbackComponent?: ReactNode
  loadingComponent?: ReactNode
  onLoad?: () => void
  onError?: () => void
}

// Loading and Suspense interfaces
export interface LazyLoadProps {
  children: ReactNode
  placeholder?: ReactNode
  threshold?: number
  rootMargin?: string
  once?: boolean
  className?: string
}

export interface SuspenseWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  delay?: number
  className?: string
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  className?: string
  thickness?: number
  speed?: number
  label?: string
}

// Error handling interfaces
export interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode)
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  onReset?: () => void
}

export interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

// Utility component interfaces
export interface ClientSideOnlyProps {
  children: ReactNode
  fallback?: ReactNode
}

export interface OptimisticProviderProps<T> {
  children: ReactNode
  initialState: T
  action: (state: T) => Promise<T>
}

export interface ScrollFadeProps {
  children: ReactNode
  className?: string
  threshold?: number
  fadeDirection?: 'up' | 'down' | 'left' | 'right'
  duration?: number
  distance?: number
}

export interface SmoothScrollLinkProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  to: string
  offset?: number
  duration?: number
  smooth?: boolean
  spy?: boolean
  hashSpy?: boolean
  isDynamic?: boolean
  ignoreCancelEvents?: boolean
  onSetActive?: (to: string) => void
  onSetInactive?: (to: string) => void
  containerId?: string
}

export interface SkeletonProps extends React.ComponentProps<'div'> {
  className?: string
  variant?: 'rectangular' | 'circular' | 'rounded' | 'text'
  animation?: 'pulse' | 'wave' | 'none'
  width?: string | number
  height?: string | number
}

export interface BackgroundEffectsProps {
  variant?: 'grid' | 'dots' | 'waves' | 'noise' | 'gradient'
  className?: string
  intensity?: number
  speed?: number
  color?: string
  secondaryColor?: string
  interactive?: boolean
}

export interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'blockquote' | 'large' | 'small' | 'muted'
  children: ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
}

// Counter and animation interfaces
export interface CounterProps {
  end: number
  start?: number
  duration?: number
  delay?: number
  decimals?: number
  prefix?: string
  suffix?: string
  separator?: string
  decimal?: string
  className?: string
  onComplete?: () => void
}

export interface TypewriterProps {
  text: string | string[]
  className?: string
  speed?: number
  delay?: number
  loop?: boolean
  cursor?: boolean
  cursorStyle?: string
  cursorBlinking?: boolean
  onLoopDone?: () => void
  onType?: (text: string) => void
}

// Social and sharing interfaces
export interface SocialShareProps {
  url: string
  title?: string
  description?: string
  image?: string
  platforms?: ('facebook' | 'twitter' | 'linkedin' | 'pinterest' | 'reddit' | 'email')[]
  className?: string
  compact?: boolean
  iconSize?: number
  round?: boolean
  showLabel?: boolean
}

// Form interfaces
export interface ContactFormProps {
  initialValues?: Partial<ContactFormData>
  onSuccess?: () => void
  onError?: (error: Error) => void
  variant?: 'default' | 'compact' | 'detailed'
  className?: string
  buttonText?: string
  successMessage?: string
  errorMessage?: string
  showOptionalFields?: boolean
}

// Dialog specific interfaces
export interface ContactDialogProps {
  open: boolean;
  onCloseAction: () => void;
}
