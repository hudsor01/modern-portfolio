/**
 * Query Parameter Validation Utilities
 * Provides standardized parsing and validation for API query parameters
 */

import { logger } from '@/lib/monitoring/logger'

// Pagination defaults and limits
export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 10,
  maxLimit: 100,
} as const

// Sort direction enum
export const SortOrder = {
  ASC: 'asc',
  DESC: 'desc',
} as const

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]

/**
 * Parse and validate pagination query parameters
 */
export function parsePaginationParams(searchParams: {
  page?: string | string[]
  limit?: string | string[]
}): { page: number; limit: number; offset: number } {
  const page = parseIntParam(searchParams.page, PAGINATION_DEFAULTS.page, 1)
  const limit = parseIntParam(searchParams.limit, PAGINATION_DEFAULTS.limit, 1, PAGINATION_DEFAULTS.maxLimit)

  return {
    page,
    limit,
    offset: (page - 1) * limit,
  }
}

/**
 * Parse a string parameter that may be a string or string array
 */
export function parseStringParam(
  value: string | string[] | undefined,
  defaultValue: string
): string {
  if (!value) return defaultValue
  return Array.isArray(value) ? value[0] ?? defaultValue : value
}

/**
 * Parse and validate an integer parameter
 */
export function parseIntParam(
  value: string | string[] | undefined,
  defaultValue: number,
  min?: number,
  max?: number
): number {
  if (!value) return defaultValue

  const strValue = Array.isArray(value) ? value[0] ?? String(defaultValue) : value
  const parsed = parseInt(strValue, 10)

  if (isNaN(parsed)) {
    logger.warn('Invalid integer parameter, using default', { value: strValue, default: defaultValue })
    return defaultValue
  }

  let result = parsed

  if (min !== undefined && result < min) {
    logger.warn('Integer parameter below minimum, using minimum', { value: result, min })
    result = min
  }

  if (max !== undefined && result > max) {
    logger.warn('Integer parameter above maximum, using maximum', { value: result, max })
    result = max
  }

  return result
}

/**
 * Parse and validate a float parameter
 */
export function parseFloatParam(
  value: string | string[] | undefined,
  defaultValue: number,
  min?: number,
  max?: number
): number {
  if (!value) return defaultValue

  const strValue = Array.isArray(value) ? value[0] ?? String(defaultValue) : value
  const parsed = parseFloat(strValue)

  if (isNaN(parsed)) {
    logger.warn('Invalid float parameter, using default', { value: strValue, default: defaultValue })
    return defaultValue
  }

  let result = parsed

  if (min !== undefined && result < min) {
    result = min
  }

  if (max !== undefined && result > max) {
    result = max
  }

  return result
}

/**
 * Parse a boolean parameter
 */
export function parseBooleanParam(value: string | string[] | undefined): boolean {
  if (!value) return false
  const strValue = Array.isArray(value) ? value[0]?.toLowerCase() : value?.toLowerCase()
  return strValue === 'true' || strValue === '1'
}

/**
 * Parse an array parameter (comma-separated or multiple params)
 */
export function parseArrayParam<T>(
  value: string | string[] | undefined,
  parser: (item: string) => T,
  defaultValue: T[]
): T[] {
  if (!value) return defaultValue

  const strValue = Array.isArray(value) ? value.filter(Boolean).join(',') : value
  if (!strValue) return defaultValue

  return strValue
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map(parser)
}

/**
 * Parse and validate a sort parameter
 */
export function parseSortParam(
  value: string | string[] | undefined,
  allowedFields: string[],
  defaultField: string,
  defaultOrder: SortOrder = SortOrder.DESC
): { field: string; order: SortOrder } {
  const defaultValue = `${defaultField}:${defaultOrder}`
  const parsed = parseStringParam(value, defaultValue)
  const [field, order] = parsed.split(':').map((s) => s.trim().toLowerCase()) as [string, SortOrder]

  // Validate field is allowed
  if (!allowedFields.includes(field)) {
    logger.warn('Invalid sort field, using default', { field, allowedFields, default: defaultField })
    return { field: defaultField, order: order in SortOrder ? order : defaultOrder }
  }

  // Validate order is valid
  if (!Object.values(SortOrder).includes(order)) {
    return { field, order: defaultOrder }
  }

  return { field, order }
}

/**
 * Parse a date range from query params
 */
export function parseDateRange(
  params: {
    from?: string | string[]
    to?: string | string[]
  },
  required = false
): { from: Date | null; to: Date | null } | null {
  const fromStr = parseStringParam(params.from, '')
  const toStr = parseStringParam(params.to, '')

  if (required && (!fromStr || !toStr)) {
    return null
  }

  if (!fromStr && !toStr) {
    return { from: null, to: null }
  }

  const from = fromStr ? new Date(fromStr) : null
  const to = toStr ? new Date(toStr) : null

  // Validate dates
  if (from && isNaN(from.getTime())) {
    logger.warn('Invalid from date, ignoring', { from: fromStr })
  }
  if (to && isNaN(to.getTime())) {
    logger.warn('Invalid to date, ignoring', { to: toStr })
  }

  return { from, to }
}

/**
 * Parse a slug parameter
 */
export function parseSlugParam(value: string | string[] | undefined): string {
  const slug = parseStringParam(value, '')
  // Basic slug validation - alphanumeric and hyphens only
  return slug.replace(/[^a-z0-9-]/gi, '').toLowerCase()
}

/**
 * Parse UUID/CUID parameter
 */
export function parseIdParam(value: string | string[] | undefined): string | null {
  const id = parseStringParam(value, '')
  if (!id) return null

  // Basic validation for CUID or UUID-like IDs
  const cuidPattern = /^c[^\s-]{8,}$/
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

  if (!cuidPattern.test(id) && !uuidPattern.test(id)) {
    logger.warn('Invalid ID format', { id })
    return null
  }

  return id
}

/**
 * Sanitize a search query string
 */
export function sanitizeSearchQuery(value: string | string[] | undefined, maxLength = 200): string {
  const query = parseStringParam(value, '')
  // Remove potentially dangerous characters but keep spaces for multi-word searches
  return query
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .substring(0, maxLength)
}

/**
 * Build pagination metadata
 */
export function buildPaginationMeta(
  page: number,
  limit: number,
  total: number
): {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
} {
  const totalPages = Math.ceil(total / limit)

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}
