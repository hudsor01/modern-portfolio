/**
 * Enhanced Security Headers Configuration
 * Comprehensive security headers management with environment-aware settings
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export interface SecurityHeadersConfig {
  csp?: string
  frameOptions?: 'DENY' | 'SAMEORIGIN'
  contentTypeOptions?: boolean
  xssProtection?: boolean
  referrerPolicy?: string
  hsts?: {
    maxAge: number
    includeSubDomains: boolean
    preload: boolean
  }
  permissionsPolicy?: string[]
  crossOriginEmbedderPolicy?: 'require-corp' | 'unsafe-none'
  crossOriginOpenerPolicy?: 'same-origin' | 'same-origin-allow-popups' | 'unsafe-none'
  crossOriginResourcePolicy?: 'same-site' | 'same-origin' | 'cross-origin'
}

const DEFAULT_SECURITY_CONFIG: SecurityHeadersConfig = {
  frameOptions: 'DENY',
  contentTypeOptions: true,
  xssProtection: true,
  referrerPolicy: 'strict-origin-when-cross-origin',
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  permissionsPolicy: [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'browsing-topics=()',
    'interest-cohort=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()'
  ],
  crossOriginEmbedderPolicy: 'unsafe-none', // Required for some third-party services
  crossOriginOpenerPolicy: 'same-origin-allow-popups',
  crossOriginResourcePolicy: 'cross-origin' // Allow cross-origin resources
}

/**
 * Apply security headers to a response
 */
export function applySecurityHeaders(
  response: NextResponse,
  config: Partial<SecurityHeadersConfig> = {}
): NextResponse {
  const finalConfig = { ...DEFAULT_SECURITY_CONFIG, ...config }

  // X-Frame-Options
  if (finalConfig.frameOptions) {
    response.headers.set('X-Frame-Options', finalConfig.frameOptions)
  }

  // X-Content-Type-Options
  if (finalConfig.contentTypeOptions) {
    response.headers.set('X-Content-Type-Options', 'nosniff')
  }

  // X-XSS-Protection (legacy but still useful)
  if (finalConfig.xssProtection) {
    response.headers.set('X-XSS-Protection', '1; mode=block')
  }

  // Referrer-Policy
  if (finalConfig.referrerPolicy) {
    response.headers.set('Referrer-Policy', finalConfig.referrerPolicy)
  }

  // Strict-Transport-Security (HSTS)
  if (finalConfig.hsts && process.env.NODE_ENV === 'production') {
    const hstsValue = [
      `max-age=${finalConfig.hsts.maxAge}`,
      finalConfig.hsts.includeSubDomains ? 'includeSubDomains' : '',
      finalConfig.hsts.preload ? 'preload' : ''
    ].filter(Boolean).join('; ')
    
    response.headers.set('Strict-Transport-Security', hstsValue)
  }

  // Permissions-Policy
  if (finalConfig.permissionsPolicy) {
    response.headers.set('Permissions-Policy', finalConfig.permissionsPolicy.join(', '))
  }

  // Cross-Origin headers
  if (finalConfig.crossOriginEmbedderPolicy) {
    response.headers.set('Cross-Origin-Embedder-Policy', finalConfig.crossOriginEmbedderPolicy)
  }

  if (finalConfig.crossOriginOpenerPolicy) {
    response.headers.set('Cross-Origin-Opener-Policy', finalConfig.crossOriginOpenerPolicy)
  }

  if (finalConfig.crossOriginResourcePolicy) {
    response.headers.set('Cross-Origin-Resource-Policy', finalConfig.crossOriginResourcePolicy)
  }

  // Additional security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none')
  
  // Remove potentially sensitive headers
  response.headers.delete('Server')
  response.headers.delete('X-Powered-By')
  
  return response
}

/**
 * Get security headers for API routes
 */
export function getApiSecurityHeaders(allowedOrigin?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Cache-Control': 'no-store, max-age=0, must-revalidate',
    'X-Robots-Tag': 'noindex, nofollow',
    'X-Permitted-Cross-Domain-Policies': 'none'
  }

  // CORS headers
  if (allowedOrigin) {
    headers['Access-Control-Allow-Origin'] = allowedOrigin
    headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
    headers['Access-Control-Max-Age'] = '86400' // 24 hours
  }

  // HSTS for production
  if (process.env.NODE_ENV === 'production') {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'
  }

  return headers
}

/**
 * Validate request origin against allowed origins
 */
export function validateOrigin(request: NextRequest, allowedOrigins: string[]): boolean {
  const origin = request.headers.get('origin')
  
  if (!origin) {
    // Allow requests without origin (same-origin requests)
    return true
  }

  return allowedOrigins.includes(origin)
}

/**
 * Get trusted origins based on environment
 */
export function getTrustedOrigins(): string[] {
  const origins = []
  
  if (process.env.NODE_ENV === 'production') {
    origins.push('https://richardwhudsonjr.com')
    origins.push('https://www.richardwhudsonjr.com')
  } else {
    origins.push('http://localhost:3000')
    origins.push('http://127.0.0.1:3000')
  }

  // Add custom origins from environment
  const customOrigins = process.env.ALLOWED_ORIGINS?.split(',') || []
  customOrigins.forEach(origin => {
    if (origin.trim()) {
      origins.push(origin.trim())
    }
  })

  return origins
}

/**
 * Security headers for static assets
 */
export function getStaticAssetHeaders(): Record<string, string> {
  return {
    'Cache-Control': 'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff',
    'Cross-Origin-Resource-Policy': 'cross-origin'
  }
}

/**
 * Enhanced CSP with reporting
 */
export function buildEnhancedCSP(nonces: { scriptNonce: string; styleNonce: string }): string {
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonces.scriptNonce}' https://vercel.live https://va.vercel-scripts.com https://vitals.vercel-insights.com 'strict-dynamic'`,
    `style-src 'self' 'nonce-${nonces.styleNonce}' https://fonts.googleapis.com 'unsafe-inline'`,
    "img-src 'self' data: blob: https: *.unsplash.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://vercel.live https://va.vercel-scripts.com https://vitals.vercel-insights.com",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
    "block-all-mixed-content"
  ]

  // Add reporting in production
  if (process.env.NODE_ENV === 'production') {
    directives.push("report-uri /api/csp-report")
    directives.push("report-to csp-endpoint")
  }

  return directives.join('; ')
}

/**
 * Security audit log entry
 */
export interface SecurityAuditLog {
  timestamp: string
  event: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  details: Record<string, unknown>
  clientInfo: {
    ip: string
    userAgent: string
    origin?: string
  }
}

/**
 * Log security events
 */
export function logSecurityEvent(
  event: string,
  severity: SecurityAuditLog['severity'],
  details: Record<string, unknown>,
  request: NextRequest
): void {
  const logEntry: SecurityAuditLog = {
    timestamp: new Date().toISOString(),
    event,
    severity,
    details,
    clientInfo: {
      ip: request.headers.get('x-forwarded-for')?.split(',')[0] || 
          request.headers.get('x-real-ip') || 
          'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      origin: request.headers.get('origin') || undefined
    }
  }

  // In production, you would send this to a monitoring service
  console.info(`[${severity.toUpperCase()}] Security Event`, JSON.stringify(logEntry, null, 2))

  // For critical events, you might want to alert immediately
  if (severity === 'critical') {
    console.error('[CRITICAL SECURITY EVENT]', logEntry)
  }
}