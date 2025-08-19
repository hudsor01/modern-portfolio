import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { generateNonceContext, buildCSPDirective } from './src/lib/security/nonce'
import { checkApiRateLimit, getClientIdentifier } from './src/lib/security/rate-limiter'
import { 
  applySecurityHeaders, 
  validateOrigin, 
  getTrustedOrigins,
  logSecurityEvent,
  buildEnhancedCSP 
} from './src/lib/security/security-headers'

export function middleware(request: NextRequest) {
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

  // Security: Validate origin for sensitive requests
  const trustedOrigins = getTrustedOrigins()
  const isApiRequest = pathname.startsWith('/api/')
  
  if (isApiRequest && request.method !== 'GET') {
    if (!validateOrigin(request, trustedOrigins)) {
      logSecurityEvent('invalid_origin', 'medium', {
        pathname,
        method: request.method,
        origin: request.headers.get('origin'),
        referer: request.headers.get('referer')
      }, request)
      
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  // Handle CORS for API routes
  if (isApiRequest) {
    const origin = request.headers.get('origin')
    if (origin && trustedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Vary', 'Origin')
    }
  }

  // Apply rate limiting to API routes
  if (isApiRequest) {
    const identifier = getClientIdentifier(request)
    const rateLimit = checkApiRateLimit(identifier)
    
    if (!rateLimit.allowed) {
      logSecurityEvent('rate_limit_exceeded', 'medium', {
        identifier: identifier.substring(0, 20) + '...',
        pathname,
        rateLimitInfo: rateLimit
      }, request)
      
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
  const enhancedCSP = buildEnhancedCSP(nonces)

  // Set nonce headers for client-side access
  response.headers.set('x-script-nonce', nonces.scriptNonce)
  response.headers.set('x-style-nonce', nonces.styleNonce)

  // Apply comprehensive security headers
  const secureResponse = applySecurityHeaders(response, {
    csp: enhancedCSP
  })

  // Set enhanced CSP header
  secureResponse.headers.set('Content-Security-Policy', enhancedCSP)

  // Additional security headers
  secureResponse.headers.set('X-Request-ID', crypto.randomUUID())
  
  return secureResponse
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
