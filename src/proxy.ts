import { NextRequest, NextResponse } from 'next/server'
import { buildEnhancedCSP } from '@/lib/csp-edge'

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const isDev = process.env.NODE_ENV === 'development'

  // Build CSP with nonces — proxy runs in nodejs runtime (not edge) in Next.js 16
  const csp = buildEnhancedCSP({
    scriptNonce: nonce,
    styleNonce: nonce,
    isDev,
  })

  // Clone request headers and add nonce for downstream consumption in layout.tsx
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', csp)

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
