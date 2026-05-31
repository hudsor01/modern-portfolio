/**
 * API Request Utilities — Canonical request parsing
 * Single source of truth for getClientIdentifier, getRequestMetadata, parseRequestBody.
 */

import type { NextRequest } from 'next/server'

// ============================================================================
// CLIENT IDENTIFICATION
// ============================================================================

/**
 * Structural type for anything with `.get(name)` returning `string | null` —
 * matches both Web `Headers` and Next's `ReadonlyHeaders` (returned by `headers()`).
 */
export type HeaderGetter = { get(name: string): string | null }

/**
 * Extract client identifier from a Headers-like object for rate limiting.
 * Used by both API route handlers (via `getClientIdentifier`) and server actions
 * (via `headers()` from `next/headers`) — same identifier shape for both, so
 * rate-limit buckets stay aligned across entry points.
 */
export function getClientIdentifierFromHeaders(headers: HeaderGetter): string {
  // Try to get IP from various headers (Vercel, Cloudflare, etc.)
  const forwarded = headers.get('x-forwarded-for')
  const realIp = headers.get('x-real-ip')
  const cfConnectingIp = headers.get('cf-connecting-ip')
  const vercelForwardedFor = headers.get('x-vercel-forwarded-for')

  const ip =
    forwarded?.split(',')[0]?.trim() || realIp || cfConnectingIp || vercelForwardedFor || 'unknown'

  // Add user agent hash as additional identifier
  const userAgent = headers.get('user-agent') || 'unknown'
  const userAgentHash = Buffer.from(userAgent).toString('base64').slice(0, 8)

  return `${ip}:${userAgentHash}`
}

/**
 * Extract client identifier from a Request-like object for rate limiting.
 * Canonical implementation — replaces all duplicates in api-utils.ts and rate-limiter/helpers.ts.
 */
export function getClientIdentifier(request: NextRequest | Request): string {
  return getClientIdentifierFromHeaders(request.headers)
}
