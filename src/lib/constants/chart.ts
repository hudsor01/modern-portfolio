/**
 * Shared chart constants and configurations
 * Eliminates duplication across 21+ chart components
 */

/**
 * Standard chart colors using CSS custom properties
 * These map to the theme colors defined in globals.css
 */
export const chartColors = {
  primary: 'hsl(var(--chart-1))',
  secondary: 'hsl(var(--chart-2))',
  tertiary: 'hsl(var(--chart-3))',
  quaternary: 'hsl(var(--chart-4))',
  quinary: 'hsl(var(--chart-5))',
  
  // Semantic colors
  positive: '#10b981',
  negative: '#ef4444',
  neutral: '#6b7280',
  warning: '#f59e0b',
  info: '#3b82f6',
  
  // Chart element colors
  grid: 'hsl(var(--border))',
  axis: 'hsl(var(--muted-foreground))',
  label: 'hsl(var(--muted-foreground))',
  text: 'hsl(var(--foreground))',
  background: 'hsl(var(--background))',
  
  // Partner/revenue specific colors (used in multiple charts)
  certified: '#3b82f6',
  platinum: '#8b5cf6',
  gold: '#f59e0b',
  silver: '#6b7280',
  bronze: '#a16207',
  legacy: '#94a3b8',
} as const

/**
 * Standard chart margins
 */
export const chartMargins = {
  default: { top: 20, right: 30, left: 20, bottom: 20 },
  withLegend: { top: 20, right: 30, left: 20, bottom: 60 },
  vertical: { top: 20, right: 30, left: 150, bottom: 20 },
  compact: { top: 10, right: 10, left: 10, bottom: 10 },
} as const

/**
 * Standard chart heights
 */
export const chartHeights = {
  small: 200,
  medium: 300,
  default: 350,
  large: 400,
  xl: 500,
} as const

/**
 * Standard chart configurations for common use cases
 */
export const chartConfigs = {
  revenue: {
    revenue: {
      label: 'Revenue',
      color: chartColors.primary,
    },
  },
  growth: {
    growth: {
      label: 'Growth',
      color: chartColors.secondary,
    },
  },
  performance: {
    performance: {
      label: 'Performance',
      color: chartColors.tertiary,
    },
  },
  multiMetric: {
    revenue: {
      label: 'Revenue',
      color: chartColors.primary,
    },
    growth: {
      label: 'Growth',
      color: chartColors.secondary,
    },
    performance: {
      label: 'Performance',
      color: chartColors.tertiary,
    },
  },
  partners: {
    certified: {
      label: 'Certified',
      color: chartColors.certified,
    },
    platinum: {
      label: 'Platinum',
      color: chartColors.platinum,
    },
    gold: {
      label: 'Gold',
      color: chartColors.gold,
    },
    silver: {
      label: 'Silver',
      color: chartColors.silver,
    },
  },
} as const

/**
 * Animation configurations
 */
export const chartAnimations = {
  duration: 300,
  easing: 'ease-out',
} as const

/**
 * Grid configurations
 */
export const chartGrid = {
  strokeDasharray: '3 3',
  strokeOpacity: 0.3,
  vertical: false,
  horizontal: true,
} as const