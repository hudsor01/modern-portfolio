/**
 * Rate-limiter tuning — the single source consumed by
 * src/lib/rate-limiter/store.ts.
 *
 * NOTE: HTTP security headers (X-Frame-Options, HSTS, Referrer-Policy,
 * Permissions-Policy, etc.) are NOT configured here. They live in
 * next.config.js `headers()` (the values that actually ship) and are
 * regression-pinned end-to-end in e2e/security-headers.spec.ts against the live
 * response. A parallel copy here previously drifted out of sync (xssProtection
 * true vs the live '0', interest-cohort vs the live browsing-topics) without any
 * consumer — so it was removed to keep one source of truth for the header policy.
 */

export interface SecurityConfig {
  // Rate Limiting
  rateLimitWindowMs: number
  rateLimitMaxRequests: number
  rateLimitClientExpiryMs: number
  rateLimitMaxHistoryPerClient: number
  rateLimitMaxStoreSize: number
  rateLimitHistoryRetentionMs: number
  rateLimitAbsoluteExpiryMs: number
}

export const securityConfig: SecurityConfig = {
  // Rate Limiting (per API route)
  rateLimitWindowMs: 60 * 1000, // 1 minute
  rateLimitMaxRequests: 10, // 10 requests per minute
  // Evict a client's record after this much inactivity (no new attempts).
  rateLimitClientExpiryMs: 15 * 60 * 1000, // 15 minutes
  // Max request-timestamp entries retained per client (bounds per-record memory).
  rateLimitMaxHistoryPerClient: 100,
  // Max distinct clients tracked before LRU eviction kicks in (bounds total memory).
  rateLimitMaxStoreSize: 10_000,
  // How long request timestamps are kept for burst/abuse analysis.
  rateLimitHistoryRetentionMs: 15 * 60 * 1000, // 15 minutes
  // Hard ceiling: a record is dropped this long after creation regardless of
  // activity, so penalties/blocks accrued within the window are no longer reset
  // on every cleanup cycle. Must be >> rateLimitClientExpiryMs for the
  // inactivity sweep to remain the dominant eviction path for idle clients.
  rateLimitAbsoluteExpiryMs: 24 * 60 * 60 * 1000, // 24 hours
}
