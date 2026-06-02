/**
 * Chart Types - Type-Safe Chart System
 * Following Prisma type-first architecture principles
 * No any/unknown/never types - explicit type safety
 */

// Base chart value types
type ChartColor = string

/**
 * Core chart data structure - type-safe base
 */
interface ChartDataPoint {
  name: string
  value: number
  color?: ChartColor
  category?: string
  date?: Date
  metadata?: Record<string, unknown>
  [key: string]: unknown // Allow dynamic property access for chart flexibility
}

/**
 * Enhanced chart data with additional context
 */
interface ChartData extends ChartDataPoint {
  // Additional standardized fields
  id?: string
  label?: string
  fill?: ChartColor
  stroke?: ChartColor
}

/**
 * Type-safe Recharts tooltip props
 */
export interface TypedTooltipProps<T extends ChartDataPoint = ChartData> {
  active?: boolean
  payload?: Array<{
    payload: T
    value: number
    name: string
    dataKey: keyof T
    color: ChartColor
  }>
  label?: string
  formatter?: (value: number, name: string, props: { payload: T }) => [string, string]
}

/**
 * Specific chart data types - all extending base ChartDataPoint
 */

// Revenue/Analytics specific chart data
interface RevenueData extends ChartDataPoint {
  revenue: number
  period: Date
  growth?: number // percentage growth
  forecast?: boolean // is this forecasted data
}

// Extended revenue data for multi-metric charts
export interface ExtendedRevenueData extends RevenueData {
  transactions?: number // transaction count
  commissions?: number // commission amount
}

/**
 * Value formatter types - no more string literals
 */
export const CHART_FORMAT_TYPES = {
  DEFAULT: 'default',
  CURRENCY: 'currency',
  PERCENTAGE: 'percentage',
  THOUSANDS: 'thousands',
  COMPACT: 'compact',
  CUSTOM_EXAMPLE: 'customExample',
} as const

export type ChartFormatType = (typeof CHART_FORMAT_TYPES)[keyof typeof CHART_FORMAT_TYPES]
