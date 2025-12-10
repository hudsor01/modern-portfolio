import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkApiRateLimit, getClientIdentifier } from './src/lib/security/rate-limiter'
import {
  validateOrigin,
  getTrustedOrigins,
  logSecurityEvent
} from './src/lib/security/security-headers'

/**
 * Simplified proxy for portfolio site (no auth required)
 * Handles: www redirect, CORS, rate limiting, basic security headers
 */
export function proxy(request: NextRequest) {
  const url = request.nextUrl
  const hostname = request.headers.get('host') || ''

  // Redirect www to non-www in production
  if (process.env.NODE_ENV === 'production' && hostname.startsWith('www.')) {
    const newUrl = new URL(url)
    newUrl.host = hostname.replace('www.', '')
    return NextResponse.redirect(newUrl, 301)
  }

  const response = NextResponse.next()
  const pathname = request.nextUrl.pathname
  const isApiRequest = pathname.startsWith('/api/')

  // Validate origin for non-GET API requests (contact form, etc.)
  if (isApiRequest && request.method !== 'GET') {
    const trustedOrigins = getTrustedOrigins()
    if (!validateOrigin(request, trustedOrigins)) {
      logSecurityEvent('invalid_origin', 'medium', {
        pathname,
        method: request.method,
        origin: request.headers.get('origin')
      }, request)
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  // Rate limiting for API routes
  if (isApiRequest) {
    const identifier = getClientIdentifier(request)
    const rateLimit = checkApiRateLimit(identifier)

    if (!rateLimit.allowed) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rateLimit.retryAfter || Date.now()) / 1000)),
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '0',
        },
      })
    }

    // Add rate limit info headers
    if (rateLimit.remaining !== undefined) {
      response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining))
    }
  }

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
