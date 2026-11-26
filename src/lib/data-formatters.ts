/**
 * Comprehensive data formatting utilities for UI consistency
 * Consolidates all formatting functions to ensure consistent data presentation
 * across all project pages as per Requirements 8.1, 8.2, 8.4, 8.5
 */

/**
 * Currency formatting options
 */
export interface CurrencyFormatOptions extends Intl.NumberFormatOptions {
  compact?: boolean
  showSymbol?: boolean
}

/**
 * Percentage formatting options
 */
export interface PercentageFormatOptions {
  decimals?: number
  showSign?: boolean
  multiplier?: number // For cases where input is already in percentage (100 = 100%)
}

/**
 * Number formatting options
 */
export interface NumberFormatOptions extends Intl.NumberFormatOptions {
  compact?: boolean
  suffix?: string
}

/**
 * Date formatting options
 */
/**
 * Every date the site renders is pinned to this zone so server and client
 * output agree regardless of the runtime timezone.
 */
const DISPLAY_TIME_ZONE = 'America/Chicago'

/** Calendar-date-only strings (YYYY-MM-DD) keep their day: formatted in UTC. */
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

export interface DateFormatOptions extends Omit<Intl.DateTimeFormatOptions, 'timeZone'> {
  relative?: boolean
  includeTime?: boolean
}

/**
 * Trend/Growth indicator options
 */
export interface TrendFormatOptions {
  showArrow?: boolean
  showSign?: boolean
  format?: 'percentage' | 'number' | 'currency'
  decimals?: number
}

/**
 * Time period formatting options
 */
export interface TimePeriodFormatOptions {
  format?: 'short' | 'long' | 'abbreviated'
  includeYear?: boolean
}

/**
 * Format currency values consistently across all project pages
 * Requirement 8.1: THE Component_Library SHALL format currency values consistently
 */
export function formatCurrency(value: number, options: CurrencyFormatOptions = {}): string {
  const {
    compact = false,
    showSymbol = true,
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
    ...intlOptions
  } = options

  if (compact) {
    return formatCompactCurrency(value, { showSymbol, ...intlOptions })
  }

  // Ensure maximumFractionDigits is at least as large as minimumFractionDigits
  const adjustedMaxFractionDigits = Math.max(minimumFractionDigits, maximumFractionDigits)

  const formatter = new Intl.NumberFormat('en-US', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'USD',
    minimumFractionDigits,
    maximumFractionDigits: adjustedMaxFractionDigits,
    ...intlOptions,
  })

  return formatter.format(value)
}

const COMPACT_TIERS = [
  { divisor: 1_000_000_000, suffix: 'B' },
  { divisor: 1_000_000, suffix: 'M' },
  { divisor: 1_000, suffix: 'K' },
] as const

/**
 * Scale to the K/M/B tier with one trimmed decimal ("1.2K", "1M"), or null below 1,000.
 * Rounds first and promotes when the rounded value reaches 1000 of the tier
 * (999_950 -> "1M", not "1000K").
 */
function compactScale(value: number): string | null {
  const abs = Math.abs(value)
  const start = COMPACT_TIERS.findIndex((t) => abs >= t.divisor)
  if (start === -1) return null
  const round1 = (n: number, divisor: number): number => Math.round((n / divisor) * 10) / 10
  let tier = COMPACT_TIERS[start]
  let rounded = round1(abs, tier?.divisor ?? 1)
  const higher = start > 0 ? COMPACT_TIERS[start - 1] : undefined
  if (rounded >= 1000 && higher) {
    tier = higher
    rounded = round1(abs, higher.divisor)
  }
  const sign = value < 0 ? '-' : ''
  return `${sign}${rounded.toFixed(1).replace(/\.0$/, '')}${tier?.suffix ?? ''}`
}

/**
 * Format currency with compact notation (K, M, B)
 */
export function formatCompactCurrency(
  value: number,
  options: Omit<CurrencyFormatOptions, 'compact'> = {}
): string {
  const { showSymbol = true } = options
  const symbol = showSymbol ? '$' : ''
  const compact = compactScale(value)
  if (compact) return `${symbol}${compact}`

  return formatCurrency(value, { ...options, compact: false })
}

/**
 * Format percentage values consistently across all project pages
 * Requirement 8.2: THE Component_Library SHALL use uniform percentage formatting
 */
export function formatPercentage(value: number, options: PercentageFormatOptions = {}): string {
  const { decimals = 1, showSign = false, multiplier = 1 } = options

  // Handle different input formats (0.25 vs 25 for 25%)
  const normalizedValue = multiplier === 100 ? value / 100 : value

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    signDisplay: showSign ? 'always' : 'auto',
  })

  return formatter.format(normalizedValue)
}

