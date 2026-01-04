/**
 * Design Token System
 *
 * Centralized design token configuration that maps to CSS custom properties
 * defined in globals.css. This provides TypeScript interfaces and utilities
 * for consistent design system usage across all components.
 */

// Color Tokens
export interface ColorTokens {
  primary: string
  'primary-hover': string
  'primary-foreground': string
  secondary: string
  'secondary-hover': string
  'secondary-foreground': string
  accent: string
  'accent-foreground': string
  muted: string
  'muted-foreground': string
  destructive: string
  'destructive-foreground': string
  success: string
  warning: string
  background: string
  foreground: string
  card: string
  'card-foreground': string
  border: string
  'border-hover': string
  input: string
  ring: string
}

// Spacing Tokens
export interface SpacingTokens {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
  '4xl': string
}

// Typography Tokens
export interface TypographyTokens {
  fontFamily: {
    sans: string
    mono: string
    display: string
  }
  fontSize: {
    xs: string
    sm: string
    base: string
    md: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
    '4xl': string
    '5xl': string
    '6xl': string
    '7xl': string
  }
  fontWeight: {
    regular: string
    medium: string
    semibold: string
    bold: string
    extrabold: string
  }
  lineHeight: {
    none: string
    tight: string
    snug: string
    normal: string
    relaxed: string
    loose: string
  }
  letterSpacing: {
    tighter: string
    tight: string
    normal: string
    wide: string
    wider: string
  }
}

// Animation Tokens
export interface AnimationTokens {
  duration: {
    fast: string
    normal: string
    slow: string
  }
  ease: {
    linear: string
    in: string
    out: string
    'in-out': string
    bounce: string
    spring: string
  }
}

// Radius Tokens
export interface RadiusTokens {
  none: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
  full: string
}

// Shadow Tokens
export interface ShadowTokens {
  sm: string
  md: string
  lg: string
  xl: string
  'input-focus': string
  error: string
  success: string
}

// Complete Design Token Interface
export interface DesignTokens {
  colors: ColorTokens
  spacing: SpacingTokens
  typography: TypographyTokens
  animations: AnimationTokens
  radius: RadiusTokens
  shadows: ShadowTokens
}

/**
 * Design token configuration that maps to CSS custom properties
 * These values reference the CSS variables defined in globals.css
 */
export const designTokens: DesignTokens = {
  colors: {
    primary: 'var(--color-primary)',
    'primary-hover': 'var(--color-primary-hover)',
    'primary-foreground': 'var(--color-primary-foreground)',
    secondary: 'var(--color-secondary)',
    'secondary-hover': 'var(--color-secondary-hover)',
    'secondary-foreground': 'var(--color-secondary-foreground)',
    accent: 'var(--color-accent)',
    'accent-foreground': 'var(--color-accent-foreground)',
    muted: 'var(--color-muted)',
    'muted-foreground': 'var(--color-muted-foreground)',
    destructive: 'var(--color-destructive)',
    'destructive-foreground': 'var(--color-destructive-foreground)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    background: 'var(--color-background)',
    foreground: 'var(--color-foreground)',
    card: 'var(--color-card)',
    'card-foreground': 'var(--color-card-foreground)',
    border: 'var(--color-border)',
    'border-hover': 'var(--color-border-hover)',
    input: 'var(--color-input)',
    ring: 'var(--color-ring)',
  },
  spacing: {
    xs: 'var(--spacing-xs)',
    sm: 'var(--spacing-sm)',
    md: 'var(--spacing-md)',
    lg: 'var(--spacing-lg)',
    xl: 'var(--spacing-xl)',
    '2xl': 'var(--spacing-2xl)',
    '3xl': 'var(--spacing-3xl)',
    '4xl': 'var(--spacing-4xl)',
  },
  typography: {
    fontFamily: {
      sans: 'var(--font-family-sans)',
      mono: 'var(--font-family-mono)',
      display: 'var(--font-family-display)',
    },
    fontSize: {
      xs: 'var(--font-size-xs)',
      sm: 'var(--font-size-sm)',
      base: 'var(--font-size-base)',
      md: 'var(--font-size-md)',
      lg: 'var(--font-size-lg)',
      xl: 'var(--font-size-xl)',
      '2xl': 'var(--font-size-2xl)',
      '3xl': 'var(--font-size-3xl)',
      '4xl': 'var(--font-size-4xl)',
      '5xl': 'var(--font-size-5xl)',
      '6xl': 'var(--font-size-6xl)',
      '7xl': 'var(--font-size-7xl)',
    },
    fontWeight: {
      regular: 'var(--font-weight-regular)',
      medium: 'var(--font-weight-medium)',
      semibold: 'var(--font-weight-semibold)',
      bold: 'var(--font-weight-bold)',
      extrabold: 'var(--font-weight-extrabold)',
    },
    lineHeight: {
      none: 'var(--line-height-none)',
      tight: 'var(--line-height-tight)',
      snug: 'var(--line-height-snug)',
      normal: 'var(--line-height-normal)',
      relaxed: 'var(--line-height-relaxed)',
      loose: 'var(--line-height-loose)',
    },
    letterSpacing: {
      tighter: 'var(--letter-spacing-tighter)',
      tight: 'var(--letter-spacing-tight)',
      normal: 'var(--letter-spacing-normal)',
      wide: 'var(--letter-spacing-wide)',
      wider: 'var(--letter-spacing-wider)',
    },
  },
  animations: {
    duration: {
      fast: 'var(--motion-duration-fast)',
      normal: 'var(--motion-duration-normal)',
      slow: 'var(--motion-duration-slow)',
    },
    ease: {
      linear: 'var(--motion-ease-linear)',
      in: 'var(--motion-ease-in)',
      out: 'var(--motion-ease-out)',
      'in-out': 'var(--motion-ease-in-out)',
      bounce: 'var(--motion-ease-bounce)',
      spring: 'var(--motion-ease-spring)',
    },
  },
  radius: {
    none: 'var(--radius-none)',
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
    '2xl': 'var(--radius-2xl)',
    '3xl': 'var(--radius-3xl)',
    full: 'var(--radius-full)',
  },
  shadows: {
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
    xl: 'var(--shadow-xl)',
    'input-focus': 'var(--shadow-input-focus)',
    error: 'var(--shadow-error)',
    success: 'var(--shadow-success)',
  },
}

