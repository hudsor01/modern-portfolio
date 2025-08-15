// Comprehensive Design System Integration
// Combines main design tokens with specialized component tokens

import { designSystem, components } from './design-tokens'
import { blogTokens } from './blog-design-tokens'

// Extended design system with blog-specific tokens
export const extendedDesignSystem = {
  ...designSystem,
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
  spacing: designSystem.spacing,
  colors: designSystem.colors,
  typography: designSystem.typography,
  borderRadius: designSystem.borderRadius,
  boxShadow: designSystem.boxShadow,
  animation: designSystem.animation,
  
  // Blog-specific tokens
  blog: blogTokens,
  
  // Component tokens
  button: components.button,
  card: components.card,
  input: components.input,
  
  // Accessibility tokens
  accessibility: designSystem.accessibility,
  focusRing: designSystem.focusRing,
  touchTarget: designSystem.touchTarget,
} as const

// Utility functions for token consumption
export const getTokenValue = <T extends keyof typeof tokens>(
  category: T,
  path: string[]
): unknown => {
  return path.reduce((obj, key) => obj?.[key], tokens[category] as Record<string, unknown>)
}

// CSS custom property generators
export const generateCSSVariables = () => {
  const cssVars: Record<string, string> = {}
  
  // Generate spacing variables
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    cssVars[`--spacing-${key}`] = value
  })
  
  // Generate color variables
  Object.entries(tokens.colors.primary).forEach(([key, value]) => {
    cssVars[`--color-primary-${key}`] = value
  })
  
  Object.entries(tokens.colors.neutral).forEach(([key, value]) => {
    cssVars[`--color-neutral-${key}`] = value
  })
  
  // Generate typography variables
  Object.entries(tokens.typography.fontSize).forEach(([key, value]) => {
    const [fontSize, options] = Array.isArray(value) ? value : [value, {}]
    cssVars[`--font-size-${key}`] = typeof fontSize === 'string' ? fontSize : String(fontSize)
    if (typeof options === 'object' && options && 'lineHeight' in options) {
      cssVars[`--line-height-${key}`] = String(options.lineHeight)
    }
  })
  
  // Generate blog-specific variables
  Object.entries(tokens.blog.colors.content).forEach(([key, value]) => {
    cssVars[`--blog-color-${key}`] = value
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
  
  // Common easing functions
  easing: tokens.animation.timing,
  
  // Duration presets
  duration: tokens.animation.duration,
  
  // Animation presets
  presets: tokens.animation.presets,
} as const

// Focus management utilities
export const focus = {
  ring: {
    width: tokens.focusRing.width,
    offset: tokens.focusRing.offset,
    color: tokens.focusRing.color,
    style: tokens.focusRing.style,
  },
  visible: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  styles: `
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-${tokens.focusRing.color}
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
  designSystem,
  blogTokens,
  components,
}

// Type exports
export type DesignTokens = typeof tokens
export type BlogTokens = typeof blogTokens
export type ComponentTokens = typeof components