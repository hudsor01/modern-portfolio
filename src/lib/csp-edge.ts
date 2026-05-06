/**
 * Content Security Policy Utilities
 *
 * This module provides CSP utilities for the Next.js 16 proxy (nodejs runtime).
 * It does not import any heavy dependencies to keep proxy startup fast.
 */

/**
 * Build CSP header string.
 *
 * Uses 'unsafe-inline' for script-src because Next.js 16 proxy does not
 * propagate nonces to framework-generated inline scripts (hydration bootstrap).
 * A nonce in script-src causes browsers to ignore 'unsafe-inline', which
 * blocks those scripts and prevents hydration entirely.
 */
export function buildEnhancedCSP(options: { isDev?: boolean } = {}): string {
  const { isDev = false } = options
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' https://vercel.live https://va.vercel-scripts.com https://vitals.vercel-insights.com${isDev ? " 'unsafe-eval'" : ''}`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    "img-src 'self' data: blob: https: *.unsplash.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://vercel.live https://va.vercel-scripts.com https://vitals.vercel-insights.com",
    "frame-src 'self' blob:",
    "object-src 'self' blob:",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
  ]

  // Add reporting in production
  if (process.env.NODE_ENV === 'production') {
    directives.push('report-uri /api/csp-report')
    directives.push('report-to csp-endpoint')
  }

  return directives.join('; ')
}