/**
 * Utility function to get a design token value
 * Provides type safety and consistent access to design tokens
 */
export function getToken<T extends keyof DesignTokens>(
  category: T,
  token: keyof DesignTokens[T]
): string {
  const categoryTokens = designTokens[category]
  const tokenValue = categoryTokens[token as keyof typeof categoryTokens]

  // Handle nested token objects (like typography.fontFamily)
  if (typeof tokenValue === 'object' && tokenValue !== null) {
    // For nested objects, return the first value or empty string
    const values = Object.values(tokenValue as Record<string, string>)
    return values[0] ?? ''
  }

  return tokenValue as string
}

/**
 * Utility function to create CSS custom property references
 * Useful for dynamic token usage in styled components
 */
export function createTokenVar(category: keyof DesignTokens, token: string): string {
  const prefix =
    category === 'colors'
      ? 'color'
      : category === 'spacing'
        ? 'spacing'
        : category === 'typography'
          ? 'font'
          : category === 'animations'
            ? 'motion'
            : category === 'radius'
              ? 'radius'
              : category === 'shadows'
                ? 'shadow'
                : category

  return `var(--${prefix}-${token})`
}

/**
 * Type-safe token validation
 * Ensures tokens exist in the design system
 */
export function validateToken<T extends keyof DesignTokens>(
  category: T,
  token: keyof DesignTokens[T]
): boolean {
  return token in designTokens[category]
}

/**
 * Get all tokens in a category
 * Useful for iteration and validation
 * Flattens nested objects into dot-notation keys
 */
export function getTokensInCategory<T extends keyof DesignTokens>(
  category: T
): Record<string, string> {
  const categoryTokens = designTokens[category]

  // If the category contains nested objects, flatten them
  if (typeof categoryTokens === 'object' && categoryTokens !== null) {
    return flattenTokenObject(categoryTokens as unknown as NestedTokenObject)
  }

  return categoryTokens as Record<string, string>
}

/**
 * Type for nested token objects that can contain strings or nested objects
 */
type NestedTokenObject = {
  [key: string]: string | NestedTokenObject
}

/**
 * Flatten nested token objects into dot-notation keys
 */
function flattenTokenObject(obj: NestedTokenObject, prefix = ''): Record<string, string> {
  const flattened: Record<string, string> = {}

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key

    if (typeof value === 'string') {
      flattened[newKey] = value
    } else if (typeof value === 'object' && value !== null) {
      Object.assign(flattened, flattenTokenObject(value, newKey))
    }
  }

  return flattened
}
