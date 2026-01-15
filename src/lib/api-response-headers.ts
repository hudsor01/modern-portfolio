/**
 * API Response Headers Utility
 * Standardizes HTTP headers across all API routes
 */

export interface CacheConfig {
  /**
   * Cache duration in seconds for browser cache (max-age)
   * @default 0 (no cache)
   */
  maxAge?: number

  /**
   * Cache duration in seconds for CDN/proxy cache (s-maxage)
   * @default undefined (uses maxAge)
   */
  sMaxAge?: number

  /**
   * Allow stale content while revalidating
   * @default undefined
   */
  staleWhileRevalidate?: number

  /**
   * Cache visibility (public or private)
   * @default 'private'
   */
  visibility?: 'public' | 'private'

  /**
   * Disable all caching
   * @default false
   */
  noStore?: boolean
}

export interface RateLimitHeaders {
  /**
   * Maximum requests allowed in the current window
   */
  limit?: number

  /**
   * Remaining requests in the current window
   */
  remaining?: number

  /**
   * Unix timestamp (ms) when the rate limit resets
   */
  resetTime?: number

  /**
   * Seconds until the client can retry (for 429 responses)
   */
  retryAfter?: number
}

/**
 * Create standardized API response headers
 *
 * @param options - Configuration for headers
 * @returns Headers object suitable for NextResponse
 *
 * @example
 * ```typescript
 * return NextResponse.json(data, {
 *   headers: createApiHeaders({
 *     maxAge: 3600,
 *     sMaxAge: 7200,
 *     staleWhileRevalidate: 86400
 *   })
 * })
 * ```
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

/**
 * Preset cache configurations for common scenarios
 */
export const CachePresets = {
  /**
   * No caching - use for dynamic/sensitive data
   */
  noCache: {
    noStore: true,
  } as CacheConfig,

  /**
   * Short-lived cache (5 minutes browser, 10 minutes CDN)
   * Good for: Blog posts, project data, frequently updated content
   */
  short: {
    visibility: 'public' as const,
    maxAge: 300, // 5 minutes
    sMaxAge: 600, // 10 minutes
    staleWhileRevalidate: 1800, // 30 minutes
  } as CacheConfig,

  /**
   * Medium-lived cache (1 hour browser, 2 hours CDN)
   * Good for: Static content, infrequently updated data
   */
  medium: {
    visibility: 'public' as const,
    maxAge: 3600, // 1 hour
    sMaxAge: 7200, // 2 hours
    staleWhileRevalidate: 86400, // 24 hours
  } as CacheConfig,

  /**
   * Long-lived cache (24 hours browser, 7 days CDN)
   * Good for: Images, assets, archived content
   */
  long: {
    visibility: 'public' as const,
    maxAge: 86400, // 24 hours
    sMaxAge: 604800, // 7 days
    staleWhileRevalidate: 2592000, // 30 days
  } as CacheConfig,
}