/**
 * Plain "NN.N%" — a pre-scaled number rendered with one decimal and NO thousands
 * separator (e.g. 2217 → "2217.0%"). Distinct from formatPercentage(), which
 * uses Intl percent style (÷100 + grouping). Single source for the per-project
 * `formatPercent` helpers that shipped this exact output.
 */
export function formatPercentPlain(value: number): string {
  return `${value.toFixed(1)}%`
}

/**
 * USD with whole-dollar default below $1M, switching to 1-decimal Intl-compact
 * (e.g. "$1.2M") at/above $1M — NOT the K-abbreviating formatCompactCurrency.
 * Single source for the project pages that shipped this threshold behavior.
 */
export function formatCurrencyCompactMillions(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: value >= 1_000_000 ? 1 : 0,
    notation: value >= 1_000_000 ? 'compact' : 'standard',
  }).format(value)
}

/**
 * Format numbers with consistent thousands separators
 */
export function formatNumber(value: number, options: NumberFormatOptions = {}): string {
  const {
    compact = false,
    suffix = '',
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
    ...intlOptions
  } = options

  if (compact) {
    return formatCompactNumber(value) + suffix
  }

  // Ensure maximumFractionDigits is at least as large as minimumFractionDigits
  const adjustedMaxFractionDigits = Math.max(minimumFractionDigits, maximumFractionDigits)

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits: adjustedMaxFractionDigits,
    ...intlOptions,
  })

  return formatter.format(value) + suffix
}

/**
 * Format numbers with compact notation (K, M, B)
 */
export function formatCompactNumber(value: number): string {
  // Same trailing-".0" rule as formatCompactCurrency: 1000 -> "1K", 1200 -> "1.2K".
  const compact = compactScale(value)
  if (compact) return compact
  return value.toString()
}

/**
 * Format dates consistently across all project pages
 * Requirement 8.5: THE Component_Library SHALL use consistent date formatting
 */
export function formatDate(date: Date | string | number, options: DateFormatOptions = {}): string {
  const {
    relative = false,
    includeTime = false,
    year = 'numeric',
    month = 'short',
    day = 'numeric',
    ...intlOptions
  } = options

  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date

  if (relative) {
    return formatRelativeDate(dateObj)
  }

  const formatOptions: Intl.DateTimeFormatOptions = {
    year,
    month,
    day,
    ...(includeTime && {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }),
    ...intlOptions,
    timeZone: typeof date === 'string' && DATE_ONLY.test(date) ? 'UTC' : DISPLAY_TIME_ZONE,
  }

  return new Intl.DateTimeFormat('en-US', formatOptions).format(dateObj)
}

/**
 * Year and month (0-11) of an instant on the America/Chicago calendar
 * (or another zone, for date-only inputs that must keep their calendar day).
 */
export function getDisplayYearMonth(
  now: Date = new Date(),
  timeZone: string = DISPLAY_TIME_ZONE
): { year: number; month: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
  }).formatToParts(now)
  const year = Number(parts.find((p) => p.type === 'year')?.value)
  const month = Number(parts.find((p) => p.type === 'month')?.value) - 1
  return { year, month }
}

/**
 * Format relative dates (e.g., "2 days ago", "in 3 weeks")
 */
export function formatRelativeDate(date: Date): string {
  // Handle invalid dates
  if (Number.isNaN(date.getTime())) {
    return 'Invalid date'
  }

  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  // Handle cases where the difference is not finite
  if (!Number.isFinite(diffInSeconds)) {
    return 'Invalid date'
  }

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  if (Math.abs(diffInSeconds) < 60) return rtf.format(-diffInSeconds, 'second')
  if (Math.abs(diffInSeconds) < 3600) return rtf.format(-Math.floor(diffInSeconds / 60), 'minute')
  if (Math.abs(diffInSeconds) < 86400) return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour')
  if (Math.abs(diffInSeconds) < 2592000)
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day')
  if (Math.abs(diffInSeconds) < 31536000)
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month')

  return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year')
}

/**
 * Format time periods consistently (e.g., "Q1 2024", "Jan-Mar 2024")
 * Requirement 8.5: THE Component_Library SHALL use consistent time period representations
 */
