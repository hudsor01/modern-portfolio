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
export interface BuildCSPOptions {
  /** True when the running app is in development mode (NODE_ENV=development). */
  isDev?: boolean
  /**
   * True when the response should include the `upgrade-insecure-requests`
   * directive. Caller derives this from server-controlled signals via
   * {@link shouldEmitUpgradeInsecureRequests} — never from a client header.
   */
  emitUpgradeInsecureRequests?: boolean
}

/**
 * Decide whether to emit `upgrade-insecure-requests`. Two server-controlled
 * signals — only emit when at least one says "the deployed origin serves
 * HTTPS"; on HTTP, the directive forces WebKit to rewrite subresource URLs
 * to https://… (Chromium exempts localhost per spec, WebKit doesn't) and
 * every CSS / font / image 404s.
 *
 *   1. `VERCEL_ENV === 'production'` — set by the Vercel runtime itself;
 *      server-only (no NEXT_PUBLIC_ prefix), can't be spoofed by a client
 *      request header. When this is true, the deployment is HTTPS-fronted
 *      and the directive is safe.
 *
 *   2. `protocol === 'https:'` — derived from the actual TLS state when
 *      Node terminates TLS directly, or from `X-Forwarded-Proto` when
 *      behind a trusted upstream. Reliable on Vercel and any direct HTTPS
 *      Node server. A self-hosted deployment behind a misconfigured
 *      reverse proxy that passes through client-supplied
 *      `X-Forwarded-Proto` unchanged inherits that proxy's trust model —
 *      same caveat as any other Forwarded-header-based check.
 */
export function shouldEmitUpgradeInsecureRequests(
  env: Record<string, string | undefined>,
  protocol: string
): boolean {
  return env.VERCEL_ENV === 'production' || protocol === 'https:'
}

export function buildEnhancedCSP(options: BuildCSPOptions = {}): string {
  const { isDev = false, emitUpgradeInsecureRequests = false } = options
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
  ]

  // Dev mode never emits the directive (HMR/local resources may be HTTP).
  // Otherwise, defer to the caller-derived emit signal.
  if (!isDev && emitUpgradeInsecureRequests) {
    directives.push('upgrade-insecure-requests')
  }

  return directives.join('; ')
}
