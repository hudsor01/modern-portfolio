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
  permissionsPolicy: [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'interest-cohort=()',
  ],

  // Cross-Origin Policies
  crossOriginEmbedderPolicy: 'require-corp',
  crossOriginOpenerPolicy: 'same-origin',
  crossOriginResourcePolicy: 'same-origin',

  // Rate Limiting (per API route)
  rateLimitWindowMs: 60 * 1000, // 1 minute
  rateLimitMaxRequests: 10, // 10 requests per minute
  rateLimitClientExpiryMs: 15 * 60 * 1000, // 15 minutes
  rateLimitMaxHistoryPerClient: 100, // Max history entries per client
}

// Helper function for backward compatibility
export function getConfigSection(section: 'security'): SecurityConfig {
  if (section === 'security') {
    return securityConfig
  }
  throw new Error(`Unknown config section: ${section}`)
}