export function formatTimePeriod(
  startDate: Date | string,
  endDate: Date | string,
  options: TimePeriodFormatOptions = {}
): string {
  const { format = 'short', includeYear = true } = options

  const start = typeof startDate === 'string' ? new Date(startDate) : startDate
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate
  // Same rule as formatDate: date-only strings keep their calendar day (UTC).
  const startZone =
    typeof startDate === 'string' && DATE_ONLY.test(startDate) ? 'UTC' : DISPLAY_TIME_ZONE
  const endZone = typeof endDate === 'string' && DATE_ONLY.test(endDate) ? 'UTC' : DISPLAY_TIME_ZONE
  const fmt = (d: Date, timeZone: string, opts: Intl.DateTimeFormatOptions): string =>
    d.toLocaleDateString('en-US', { ...opts, timeZone })

  const startYear = getDisplayYearMonth(start, startZone).year
  const endYear = getDisplayYearMonth(end, endZone).year
  const sameYear = startYear === endYear

  switch (format) {
    case 'short':
      if (sameYear) {
        const startMonth = fmt(start, startZone, { month: 'short' })
        const endMonth = fmt(end, endZone, { month: 'short' })
        return includeYear ? `${startMonth}-${endMonth} ${startYear}` : `${startMonth}-${endMonth}`
      }
      return `${fmt(start, startZone, { month: 'short', year: '2-digit' })}-${fmt(end, endZone, { month: 'short', year: '2-digit' })}`

    case 'long':
      if (sameYear) {
        const startMonth = fmt(start, startZone, { month: 'long' })
        const endMonth = fmt(end, endZone, { month: 'long' })
        return includeYear
          ? `${startMonth} - ${endMonth} ${startYear}`
          : `${startMonth} - ${endMonth}`
      }
      return `${fmt(start, startZone, { month: 'long', year: 'numeric' })} - ${fmt(end, endZone, { month: 'long', year: 'numeric' })}`

    case 'abbreviated':
      return `${fmt(start, startZone, { month: 'numeric', day: 'numeric' })}-${fmt(end, endZone, { month: 'numeric', day: 'numeric' })}${includeYear ? `/${startYear}` : ''}`

    default:
      return formatTimePeriod(startDate, endDate, { ...options, format: 'short' })
  }
}

/**
 * Format metric comparison and growth indicators consistently
 * Requirement 8.4: THE Component_Library SHALL provide standardized metric comparison and growth indicators
 */
export function formatTrend(value: number, options: TrendFormatOptions = {}): string {
  const { showArrow = true, showSign = true, format = 'percentage', decimals = 1 } = options

  let formattedValue: string

  switch (format) {
    case 'currency':
      formattedValue = formatCurrency(Math.abs(value), {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
      break
    case 'number':
      formattedValue = formatNumber(Math.abs(value), {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
      break
    default:
      formattedValue = formatPercentage(Math.abs(value), { decimals })
      break
  }

  const sign = value >= 0 ? '+' : '-'
  const arrow = value >= 0 ? '↗' : '↘'

  let result = formattedValue

  if (showSign && format !== 'percentage') {
    result = `${sign}${result}`
  }

  if (showArrow) {
    result = `${arrow} ${result}`
  }

  return result
}

/**
 * Format growth indicators with direction and styling context
 */
export function formatGrowthIndicator(
  value: number,
  options: TrendFormatOptions = {}
): {
  formatted: string
  direction: 'up' | 'down' | 'neutral'
  variant: 'success' | 'destructive' | 'secondary'
} {
  const formatted = formatTrend(value, options)

  let direction: 'up' | 'down' | 'neutral'
  let variant: 'success' | 'destructive' | 'secondary'

  if (value > 0) {
    direction = 'up'
    variant = 'success'
  } else if (value < 0) {
    direction = 'down'
    variant = 'destructive'
  } else {
    direction = 'neutral'
    variant = 'secondary'
  }

  return { formatted, direction, variant }
}

/**
 * Format duration in a human-readable format
 */
export function formatDuration(
  milliseconds: number,
  options: { format?: 'short' | 'long' } = {}
): string {
  const { format = 'short' } = options

  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return format === 'long' ? `${days} day${days !== 1 ? 's' : ''}` : `${days}d`
  }
  if (hours > 0) {
    return format === 'long' ? `${hours} hour${hours !== 1 ? 's' : ''}` : `${hours}h`
  }
  if (minutes > 0) {
    return format === 'long' ? `${minutes} minute${minutes !== 1 ? 's' : ''}` : `${minutes}m`
  }

  return format === 'long' ? `${seconds} second${seconds !== 1 ? 's' : ''}` : `${seconds}s`
}
