/**
 * API Headers — Single Source of Truth
 * Provides createApiHeaders, CachePresets, CacheConfig, RateLimitHeaders.
 * This is the canonical location for all Cache-Control and rate-limit header logic (R12).
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface CacheConfig {
  maxAge?: number
  sMaxAge?: number
  staleWhileRevalidate?: number
  visibility?: 'public' | 'private'
  noStore?: boolean
}

export interface RateLimitHeaders {
  limit?: number
  remaining?: number
  resetTime?: number
  retryAfter?: number
}

// ============================================================================
// CACHE PRESETS
// ============================================================================

/**
 * Preset cache configurations for common scenarios
 */
export const CachePresets = {
  noCache: {
    noStore: true,
  } as CacheConfig,

  short: {
    visibility: 'public' as const,
    maxAge: 300, // 5 minutes
    sMaxAge: 600, // 10 minutes
    staleWhileRevalidate: 1800, // 30 minutes
  } as CacheConfig,

  medium: {
    visibility: 'public' as const,
    maxAge: 3600, // 1 hour
    sMaxAge: 7200, // 2 hours
    staleWhileRevalidate: 86400, // 24 hours
  } as CacheConfig,

  long: {
    visibility: 'public' as const,
    maxAge: 86400, // 24 hours
    sMaxAge: 604800, // 7 days
    staleWhileRevalidate: 2592000, // 30 days
  } as CacheConfig,
}

// ============================================================================
// HEADER CREATION
// ============================================================================

/**
 * Create standardized API response headers.
 * Single source of truth for Cache-Control and X-RateLimit-* headers (R12).
 */
export function createApiHeaders(
  cacheConfig?: CacheConfig,
  rateLimitHeaders?: RateLimitHeaders
): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
  }

  // Cache-Control header
  if (cacheConfig?.noStore) {
    headers['Cache-Control'] = 'no-store, no-cache, must-revalidate'
  } else if (cacheConfig) {
    const { maxAge = 0, sMaxAge, staleWhileRevalidate, visibility = 'private' } = cacheConfig

    const parts: string[] = [visibility]

    if (maxAge > 0) {
      parts.push(`max-age=${maxAge}`)
    } else {
      parts.push('no-cache')
    }

    if (sMaxAge !== undefined && sMaxAge > 0) {
      parts.push(`s-maxage=${sMaxAge}`)
    }

    if (staleWhileRevalidate !== undefined && staleWhileRevalidate > 0) {
      parts.push(`stale-while-revalidate=${staleWhileRevalidate}`)
    }

    headers['Cache-Control'] = parts.join(', ')
  } else {
    // Default: no caching
    headers['Cache-Control'] = 'no-store'
  }

  // Rate limit headers
  if (rateLimitHeaders) {
    if (rateLimitHeaders.limit !== undefined) {
      headers['X-RateLimit-Limit'] = String(rateLimitHeaders.limit)
    }
    if (rateLimitHeaders.remaining !== undefined) {
      headers['X-RateLimit-Remaining'] = String(rateLimitHeaders.remaining)
    }
    if (rateLimitHeaders.resetTime !== undefined) {
      headers['X-RateLimit-Reset'] = String(rateLimitHeaders.resetTime)
    }
    if (rateLimitHeaders.retryAfter !== undefined) {
      headers['Retry-After'] = String(Math.ceil(rateLimitHeaders.retryAfter / 1000))
    }
  }

  return headers
}
