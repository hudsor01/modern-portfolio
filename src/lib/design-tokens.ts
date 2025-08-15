// Modern Design System Configuration v2.0
// Built with accessibility, scalability, and modern web standards

// Core spacing scale using mathematical progression (4px base)
export const spacing = {
  '0': '0',
  px: '1px',
  '0.5': '0.125rem', // 2px
  '1': '0.25rem',    // 4px
  '2': '0.5rem',     // 8px
  '3': '0.75rem',    // 12px
  '4': '1rem',       // 16px
  '5': '1.25rem',    // 20px
  '6': '1.5rem',     // 24px
  '7': '1.75rem',    // 28px
  '8': '2rem',       // 32px
  '10': '2.5rem',    // 40px
  '12': '3rem',      // 48px
  '16': '4rem',      // 64px
  '20': '5rem',      // 80px
  '24': '6rem',      // 96px
  '32': '8rem',      // 128px
  '40': '10rem',     // 160px
  '48': '12rem',     // 192px
  '56': '14rem',     // 224px
  '64': '16rem',     // 256px
} as const

// Enhanced color system with OKLCH for better perceptual uniformity
export const colors = {
  // Brand colors with enhanced accessibility
  primary: {
    50: 'oklch(0.95 0.05 230)',   // Very light blue
    100: 'oklch(0.9 0.08 230)',   // Light blue
    200: 'oklch(0.85 0.1 230)',   // Lighter blue
    300: 'oklch(0.8 0.13 230)',   // Main brand blue
    400: 'oklch(0.75 0.15 230)',  // Medium blue
    500: 'oklch(0.7 0.18 235)',   // Cornflower blue
    600: 'oklch(0.62 0.18 257)',  // Blue-600 equivalent
    700: 'oklch(0.55 0.17 257)',  // Dark blue
    800: 'oklch(0.45 0.15 257)',  // Darker blue
    900: 'oklch(0.35 0.15 240)',  // Deep navy
    950: 'oklch(0.2 0.1 240)',    // Very dark blue
  },
  
  // Semantic colors with proper contrast ratios
  semantic: {
    success: {
      light: 'oklch(0.8 0.15 140)',
      DEFAULT: 'oklch(0.7 0.18 140)',
      dark: 'oklch(0.6 0.2 140)',
    },
    warning: {
      light: 'oklch(0.8 0.12 50)',
      DEFAULT: 'oklch(0.7 0.15 50)',
      dark: 'oklch(0.6 0.18 50)',
    },
    error: {
      light: 'oklch(0.75 0.15 25)',
      DEFAULT: 'oklch(0.65 0.2 25)',
      dark: 'oklch(0.55 0.22 25)',
    },
    info: {
      light: 'oklch(0.8 0.13 230)',
      DEFAULT: 'oklch(0.7 0.18 235)',
      dark: 'oklch(0.6 0.2 240)',
    },
  },
  
  // Neutral colors for light and dark themes
  neutral: {
    0: 'oklch(1 0 0)',              // Pure white
    50: 'oklch(0.98 0.01 240)',     // Near white
    100: 'oklch(0.95 0.01 285)',    // Very light gray
    200: 'oklch(0.9 0.005 285)',    // Light gray
    300: 'oklch(0.8 0.01 285)',     // Medium light gray
    400: 'oklch(0.65 0.01 285)',    // Medium gray
    500: 'oklch(0.47 0.01 285)',    // True gray
    600: 'oklch(0.35 0.005 285)',   // Medium dark gray
    700: 'oklch(0.28 0.005 285)',   // Dark gray
    800: 'oklch(0.18 0.01 285)',    // Very dark gray
    900: 'oklch(0.15 0.02 240)',    // Near black
    950: 'oklch(0.09 0.01 285)',    // Deep charcoal
    1000: 'oklch(0 0 0)',           // Pure black
  },
} as const

// Modern typography scale with fluid sizing
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
    display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
  },
  
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],     // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }],  // 14px
    base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],           // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.025em' }], // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.025em' }],  // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.025em' }],   // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.025em' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.025em' }],   // 36px
    '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.025em' }],           // 48px
    '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.025em' }],        // 60px
    '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.025em' }],         // 72px
    '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.025em' }],           // 96px
    '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.025em' }],           // 128px
  },
  
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const

// Enhanced border radius system
export const borderRadius = {
  none: '0',
  xs: '0.125rem',   // 2px
  sm: '0.25rem',    // 4px
  DEFAULT: '0.375rem', // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  '3xl': '2rem',    // 32px
  full: '9999px',
} as const

// Modern shadow system with depth
export const boxShadow = {
  none: 'none',
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px 0 rgb(0 0 0 / 0.06)',
  DEFAULT: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
  md: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
  lg: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
  xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.06)',
  
  // Colored shadows for interactive elements
  primary: '0 10px 25px -5px oklch(0.7 0.18 235 / 0.2)',
  success: '0 10px 25px -5px oklch(0.7 0.18 140 / 0.2)',
  warning: '0 10px 25px -5px oklch(0.7 0.15 50 / 0.2)',
  error: '0 10px 25px -5px oklch(0.65 0.2 25 / 0.2)',
} as const

// Animation and transition tokens
export const animation = {
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
  },
  
  timing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Custom easing curves for premium feel
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  
  // Common transition presets
  presets: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
    bouncy: '300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    spring: '400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
} as const

