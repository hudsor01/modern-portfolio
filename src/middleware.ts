import { NextRequest, NextResponse } from 'next/server'
import { buildEnhancedCSP } from '@/lib/csp-edge'

export function middleware(request: NextRequest) {
  // Generate cryptographically random nonces for this request
  const array = crypto.getRandomValues(new Uint8Array(16))
  const scriptNonce = btoa(String.fromCharCode(...array))
  const styleArray = crypto.getRandomValues(new Uint8Array(16))
  const styleNonce = btoa(String.fromCharCode(...styleArray))

  // Build CSP with nonces
  const csp = buildEnhancedCSP({ scriptNonce, styleNonce })

  // Clone request headers and add nonces for downstream consumption in layout.tsx
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', scriptNonce)

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  // Set CSP header on response
  response.headers.set('Content-Security-Policy', csp)

  return response
}

export const config = {
  matcher: [
    // Match all routes except static files, images, and API routes
    // API routes get security headers from next.config.js
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}
