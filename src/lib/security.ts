/**
 * Security Configuration
 * Central configuration for all security-related settings
 */

export interface SecurityConfig {
  // Security Headers
  frameOptions: string
  contentTypeOptions: boolean
  xssProtection: boolean
  referrerPolicy: string

  // HSTS Configuration
  hstsMaxAge: number
  hstsIncludeSubDomains: boolean
  hstsPreload: boolean

  // Permissions Policy
  permissionsPolicy: string[]

  // Cross-Origin Policies
  crossOriginEmbedderPolicy: string
  crossOriginOpenerPolicy: string
  crossOriginResourcePolicy: string

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
  // Security Headers
  frameOptions: 'DENY',
  contentTypeOptions: true,
  xssProtection: true,
  referrerPolicy: 'strict-origin-when-cross-origin',

  // HSTS Configuration (1 year)
  hstsMaxAge: 31536000,
  hstsIncludeSubDomains: true,
  hstsPreload: true,

  // Permissions Policy
  permissionsPolicy: ['camera=()', 'microphone=()', 'geolocation=()', 'interest-cohort=()'],

  // Cross-Origin Policies
  crossOriginEmbedderPolicy: 'require-corp',
  crossOriginOpenerPolicy: 'same-origin',
  crossOriginResourcePolicy: 'same-origin',

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
