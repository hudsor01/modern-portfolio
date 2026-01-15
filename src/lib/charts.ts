/**
 * Comprehensive Chart System
 * Consolidates chart colors, themes, utilities, and validators
 */

import { CHART_FORMAT_TYPES } from '@/types/chart'
import type {
  ChartDataPoint,
  ChartData,
  RevenueData,
  FunnelStageData,
  LeadSourceData,
  ChartFormatType,
  ChartColor,
} from '@/types/chart'
import { formatCurrency, formatPercentage, formatCompactNumber } from '@/lib/data-formatters'

// ============================================================================
// CHART COLORS - Hardcoded hex values for SVG compatibility
// ============================================================================
// Recharts uses SVG which cannot resolve CSS variables in fill/stroke attributes

export const chartColors = {
  // Primary palette
  primary: '#1e4a7d',      // Navy Blue - oklch(0.35 0.12 250)
  secondary: '#2d6b50',    // Forest Green - oklch(0.45 0.10 145)

  // Status colors
  success: '#2d6b50',      // Forest Green
  warning: '#9a7535',      // Bronze/Copper - oklch(0.55 0.12 55)
  destructive: '#b84848',  // Terracotta Red - oklch(0.50 0.18 25)

  // Chart series colors (for multi-series charts)
  chart1: '#1e4a7d',       // Navy Blue
  chart2: '#2d6b50',       // Forest Green
  chart3: '#9a7535',       // Bronze/Copper
  chart4: '#6b7280',       // Slate Gray
  chart5: '#1a2b42',       // Deep Navy

  // Semantic data colors
  revenue: '#1e4a7d',      // chart1
  transactions: '#2d6b50', // chart2
  commissions: '#9a7535',  // chart3
  cac: '#6b7280',          // chart4
  ltv: '#1a2b42',          // chart5
  positive: '#2d6b50',     // success
  negative: '#b84848',     // destructive
  neutral: '#1e4a7d',      // primary

  // UI colors (axes, grid, etc.)
  grid: '#e5e7eb',         // Light gray for grid lines
  axis: '#6b7280',         // Gray for axis text
  muted: '#9ca3af',        // Muted text
  border: '#e5e7eb',       // Border color
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
    strokeOpacity: 0.5
  },
} as const

// Common dot/point styling for line charts
export const dotStyles = {
  strokeWidth: 2,
  r: 4,
  fill: chartCssVars.background,
} as const

export const activeDotStyles = {
  r: 6,
  strokeWidth: 2,
} as const

// Common bar styling
export const barStyles = {
  radius: [4, 4, 0, 0] as [number, number, number, number],
} as const

// Gradient definitions for area charts
export const chartGradients = {
  primary: {
    id: 'primaryGradient',
    startColor: chartColors.primary,
    startOpacity: 0.3,
    endOpacity: 0,
  },
  secondary: {
    id: 'secondaryGradient',
    startColor: chartColors.secondary,
    startOpacity: 0.3,
    endOpacity: 0,
  },
  success: {
    id: 'successGradient',
    startColor: chartColors.success,
    startOpacity: 0.3,
    endOpacity: 0,
  },
  warning: {
    id: 'warningGradient',
    startColor: chartColors.warning,
    startOpacity: 0.3,
    endOpacity: 0,
  },
  destructive: {
    id: 'destructiveGradient',
    startColor: chartColors.destructive,
    startOpacity: 0.3,
    endOpacity: 0,
  },
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

// Quick formatters (standalone)
export const quickFormatters = {
  currency: (value: number) => `$${value.toFixed(1)}M`,
  percentage: (value: number) => `${value.toFixed(1)}%`,
  number: (value: number) => Number.isInteger(value) ? `${value}` : value.toFixed(1),
  thousands: (value: number) => `${(value / 1000).toFixed(1)}K`,
  millions: (value: number) => `${(value / 1000000).toFixed(1)}M`,
} as const

// ============================================================================
// VALIDATORS
// ============================================================================

export function isValidChartData<T extends ChartDataPoint>(data: unknown): data is T[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'name' in item &&
        'value' in item &&
        typeof (item as ChartDataPoint).name === 'string' &&
        typeof (item as ChartDataPoint).value === 'number'
    )
  )
}

export function isRevenueData(data: unknown): data is RevenueData[] {
  return (
    isValidChartData(data) &&
    (data as ChartDataPoint[]).every(
      (item) =>
        'revenue' in item &&
        'period' in item &&
        typeof (item as RevenueData).revenue === 'number' &&
        (item as RevenueData).period instanceof Date
    )
  )
}

