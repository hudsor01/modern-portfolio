/**
 * Comprehensive Chart System
 * Consolidates chart colors, themes, styles, and value formatters
 */

import { CHART_FORMAT_TYPES } from '@/types/chart'
import type { ChartFormatType } from '@/types/chart'
import { formatCurrency, formatPercentage, formatCompactNumber } from '@/lib/data-formatters'

// ============================================================================
// CHART COLORS - Hardcoded hex values for SVG compatibility
// ============================================================================
// Recharts uses SVG which cannot resolve CSS variables in fill/stroke attributes

export const chartColors = {
  // Primary palette
  primary: '#1e4a7d', // Navy Blue - oklch(0.35 0.12 250)
  secondary: '#2d6b50', // Forest Green - oklch(0.45 0.10 145)

  // Status colors
  success: '#2d6b50', // Forest Green
  warning: '#9a7535', // Bronze/Copper - oklch(0.55 0.12 55)
  destructive: '#b84848', // Terracotta Red - oklch(0.50 0.18 25)

  // Chart series colors (for multi-series charts)
  chart1: '#1e4a7d', // Navy Blue
  chart2: '#2d6b50', // Forest Green
  chart3: '#9a7535', // Bronze/Copper
  chart4: '#6b7280', // Slate Gray
  chart5: '#1a2b42', // Deep Navy

  // Semantic data colors
  revenue: '#1e4a7d', // chart1
  transactions: '#2d6b50', // chart2
  commissions: '#9a7535', // chart3
  cac: '#6b7280', // chart4
  ltv: '#1a2b42', // chart5
  positive: '#2d6b50', // success
  negative: '#b84848', // destructive
  neutral: '#1e4a7d', // primary

  // UI colors (axes, grid, etc.)
  grid: '#e5e7eb', // Light gray for grid lines
  axis: '#6b7280', // Gray for axis text
  muted: '#9ca3af', // Muted text
  border: '#e5e7eb', // Border color
} as const

// Chart color palette using CSS custom properties (for components that support them)
export const chartCssVars = {
  // Primary data colors
  revenue: 'var(--color-chart-1)',
  transactions: 'var(--color-chart-2)',
  commissions: 'var(--color-chart-3)',
  cac: 'var(--color-chart-4)',
  ltv: 'var(--color-chart-5)',

  // Semantic colors
  positive: 'var(--color-success)',
  negative: 'var(--color-destructive)',
  neutral: 'var(--color-primary)',
  warning: 'var(--color-warning)',

  // UI colors
  grid: 'var(--color-border)',
  axis: 'var(--color-muted-foreground)',
  background: 'var(--color-background)',
  card: 'var(--color-card)',
  cardForeground: 'var(--color-card-foreground)',
  border: 'var(--color-border)',
  popover: 'var(--color-popover)',
  popoverForeground: 'var(--color-popover-foreground)',
  mutedForeground: 'var(--color-muted-foreground)',
} as const

// Segment color mapping for categorical data
export const segmentColors = {
  // Customer segments
  Champions: chartColors.success,
  Loyal: chartColors.primary,
  Potential: chartColors.secondary,
  'At Risk': chartColors.warning,
  "Can't Lose": chartColors.destructive,

  // Channel segments
  'Certified Partners': chartColors.success,
  'Legacy Partners': chartColors.primary,
  'Direct Sales': chartColors.destructive,
  'Inactive Partners': chartColors.chart4,

  // Generic segments
  high: chartColors.success,
  medium: chartColors.warning,
  low: chartColors.destructive,
} as const

// ============================================================================
// CHART CONFIGURATION
// ============================================================================

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

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },

  // Fonts
  fonts: {
    family: 'var(--font-family)',
    sizes: {
      xs: '11px',
      sm: '12px',
      md: '14px',
      lg: '16px',
    },
  },
} as const

// ============================================================================
// CHART STYLES
// ============================================================================

// Standard tooltip styling
export const tooltipStyles = {
  backgroundColor: 'var(--color-card)',
  borderRadius: '12px',
  border: '1px solid var(--color-border)',
  backdropFilter: 'blur(10px)',
  color: 'var(--color-card-foreground)',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  padding: '12px',
} as const

// Grid styling
export const gridStyles = {
  strokeDasharray: '3 3',
  stroke: chartCssVars.grid,
  strokeOpacity: 0.3,
} as const

// Axis styling
export const axisStyles = {
  stroke: chartCssVars.axis,
  fontSize: chartConfig.fontSize.medium,
  tickLine: false,
  axisLine: {
    stroke: chartCssVars.axis,
    strokeOpacity: 0.5,
  },
} as const

// Common dot/point styling for line charts
const dotStyles = {
  strokeWidth: 2,
  r: 4,
  fill: chartCssVars.background,
} as const

const activeDotStyles = {
  r: 6,
  strokeWidth: 2,
} as const

// Common bar styling
const barStyles = {
  radius: [4, 4, 0, 0] as [number, number, number, number],
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

// ============================================================================
// FORMATTERS
// ============================================================================

export const formatters = {
  [CHART_FORMAT_TYPES.DEFAULT]: (value: number): string => value.toString(),
  [CHART_FORMAT_TYPES.CURRENCY]: (value: number): string =>
    formatCurrency(value, {
      minimumFractionDigits: value >= 1000000 ? 1 : 0,
      maximumFractionDigits: value >= 1000000 ? 1 : 0,
    }),
  [CHART_FORMAT_TYPES.PERCENTAGE]: (value: number): string =>
    formatPercentage(value, { decimals: 1 }),
  [CHART_FORMAT_TYPES.THOUSANDS]: (value: number): string =>
    value >= 1000 ? formatCompactNumber(value) : value.toString(),
  [CHART_FORMAT_TYPES.COMPACT]: (value: number): string => formatCompactNumber(value),
  [CHART_FORMAT_TYPES.CUSTOM_EXAMPLE]: (value: number): string => `Val: ${value}`,
} as const satisfies Record<ChartFormatType, (value: number) => string>

export function formatValue(
  value: number,
  format: ChartFormatType = CHART_FORMAT_TYPES.DEFAULT
): string {
  return formatters[format](value)
}
