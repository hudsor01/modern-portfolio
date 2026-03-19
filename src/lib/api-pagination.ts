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

/**
 * Parse pagination parameters from URL search params.
 * Includes validation and abuse prevention.
 */
export function parsePaginationParams(
  searchParams: URLSearchParams,
  defaults?: { page?: number; limit?: number; maxLimit?: number }
): PaginationParams {
  const { page: defaultPage = 1, limit: defaultLimit = 10, maxLimit = 100 } = defaults || {}

  const page = Math.max(1, parseInt(searchParams.get('page') || String(defaultPage), 10))
  const limit = Math.min(
    Math.max(1, parseInt(searchParams.get('limit') || String(defaultLimit), 10)),
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