export function isFunnelData(data: unknown): data is FunnelStageData[] {
  return (
    isValidChartData(data) &&
    (data as ChartDataPoint[]).every(
      (item) =>
        'stage' in item &&
        'count' in item &&
        typeof (item as FunnelStageData).stage === 'string' &&
        typeof (item as FunnelStageData).count === 'number'
    )
  )
}

export function isLeadSourceData(data: unknown): data is LeadSourceData[] {
  return (
    isValidChartData(data) &&
    (data as ChartDataPoint[]).every(
      (item) =>
        'source' in item &&
        'leads' in item &&
        'conversions' in item &&
        'conversionRate' in item &&
        typeof (item as LeadSourceData).source === 'string' &&
        typeof (item as LeadSourceData).leads === 'number' &&
        typeof (item as LeadSourceData).conversions === 'number' &&
        typeof (item as LeadSourceData).conversionRate === 'number'
    )
  )
}

// ============================================================================
// COLOR UTILITIES
// ============================================================================

export function generateChartColors(count: number): ChartColor[] {
  const baseColors: ChartColor[] = [
    'var(--color-chart-1)',
    'var(--color-chart-2)',
    'var(--color-chart-3)',
    'var(--color-chart-4)',
    'var(--color-chart-5)',
  ]

  // If we need more colors than base, generate variations
  if (count <= baseColors.length) {
    return baseColors.slice(0, count)
  }

  const colors: ChartColor[] = [...baseColors]
  for (let i = baseColors.length; i < count; i++) {
    const baseIndex = i % baseColors.length
    const strength = Math.max(30, 80 - (i - baseColors.length) * 10)
    colors.push(`color-mix(in oklch, ${baseColors[baseIndex]} ${strength}%, transparent)`)
  }

  return colors
}

// ============================================================================
// DATA TRANSFORMERS
// ============================================================================

export function transformToChartData<T extends Record<string, unknown>>(
  data: T[],
  nameKey: keyof T,
  valueKey: keyof T
): ChartData[] {
  return data.map((item, index) => ({
    name: String(item[nameKey]),
    value: Number(item[valueKey]) || 0,
    id: String(index),
    metadata: {
      source: 'Data transformation utility',
    },
  }))
}

export function transformToRevenueData<T extends Record<string, unknown>>(
  data: T[],
  nameKey: keyof T,
  revenueKey: keyof T,
  periodKey: keyof T,
  growthKey?: keyof T
): RevenueData[] {
  return data.map((item, index) => ({
    name: String(item[nameKey]),
    value: Number(item[revenueKey]) || 0,
    revenue: Number(item[revenueKey]) || 0,
    period: new Date(String(item[periodKey])),
    growth: growthKey ? Number(item[growthKey]) : undefined,
    id: String(index),
    metadata: {
      source: 'Revenue data transformation',
    },
  }))
}

// ============================================================================
// CHART THEME CONFIG
// ============================================================================

export const chartThemeConfig = {
  colors: {
    primary: [
      'var(--color-chart-1)',
      'var(--color-chart-2)',
      'var(--color-chart-3)',
      'var(--color-chart-4)',
      'var(--color-chart-5)',
    ],
    grid: 'var(--color-border)',
    axis: 'var(--color-muted-foreground)',
    background: 'var(--color-card)',
    foreground: 'var(--color-card-foreground)',
    border: 'var(--color-border)',
  },
  spacing: chartConfig.spacing,
  fonts: chartConfig.fonts,
} as const

// ============================================================================
// CHART CONFIG BUILDER
// ============================================================================

export function buildChartConfig<T extends ChartDataPoint>(
  data: T[],
  options?: {
    colors?: ChartColor[]
    formatType?: ChartFormatType
    showGrid?: boolean
    showLegend?: boolean
  }
) {
  const colors = options?.colors || generateChartColors(data.length)
  const formatType = options?.formatType || CHART_FORMAT_TYPES.DEFAULT

  return {
    data: data.map((item, index) => ({
      ...item,
      fill: colors[index % colors.length],
      color: colors[index % colors.length],
    })),
    colors,
    formatValue: (value: number) => formatValue(value, formatType),
    theme: chartThemeConfig,
    options: {
      showGrid: options?.showGrid ?? true,
      showLegend: options?.showLegend ?? true,
    },
  }
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

export class ChartDataError extends Error {
  constructor(
    message: string,
    public readonly data?: unknown
  ) {
    super(`Chart Data Error: ${message}`)
    this.name = 'ChartDataError'
  }
}

export function validateChartData<T extends ChartDataPoint>(
  data: unknown,
  validator: (data: unknown) => data is T[]
): T[] {
  if (!Array.isArray(data)) {
    throw new ChartDataError('Data must be an array', data)
  }

  if (!validator(data)) {
    throw new ChartDataError('Data does not match expected chart data structure', data)
  }

  return data
}

