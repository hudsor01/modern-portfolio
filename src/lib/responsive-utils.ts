// Responsive Design Utilities and Mobile-First Patterns
// Modern responsive design system with container queries and fluid utilities

// === BREAKPOINT UTILITIES === //

export const breakpoints = {
  xs: '475px',
  sm: '640px', 
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '1920px',
} as const

export type Breakpoint = keyof typeof breakpoints

// Convert breakpoints to pixel values for JS usage
export const breakpointValues = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1920,
} as const

// === MEDIA QUERY UTILITIES === //

export const mediaQueries = {
  // Mobile first approach
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
  '3xl': `@media (min-width: ${breakpoints['3xl']})`,
  
  // Max-width queries for specific ranges
  'max-xs': `@media (max-width: ${breakpointValues.xs - 1}px)`,
  'max-sm': `@media (max-width: ${breakpointValues.sm - 1}px)`,
  'max-md': `@media (max-width: ${breakpointValues.md - 1}px)`,
  'max-lg': `@media (max-width: ${breakpointValues.lg - 1}px)`,
  'max-xl': `@media (max-width: ${breakpointValues.xl - 1}px)`,
  'max-2xl': `@media (max-width: ${breakpointValues['2xl'] - 1}px)`,
  
  // Range queries
  'sm-only': `@media (min-width: ${breakpoints.sm}) and (max-width: ${breakpointValues.md - 1}px)`,
  'md-only': `@media (min-width: ${breakpoints.md}) and (max-width: ${breakpointValues.lg - 1}px)`,
  'lg-only': `@media (min-width: ${breakpoints.lg}) and (max-width: ${breakpointValues.xl - 1}px)`,
  
  // Device-specific queries
  mobile: '@media (max-width: 767px)',
  tablet: '@media (min-width: 768px) and (max-width: 1023px)',
  desktop: '@media (min-width: 1024px)',
  
  // Orientation and interaction queries
  landscape: '@media (orientation: landscape)',
  portrait: '@media (orientation: portrait)',
  hover: '@media (hover: hover)',
  'no-hover': '@media (hover: none)',
  touch: '@media (pointer: coarse)',
  'fine-pointer': '@media (pointer: fine)',
  
  // High resolution displays
  retina: '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
  
  // Accessibility preferences
  'reduced-motion': '@media (prefers-reduced-motion: reduce)',
  'no-preference-motion': '@media (prefers-reduced-motion: no-preference)',
  'high-contrast': '@media (prefers-contrast: high)',
  'dark-theme': '@media (prefers-color-scheme: dark)',
  'light-theme': '@media (prefers-color-scheme: light)',
} as const

// === CONTAINER QUERY UTILITIES === //

export const containerQueries = {
  xs: '@container (min-width: 20rem)',
  sm: '@container (min-width: 24rem)', 
  md: '@container (min-width: 28rem)',
  lg: '@container (min-width: 32rem)',
  xl: '@container (min-width: 36rem)',
  '2xl': '@container (min-width: 42rem)',
  '3xl': '@container (min-width: 48rem)',
} as const

// === RESPONSIVE VALUE UTILITIES === //

export type ResponsiveValue<T> = T | {
  xs?: T
  sm?: T
  md?: T
  lg?: T
  xl?: T
  '2xl'?: T
  '3xl'?: T
}

// Convert responsive values to CSS classes
export function getResponsiveClasses<T extends string>(
  value: ResponsiveValue<T>,
  prefix: string = ''
): string {
  if (typeof value === 'string') {
    return `${prefix}${value}`
  }
  
  const classes: string[] = []
  
  // Add base value (mobile first)
  if (value.xs) classes.push(`${prefix}${value.xs}`)
  
  // Add breakpoint-specific values
  Object.entries(value).forEach(([breakpoint, val]) => {
    if (breakpoint !== 'xs' && val) {
      classes.push(`${breakpoint}:${prefix}${val}`)
    }
  })
  
  return classes.join(' ')
}

// === FLUID TYPOGRAPHY UTILITIES === //

export function fluidType(
  minSize: number,
  maxSize: number,
  minViewport: number = 320,
  maxViewport: number = 1200
): string {
  const minSizeRem = minSize / 16
  const maxSizeRem = maxSize / 16
  const minViewportRem = minViewport / 16
  const maxViewportRem = maxViewport / 16
  
  const slope = (maxSizeRem - minSizeRem) / (maxViewportRem - minViewportRem)
  const yAxisIntersection = -minViewportRem * slope + minSizeRem
  
  return `clamp(${minSizeRem}rem, ${yAxisIntersection}rem + ${slope * 100}vw, ${maxSizeRem}rem)`
}

// Predefined fluid typography scales
export const fluidTypography = {
  xs: fluidType(12, 14),
  sm: fluidType(14, 16),
  base: fluidType(16, 18),
  lg: fluidType(18, 20),
  xl: fluidType(20, 24),
  '2xl': fluidType(24, 30),
  '3xl': fluidType(30, 36),
  '4xl': fluidType(36, 48),
  '5xl': fluidType(48, 60),
  '6xl': fluidType(60, 72),
  '7xl': fluidType(72, 96),
  '8xl': fluidType(96, 128),
  '9xl': fluidType(128, 160),
} as const

// === FLUID SPACING UTILITIES === //

export function fluidSpace(
  minSize: number,
  maxSize: number,
  minViewport: number = 320,
  maxViewport: number = 1200
): string {
  return fluidType(minSize, maxSize, minViewport, maxViewport)
}

