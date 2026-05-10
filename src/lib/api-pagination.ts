/**
 * API Pagination Utilities — parsePaginationParams, createPaginationMeta, PaginationParams
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface PaginationParams {
  page: number
  limit: number
  skip: number
}

// ============================================================================
// PAGINATION PARSING
// ============================================================================

// Strict integer-string parse: rejects NaN, partial parses ('5abc'),
// decimals ('5.5'), and whitespace-only ('  '). Falls back to defaultValue
// for any non-integer input. Negative integers pass through and are clamped
// downstream by Math.max(1, ...).
function parseIntegerParam(value: string | null, defaultValue: number): number {
  if (value === null) return defaultValue
  const trimmed = value.trim()
  if (!/^-?\d+$/.test(trimmed)) return defaultValue
  return parseInt(trimmed, 10)
}

/**
 * Parse pagination parameters from URL search params.
 * Includes validation and abuse prevention.
 */
export function parsePaginationParams(
  searchParams: URLSearchParams,
  defaults?: { page?: number; limit?: number; maxLimit?: number; maxPage?: number }
): PaginationParams {
  const {
    page: defaultPage = 1,
    limit: defaultLimit = 10,
    maxLimit = 100,
    // maxPage exists to prevent Postgres OFFSET overflow. With default
    // maxPage * maxLimit = 10_000 * 100 = 1_000_000, skip stays well below
    // int4 max (2^31-1). Without this cap, ?page=999999999&limit=100 would
    // produce skip=~10^11 and crash Drizzle's offset() with "out of range".
    maxPage = 10_000,
  } = defaults || {}

  const page = Math.min(
    Math.max(1, parseIntegerParam(searchParams.get('page'), defaultPage)),
    maxPage
  )
  const limit = Math.min(
    Math.max(1, parseIntegerParam(searchParams.get('limit'), defaultLimit)),
    maxLimit
  )
  const skip = (page - 1) * limit

  return { page, limit, skip }
}

// ============================================================================
// PAGINATION METADATA
// ============================================================================

/**
 * Create pagination metadata for API responses
 */
export function createPaginationMeta(
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
