/**
 * Content Security Policy Utilities
 *
 * This module provides CSP utilities for the Next.js 16 proxy (nodejs runtime).
 * It does not import any heavy dependencies to keep proxy startup fast.
 */

/**
 * Build Enhanced CSP with nonce support
 *
 * Used by proxy.ts to generate per-request Content Security Policy headers.
 *
 * @param options - scriptNonce, styleNonce, and isDev flag
 * @returns CSP header string
 */
export function buildEnhancedCSP(options: {
  scriptNonce: string
  styleNonce: string
  isDev?: boolean
}): string {
  const { scriptNonce, isDev = false } = options
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${scriptNonce}' https://vercel.live https://va.vercel-scripts.com https://vitals.vercel-insights.com${isDev ? " 'unsafe-eval'" : ''}`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    "img-src 'self' data: blob: https: *.unsplash.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://vercel.live https://va.vercel-scripts.com https://vitals.vercel-insights.com",
    "frame-src 'none'",
    "object-src 'none'",
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
