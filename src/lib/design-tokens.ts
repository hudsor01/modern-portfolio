/**
 * Design System Semantic Tokens
 * Centralized token system for consistent UI across the application
 * Maps CSS custom properties to TypeScript constants for type-safe usage
 */

/**
 * Color tokens organized by semantic purpose
 */
export const COLORS = {
  // Brand colors
  primary: 'hsl(var(--primary))',
  primaryForeground: 'hsl(var(--primary-foreground))',
  primaryHover: 'hsl(var(--primary-hover))',

  secondary: 'hsl(var(--secondary))',
  secondaryForeground: 'hsl(var(--secondary-foreground))',
  secondaryHover: 'hsl(var(--secondary-hover))',

  accent: 'hsl(var(--accent))',
  accentForeground: 'hsl(var(--accent-foreground))',

  // Semantic colors
  destructive: 'hsl(var(--destructive))',
  destructiveForeground: 'hsl(var(--destructive-foreground))',
  success: 'oklch(0.7 0.18 140)', // From @theme
  warning: 'oklch(0.7 0.15 50)',  // From @theme

  // Background system
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  card: 'hsl(var(--card))',
  cardForeground: 'hsl(var(--card-foreground))',
  popover: 'hsl(var(--popover))',
  popoverForeground: 'hsl(var(--popover-foreground))',

  // Form elements
  form: {
    label: 'hsl(var(--form-label-color))',
    inputBackground: 'hsl(var(--form-input-background))',
    inputBorder: 'hsl(var(--form-input-border))',
    inputBorderFocus: 'hsl(var(--form-input-border-focus))',
    inputErrorBorder: 'hsl(var(--form-input-error-border))',
    inputErrorBackground: 'hsl(var(--form-input-error-background))',
    inputSuccessBorder: 'hsl(var(--form-input-success-border))',
    inputSuccessBackground: 'hsl(var(--form-input-success-background))',
    inputDisabled: 'hsl(var(--form-input-disabled))',
    placeholder: 'hsl(var(--form-placeholder))',
    errorText: 'hsl(var(--form-error-text))',
    successText: 'hsl(var(--form-success-text))',
    helperText: 'hsl(var(--form-helper-text))',
  },

  // Interactive elements
  border: 'hsl(var(--border))',
  borderHover: 'hsl(var(--border-hover))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',

  // Muted elements
  muted: 'hsl(var(--muted))',
  mutedForeground: 'hsl(var(--muted-foreground))',

  // Chart colors
  chart: {
    1: 'hsl(var(--chart-1))',
    2: 'hsl(var(--chart-2))',
    3: 'hsl(var(--chart-3))',
    4: 'hsl(var(--chart-4))',
    5: 'hsl(var(--chart-5))',
  },
} as const

/**
 * Shadow elevation tokens
 */
export const SHADOWS = {
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
  xl: 'var(--shadow-xl)',
  inputFocus: 'var(--shadow-input-focus)',
  error: 'var(--shadow-error)',
  success: 'var(--shadow-success)',
} as const

/**
 * Spacing scale tokens
 */
export const SPACING = {
  xs: 'var(--spacing-xs)', // 0.25rem
  sm: 'var(--spacing-sm)', // 0.5rem
  md: 'var(--spacing-md)', // 1rem
  lg: 'var(--spacing-lg)', // 1.5rem
  xl: 'var(--spacing-xl)', // 2rem
  '2xl': 'var(--spacing-2xl)', // 3rem
  '3xl': 'var(--spacing-3xl)', // 4rem
  '4xl': 'var(--spacing-4xl)', // 6rem
} as const

/**
 * Border radius tokens
 */
export const RADIUS = {
  none: 'var(--radius-none)',
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
  '2xl': 'var(--radius-2xl)',
  '3xl': 'var(--radius-3xl)',
  full: 'var(--radius-full)',
} as const

/**
 * Transition/Animation tokens
 */
export const TRANSITIONS = {
  fast: 'var(--transition-fast)', // 150ms in-out
  base: 'var(--transition-base)', // 300ms in-out
  slow: 'var(--transition-slow)', // 500ms in-out
  spring: 'var(--transition-spring)', // 400ms spring
} as const

/**
 * Z-index scale tokens
 */
export const Z_INDEX = {
  below: 'var(--z-below)',
  base: 'var(--z-base)',
  raised: 'var(--z-raised)',
  overlay: 'var(--z-overlay)',
  dropdown: 'var(--z-dropdown)',
  sticky: 'var(--z-sticky)',
  modal: 'var(--z-modal)',
  popover: 'var(--z-popover)',
  tooltip: 'var(--z-tooltip)',
  notification: 'var(--z-notification)',
  maximum: 'var(--z-maximum)',
} as const

/**
 * Comprehensive design system token object
 */
export const DESIGN_SYSTEM = {
  colors: COLORS,
  shadows: SHADOWS,
  spacing: SPACING,
  radius: RADIUS,
  transitions: TRANSITIONS,
  zIndex: Z_INDEX,
} as const

/**
 * Type definitions for design tokens
 */
export type ColorTokens = typeof COLORS
export type ShadowTokens = typeof SHADOWS
export type SpacingTokens = typeof SPACING
export type RadiusTokens = typeof RADIUS
export type TransitionTokens = typeof TRANSITIONS
export type ZIndexTokens = typeof Z_INDEX
export type DesignSystemTokens = typeof DESIGN_SYSTEM
