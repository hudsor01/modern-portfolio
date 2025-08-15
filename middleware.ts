import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { generateNonceContext, buildCSPDirective } from './src/lib/security/nonce'
import { checkApiRateLimit, getClientIdentifier } from './src/lib/security/rate-limiter'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const pathname = request.nextUrl.pathname

  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    const identifier = getClientIdentifier(request)
    const rateLimit = checkApiRateLimit(identifier)
    
    if (!rateLimit.allowed) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rateLimit.retryAfter || Date.now()) / 1000)),
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil((rateLimit.resetTime || Date.now()) / 1000)),
        },
      })
    }

    // Add rate limit headers for API responses
    if (rateLimit.remaining !== undefined) {
      response.headers.set('X-RateLimit-Limit', '100')
      response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining))
      response.headers.set('X-RateLimit-Reset', String(Math.ceil((rateLimit.resetTime || Date.now()) / 1000)))
    }
  }

  // Generate nonces for CSP
  const nonces = generateNonceContext()
  const cspHeader = buildCSPDirective(nonces)

  // Set nonce headers for client-side access
  response.headers.set('x-script-nonce', nonces.scriptNonce)
  response.headers.set('x-style-nonce', nonces.styleNonce)

  // Set enhanced CSP header (this will override the one in next.config.js for dynamic content)
  response.headers.set('Content-Security-Policy', cspHeader)

  // Additional security headers (complementing next.config.js)
  response.headers.set('X-Request-ID', crypto.randomUUID())
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * But include API routes for rate limiting
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
