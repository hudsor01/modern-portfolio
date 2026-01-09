/**
 * Next.js 16 Proxy - Content Security Policy with Nonce Generation
 *
 * This proxy generates a unique nonce for each request to enable strict CSP
 * without unsafe-inline directives. The nonce is used for both scripts and styles.
 *
 * Pattern follows Next.js 16 official CSP documentation:
 * - Generates cryptographically secure nonce per request
 * - Sets nonce in x-nonce header for SSR components
 * - Applies CSP headers to both request and response
 * - Next.js automatically applies nonces to framework scripts
 */

import { NextRequest, NextResponse } from 'next/server'
import { buildEnhancedCSP } from '@/lib/security/csp-edge'

export function proxy(request: NextRequest) {
  // Generate cryptographically secure nonce (Edge Runtime compatible)
  const nonce = btoa(crypto.randomUUID())

  // Create nonces object for CSP (using same nonce for both script and style)
  const nonces = {
    scriptNonce: nonce,
    styleNonce: nonce,
  }

  // Build CSP header with nonces
  const cspHeader = buildEnhancedCSP(nonces)

  // Clone request headers and add nonce header for SSR
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', cspHeader)

  // Create response with modified request headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Set CSP header on response for client-side
  response.headers.set('Content-Security-Policy', cspHeader)

  return response
}

// Matcher configuration to exclude static assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static assets with common extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
