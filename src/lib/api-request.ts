/**
 * API Request Utilities — Canonical request parsing
 * Single source of truth for getClientIdentifier / getClientIdentifierFromHeaders.
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
  // Platform-set headers FIRST, client-influenced ones last.
  //
  // On Vercel all of these carry the same client IP, because Vercel "overwrites
  // the X-Forwarded-For header and does not forward external IPs ... to prevent
  // IP spoofing" (https://vercel.com/docs/headers/request-headers). The ordering
  // only matters off that happy path — behind a proxy in front of Vercel, or in
  // any non-Vercel deployment — where `x-forwarded-for` is attacker-controlled
  // but `x-vercel-forwarded-for` / `x-real-ip` are not. Reading the
  // platform-set header first costs nothing and removes the footgun.
  //
  // `x-forwarded-for` remains a last resort, and takes the LEFTMOST entry,
  // which is the original client in a well-formed chain.
  const ip =
    headers.get('x-vercel-forwarded-for')?.trim() ||
    headers.get('x-real-ip')?.trim() ||
    headers.get('cf-connecting-ip')?.trim() ||
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'

  // Deliberately IP-only — do NOT mix the User-Agent into this key.
  //
  // It used to return `${ip}:${base64(userAgent).slice(0, 8)}`. User-Agent is
  // fully client-controlled, so varying it minted a brand-new rate-limit bucket
  // on demand: an attacker incrementing one byte of their UA string got
  // unlimited fresh allowances from a single IP, which defeats every limit that
  // keys on this value — the contact form's 3/hr and `sensitive`'s 10/hr on
  // every blog mutation route.
  //
  // The User-Agent is still used, but as an abuse *signal* rather than part of
  // the identity: callers pass it as `context.userAgent`, which the limiter
  // already scores for bot/scraper patterns (src/lib/rate-limiter/store.ts).
  // That is the correct place for an attacker-supplied string — it can raise
  // suspicion, never widen an allowance.
  return ip
}

/**
 * The client's User-Agent, for rate-limiter suspicion scoring only.
 *
 * Never fold this into a bucket key — see the note in
 * `getClientIdentifierFromHeaders`.
 */
export function getClientUserAgent(headers: HeaderGetter): string | undefined {
  return headers.get('user-agent') ?? undefined
}

/**
 * Extract client identifier from a Request-like object for rate limiting.
 * Canonical implementation — the single source of truth for client identification.
 */
export function getClientIdentifier(request: NextRequest | Request): string {
  return getClientIdentifierFromHeaders(request.headers)
}