// Updated design system configuration
export const designSystem = {
  spacing,
  colors,
  typography,
  borderRadius,
  boxShadow,
  animation,
  
  // Enhanced container sizes with fluid scaling
  containers: {
    xs: '20rem',     // 320px - Mobile first
    sm: '24rem',     // 384px - Large mobile
    md: '28rem',     // 448px - Tablet portrait
    lg: '32rem',     // 512px - Tablet landscape
    xl: '36rem',     // 576px - Small desktop
    '2xl': '42rem',  // 672px - Medium desktop
    '3xl': '48rem',  // 768px - Large desktop
    '4xl': '56rem',  // 896px - XL desktop
    '5xl': '64rem',  // 1024px - XXL desktop
    '6xl': '72rem',  // 1152px - Ultra wide
    '7xl': '80rem',  // 1280px - Max width
  },
  
  // Screen breakpoints for responsive design
  screens: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    '3xl': '1920px',
  },
  
  // Enhanced z-index scale with better organization
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
    max: 2147483647,
  },
  
  // Touch target sizes for accessibility
  touchTarget: {
    small: '2.75rem',  // 44px - Minimum touch target
    medium: '3rem',    // 48px - Comfortable touch target
    large: '3.5rem',   // 56px - Large touch target
  },
  
  // Focus ring configuration
  focusRing: {
    width: '2px',
    offset: '2px',
    color: 'oklch(0.7 0.18 235)',
    style: 'solid',
  },
  
  // Accessibility tokens  
  accessibilityTokens: {
    // Minimum contrast ratios (WCAG 2.1)
    contrast: {
      AA: 4.5,      // Normal text
      AALarge: 3,   // Large text (18pt+ or 14pt+ bold)
      AAA: 7,       // Enhanced contrast
      AAALarge: 4.5, // Enhanced large text
    },
    
    // Motion preferences
    motion: {
      reduce: 'prefers-reduced-motion: reduce',
      noPreference: 'prefers-reduced-motion: no-preference',
    },
    
    // Color scheme preferences
    colorScheme: {
      light: 'prefers-color-scheme: light',
      dark: 'prefers-color-scheme: dark',
      noPreference: 'prefers-color-scheme: no-preference',
    },
  },
} as const

// Legacy exports for backward compatibility
export const fontSizes = designSystem.typography.fontSize
export const fontWeights = designSystem.typography.fontWeight
export const lineHeights = designSystem.typography.lineHeight
export const shadows = designSystem.boxShadow
export const transitions = designSystem.animation.presets

// Component-specific design tokens
export const components = {
  button: {
    height: {
      sm: '2rem',      // 32px
      DEFAULT: '2.5rem', // 40px
      lg: '3rem',      // 48px
      xl: '3.5rem',    // 56px
    },
    padding: {
      sm: '0.5rem 0.75rem',
      DEFAULT: '0.75rem 1rem',
      lg: '1rem 1.5rem',
      xl: '1.25rem 2rem',
    },
    borderRadius: {
      sm: borderRadius.sm,
      DEFAULT: borderRadius.DEFAULT,
      lg: borderRadius.md,
      xl: borderRadius.lg,
    },
  },
  
  card: {
    padding: {
      sm: spacing['4'],
      DEFAULT: spacing['6'],
      lg: spacing['8'],
    },
    borderRadius: {
      sm: borderRadius.md,
      DEFAULT: borderRadius.lg,
      lg: borderRadius.xl,
    },
    shadow: {
      sm: boxShadow.sm,
      DEFAULT: boxShadow.DEFAULT,
      lg: boxShadow.md,
    },
  },
  
  input: {
    height: {
      sm: '2rem',
      DEFAULT: '2.5rem',
      lg: '3rem',
    },
    padding: {
      sm: '0.25rem 0.5rem',
      DEFAULT: '0.5rem 0.75rem',
      lg: '0.75rem 1rem',
    },
    borderRadius: borderRadius.DEFAULT,
  },
} as const

// Accessibility helpers
export const accessibility = {
  // Minimum contrast ratios (WCAG 2.1)
  contrast: {
    AA: 4.5,      // Normal text
    AALarge: 3,   // Large text (18pt+ or 14pt+ bold)
    AAA: 7,       // Enhanced contrast
    AAALarge: 4.5, // Enhanced large text
  },
  
  // Motion preferences
  motion: {
    reduce: 'prefers-reduced-motion: reduce',
    noPreference: 'prefers-reduced-motion: no-preference',
  },
  
  // Color scheme preferences
  colorScheme: {
    light: 'prefers-color-scheme: light',
    dark: 'prefers-color-scheme: dark',
    noPreference: 'prefers-color-scheme: no-preference',
  },
} as const

// Utility functions for design tokens
export const utils = {
  // Convert rem to px
  remToPx: (rem: string): number => {
    return parseFloat(rem) * 16
  },
  
  // Convert px to rem
  pxToRem: (px: number): string => {
    return `${px / 16}rem`
  },
  
  // Get responsive value
  responsive: (values: Record<string, string>) => {
    return Object.entries(values)
      .map(([breakpoint, value]) => 
        breakpoint === 'DEFAULT' ? value : `${breakpoint}:${value}`
      )
      .join(' ')
  },
} as const
