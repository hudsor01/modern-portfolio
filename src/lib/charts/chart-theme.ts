/**
 * Centralized chart theme and color system
 * Replaces duplicate color definitions across chart components
 */

// Chart color palette using CSS custom properties for consistency
export const chartColors = {
  // Primary data colors
  revenue: 'hsl(var(--chart-1))',
  transactions: 'hsl(var(--chart-2))',
  commissions: 'hsl(var(--chart-3))',
  cac: 'hsl(var(--chart-4))',
  ltv: 'hsl(var(--chart-5))',
  
  // Semantic colors
  positive: '#10b981', // green
  negative: '#ef4444', // red
  neutral: '#3b82f6', // blue
  warning: '#f59e0b', // amber
  
  // UI colors
  grid: 'hsl(var(--border))',
  axis: 'hsl(var(--muted-foreground))',
  background: 'hsl(var(--background))',
  card: 'hsl(var(--card))',
  cardForeground: 'hsl(var(--card-foreground))',
  border: 'hsl(var(--border))',
} as const

// Chart configuration constants
export const chartConfig = {
  // Standard margins for all charts
  margins: {
    small: { top: 10, right: 20, left: 10, bottom: 10 },
    medium: { top: 20, right: 30, left: 20, bottom: 20 },
    large: { top: 30, right: 40, left: 30, bottom: 30 },
  },
  
  // Standard heights for different chart types
  heights: {
    compact: 200,
    standard: 300,
    large: 400,
    full: 500,
  },
  
  // Animation settings
  animation: {
    duration: 1500,
    delay: 300,
    stagger: 300,
  },
  
  // Typography
  fontSize: {
    small: 10,
    medium: 12,
    large: 14,
  },
} as const

// Standard tooltip styling
export const tooltipStyles = {
  backgroundColor: 'hsl(var(--card))',
  borderRadius: '12px',
  border: '1px solid hsl(var(--border))',
  backdropFilter: 'blur(10px)',
  color: 'hsl(var(--card-foreground))',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  padding: '12px',
} as const

// Grid styling
export const gridStyles = {
  strokeDasharray: '3 3',
  stroke: chartColors.grid,
  strokeOpacity: 0.3,
} as const

// Axis styling
export const axisStyles = {
  stroke: chartColors.axis,
  fontSize: chartConfig.fontSize.medium,
  tickLine: false,
  axisLine: { 
    stroke: chartColors.axis, 
    strokeOpacity: 0.5 
  },
} as const

// Common dot/point styling for line charts
export const dotStyles = {
  strokeWidth: 2,
  r: 4,
  fill: chartColors.background,
} as const

export const activeDotStyles = {
  r: 6,
  strokeWidth: 2,
} as const

// Common bar styling
export const barStyles = {
  radius: [4, 4, 0, 0] as [number, number, number, number],
} as const

// Data formatting utilities
export const formatters = {
  currency: (value: number) => `$${value.toFixed(1)}M`,
  percentage: (value: number) => `${value.toFixed(1)}%`,
  number: (value: number) => Number.isInteger(value) ? `${value}` : value.toFixed(1),
  thousands: (value: number) => `${(value / 1000).toFixed(1)}K`,
  millions: (value: number) => `${(value / 1000000).toFixed(1)}M`,
} as const

// Chart type configurations
export const chartTypeConfigs = {
  line: {
    type: 'monotone' as const,
    strokeWidth: 2,
    dot: dotStyles,
    activeDot: activeDotStyles,
  },
  
  bar: {
    ...barStyles,
  },
  
  area: {
    type: 'monotone' as const,
    strokeWidth: 2,
    fillOpacity: 0.6,
  },
} as const