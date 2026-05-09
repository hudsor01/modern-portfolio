import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { buildEnhancedCSP } from '@/lib/csp-edge'

export function proxy(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID())
  const isDev = process.env.NODE_ENV === 'development'

  // Gate `upgrade-insecure-requests` on whether the page itself was served
  // over HTTPS. We use request.nextUrl.protocol — Next.js derives this from
  // the actual TLS state plus trusted forwarded-proto headers (set by Vercel
  // and other supported platforms), so it's server-controlled and can't be
  // spoofed by a client `Host: localhost` header. When the page is HTTP
  // (local dev or production-build smoke tests), the directive would force
  // WebKit to upgrade subresource URLs to https://localhost and 404; skip
  // it. See csp-edge.ts for full context.
  const isHttps = request.nextUrl.protocol === 'https:'

  const csp = buildEnhancedCSP({ isDev, isHttps })

  // Pass nonce downstream for JSON-LD scripts in layout.tsx
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', csp)

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  response.headers.set('Content-Security-Policy', csp)

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