// Predefined fluid spacing scales
export const fluidSpacing = {
  xs: fluidSpace(4, 8),
  sm: fluidSpace(8, 12),
  base: fluidSpace(16, 24),
  lg: fluidSpace(24, 32),
  xl: fluidSpace(32, 48),
  '2xl': fluidSpace(48, 64),
  '3xl': fluidSpace(64, 96),
  '4xl': fluidSpace(96, 128),
} as const

// === ASPECT RATIO UTILITIES === //

export const aspectRatios = {
  square: '1 / 1',
  video: '16 / 9',
  golden: '1.618 / 1',
  portrait: '3 / 4',
  landscape: '4 / 3',
  widescreen: '21 / 9',
  ultrawide: '32 / 9',
} as const

// === MOBILE-FIRST GRID UTILITIES === //

export const gridTemplates = {
  // Auto-fit grids that adapt to container size
  autoFit: {
    xs: 'repeat(auto-fit, minmax(250px, 1fr))',
    sm: 'repeat(auto-fit, minmax(280px, 1fr))', 
    md: 'repeat(auto-fit, minmax(320px, 1fr))',
    lg: 'repeat(auto-fit, minmax(350px, 1fr))',
  },
  
  // Auto-fill grids for consistent sizing
  autoFill: {
    xs: 'repeat(auto-fill, minmax(200px, 1fr))',
    sm: 'repeat(auto-fill, minmax(240px, 1fr))',
    md: 'repeat(auto-fill, minmax(280px, 1fr))',
    lg: 'repeat(auto-fill, minmax(320px, 1fr))',
  },
  
  // Responsive column grids
  responsive: {
    '1-2-3': 'repeat(1, 1fr) repeat(2, 1fr) repeat(3, 1fr)', // 1 col mobile, 2 tablet, 3 desktop
    '1-2-4': 'repeat(1, 1fr) repeat(2, 1fr) repeat(4, 1fr)', // 1 col mobile, 2 tablet, 4 desktop
    '2-3-4': 'repeat(2, 1fr) repeat(3, 1fr) repeat(4, 1fr)', // 2 col mobile, 3 tablet, 4 desktop
  },
} as const

// === RESPONSIVE IMAGE UTILITIES === //

export const imageBreakpoints = {
  // Standard responsive image sizes
  sizes: {
    mobile: '(max-width: 767px) 100vw',
    tablet: '(max-width: 1023px) 50vw', 
    desktop: '33vw',
  },
  
  // Common responsive image size combinations
  presets: {
    hero: '(max-width: 767px) 100vw, (max-width: 1023px) 100vw, 1200px',
    card: '(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw',
    avatar: '(max-width: 767px) 64px, (max-width: 1023px) 80px, 96px',
    thumbnail: '(max-width: 767px) 150px, 200px',
  },
} as const

// === TOUCH TARGET UTILITIES === //

export const touchTargets = {
  // Minimum touch target sizes (44px minimum for accessibility)
  minimum: '44px',
  comfortable: '48px',
  large: '56px',
  
  // Touch-friendly spacing
  spacing: {
    tight: '8px',
    normal: '12px',
    loose: '16px',
    spacious: '24px',
  },
} as const

// === RESPONSIVE HELPER FUNCTIONS === //

// Check if current screen size matches breakpoint
export function matchesBreakpoint(breakpoint: Breakpoint): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(`(min-width: ${breakpoints[breakpoint]})`).matches
}

// Get current breakpoint
export function getCurrentBreakpoint(): Breakpoint | null {
  if (typeof window === 'undefined') return null
  
  const width = window.innerWidth
  
  if (width >= breakpointValues['3xl']) return '3xl'
  if (width >= breakpointValues['2xl']) return '2xl'
  if (width >= breakpointValues.xl) return 'xl'
  if (width >= breakpointValues.lg) return 'lg'
  if (width >= breakpointValues.md) return 'md'
  if (width >= breakpointValues.sm) return 'sm'
  if (width >= breakpointValues.xs) return 'xs'
  
  return null
}

// Check if device is mobile
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < breakpointValues.md
}

// Check if device is tablet
export function isTablet(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= breakpointValues.md && window.innerWidth < breakpointValues.lg
}

// Check if device is desktop
export function isDesktop(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= breakpointValues.lg
}

// Check if device supports hover
export function supportsHover(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(hover: hover)').matches
}

// Check if device is touch-based
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(pointer: coarse)').matches
}

// === RESPONSIVE UTILITY CLASSES GENERATOR === //

export function generateResponsiveClasses(
  property: string,
  values: Record<string, string | number>,
  breakpoints: Array<Breakpoint> = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
): Record<string, string> {
  const classes: Record<string, string> = {}
  
  Object.entries(values).forEach(([key, value]) => {
    // Base class (mobile first)
    classes[`${property}-${key}`] = `${property}: ${value};`
    
    // Responsive classes
    breakpoints.forEach(breakpoint => {
      classes[`${breakpoint}:${property}-${key}`] = `${mediaQueries[breakpoint]} { ${property}: ${value}; }`
    })
  })
  
  return classes
}

// === EXPORT ALL UTILITIES === //

// Note: Individual exports are already declared above, no need to re-export

// Default export with all utilities
const responsiveUtils = {
  breakpoints,
  breakpointValues,
  mediaQueries,
  containerQueries,
  aspectRatios,
  gridTemplates,
  imageBreakpoints,
  touchTargets,
  
  // Helper functions
  getResponsiveClasses,
  fluidType,
  fluidSpace,
  matchesBreakpoint,
  getCurrentBreakpoint,
  isMobile,
  isTablet,
  isDesktop,
  supportsHover,
  isTouchDevice,
  generateResponsiveClasses,
}

export default responsiveUtils