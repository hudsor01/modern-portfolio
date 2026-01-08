/**
 * Data Formatter Types - Centralized
 * Consolidated from src/lib/utils/data-formatters.ts
 */

export interface CurrencyFormatOptions extends Intl.NumberFormatOptions {
  compact?: boolean
  currency?: string
  locale?: string
}

export interface PercentageFormatOptions {
  decimals?: number
  showSign?: boolean
}

export interface NumberFormatOptions extends Intl.NumberFormatOptions {
  compact?: boolean
  locale?: string
}

export interface DateFormatOptions extends Intl.DateTimeFormatOptions {
  relative?: boolean
  format?: 'short' | 'long' | 'abbreviated' | 'full'
}

export interface TrendFormatOptions {
  showArrow?: boolean
  showPercentage?: boolean
  inverse?: boolean // For metrics where down is good (e.g., bounce rate)
}

export interface TimePeriodFormatOptions {
  format?: 'short' | 'long' | 'abbreviated'
  separator?: string
}

export type FormatterName = 'currency' | 'percentage' | 'number' | 'date' | 'relativeTime'

export interface FormatterConfig {
  currency: {
    locales: string | string[]
    options: CurrencyFormatOptions
  }
  percentage: {
    decimals: number
    showSign: boolean
  }
  number: {
    locales: string | string[]
    options: NumberFormatOptions
  }
  date: {
    locales: string | string[]
    options: DateFormatOptions
  }
}

// Helper types for formatter functions
export type FormatterReturnType<T> = T extends (value: infer V) => infer R ? (value: V) => R : never
