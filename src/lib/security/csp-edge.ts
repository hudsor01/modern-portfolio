/**
 * Edge-Compatible Content Security Policy Utilities
 *
 * This module provides CSP utilities that work in Edge Runtime (middleware).
 * It does not import any Node.js-specific APIs or the logger module.
 */

/**
 * Build Enhanced CSP with nonce support
 *
 * This function is edge-compatible and can be used in middleware.
 * It generates a strict Content Security Policy with nonce-based inline script/style support.
 *
 * @param nonces - Object containing scriptNonce and styleNonce values
 * @returns CSP header string
 */
export function buildEnhancedCSP(nonces: { scriptNonce: string; styleNonce: string }): string {
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonces.scriptNonce}' https://vercel.live https://va.vercel-scripts.com https://vitals.vercel-insights.com 'strict-dynamic'`,
    `style-src 'self' 'nonce-${nonces.styleNonce}' https://fonts.googleapis.com`,
    "img-src 'self' data: blob: https: *.unsplash.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://vercel.live https://va.vercel-scripts.com https://vitals.vercel-insights.com",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
    'block-all-mixed-content',
  ]

  // Add reporting in production
  if (process.env.NODE_ENV === 'production') {
    directives.push('report-uri /api/csp-report')
    directives.push('report-to csp-endpoint')
  }

  return directives.join('; ')
}
