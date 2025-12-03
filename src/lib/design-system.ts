// Comprehensive Design System Integration
// Combines main design tokens with specialized component tokens

import { DESIGN_SYSTEM, SPACING, SHADOWS, RADIUS } from './design-tokens'
import { blogTokens } from './blog-design-tokens'

// Component tokens derived from design system
const components = {
  button: {
    padding: SPACING.md,
    borderRadius: RADIUS.md,
  },
  card: {
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    shadow: SHADOWS.md,
  },
  input: {
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
  },
}

// Extended design system with blog-specific tokens
export const extendedDesignSystem = {
  ...DESIGN_SYSTEM,
  blog: blogTokens,
  components: {
    ...components,
    blog: {
      // Blog-specific component tokens
      article: {
        padding: blogTokens.layout.article.padding,
        width: blogTokens.layout.article.width,
        spacing: blogTokens.spacing,
      },
      card: {
        padding: blogTokens.layout.card.padding,
        aspectRatio: blogTokens.layout.card.aspectRatio,
        borderRadius: blogTokens.borderRadius,
        shadow: blogTokens.shadows,
      },
      typography: {
        article: blogTokens.typography.article,
        headings: blogTokens.typography.headings,
        code: blogTokens.typography.code,
      },
      interactive: {
        colors: blogTokens.colors.interactive,
        animations: blogTokens.animations,
      },
    },
  },
} as const

// Type-safe design token accessors
export const tokens = {
  // Main design system
  spacing: DESIGN_SYSTEM.spacing,
  colors: DESIGN_SYSTEM.colors,
  shadows: DESIGN_SYSTEM.shadows,
  radius: DESIGN_SYSTEM.radius,
  transitions: DESIGN_SYSTEM.transitions,
  zIndex: DESIGN_SYSTEM.zIndex,

  // Blog-specific tokens
  blog: blogTokens,

  // Component tokens
  button: components.button,
  card: components.card,
  input: components.input,
} as const

// Utility functions for token consumption
export const getTokenValue = <T extends keyof typeof tokens>(
  category: T,
  path: string[]
): unknown => {
  let current: unknown = tokens[category]
  for (const key of path) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return undefined
    }
  }
  return current
}

// CSS custom property generators
export const generateCSSVariables = (): Record<string, string> => {
  const cssVars: Record<string, string> = {}

  // Generate spacing variables
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    cssVars[`--spacing-${key}`] = String(value)
  })

  // Generate shadow variables
  Object.entries(tokens.shadows).forEach(([key, value]) => {
    cssVars[`--shadow-${key}`] = String(value)
  })

  // Generate radius variables
  Object.entries(tokens.radius).forEach(([key, value]) => {
    cssVars[`--radius-${key}`] = String(value)
  })

  // Generate blog-specific variables
  Object.entries(tokens.blog.colors.content).forEach(([key, value]) => {
    cssVars[`--blog-color-${key}`] = String(value)
  })

  return cssVars
}

// Component variant utilities
export const createVariants = <T extends Record<string, Record<string, unknown>>>(
  baseStyles: string[],
  variants: T
) => {
  return {
    base: baseStyles.join(' '),
    variants,
  }
}

// Responsive breakpoint utilities
export const responsive = {
  xs: '(min-width: 475px)',
  sm: '(min-width: 640px)', 
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
  '3xl': '(min-width: 1920px)',
} as const

// Motion utilities
export const motion = {
  // Respect user preferences
  respectsMotion: '@media (prefers-reduced-motion: no-preference)',
  reduceMotion: '@media (prefers-reduced-motion: reduce)',

  // Transition presets from design tokens
  transitions: tokens.transitions,
} as const

// Focus management utilities
export const focus = {
  ring: {
    width: '2px',
    offset: '2px',
    color: 'ring',
    style: 'solid',
  },
  visible: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  styles: `
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-ring
    focus-visible:ring-offset-2
  `.trim(),
} as const

// High contrast support
export const highContrast = {
  border: '@media (prefers-contrast: high) { border-width: 2px }',
  text: '@media (prefers-contrast: high) { font-weight: 600 }',
  background: '@media (prefers-contrast: high) { background-color: var(--high-contrast-bg) }',
} as const

// Theme utilities
export const theme = {
  light: 'data-theme="light"',
  dark: 'data-theme="dark"',
  system: 'data-theme="system"',
} as const

// Export everything for convenience
export {
  DESIGN_SYSTEM,
  blogTokens,
  components,
}

// Type exports
export type DesignTokens = typeof tokens
export type BlogTokens = typeof blogTokens
export type ComponentTokens = typeof components