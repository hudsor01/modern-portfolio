import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { buildEnhancedCSP, shouldEmitUpgradeInsecureRequests } from '@/lib/csp-edge'

export function proxy(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID())
  const isDev = process.env.NODE_ENV === 'development'

  const csp = buildEnhancedCSP({
    isDev,
    emitUpgradeInsecureRequests: shouldEmitUpgradeInsecureRequests(
      process.env,
      request.nextUrl.protocol
    ),
    addReporting: process.env.NODE_ENV === 'production',
  })

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
  // PDFs are excluded so they can be embedded same-origin in <object> on the
  // resume viewer. Excluding them here means the per-request CSP is NOT set
  // on PDF responses — every directive (default-src, script-src, style-src,
  // frame-ancestors, etc.) is dropped, not just frame-ancestors. That's
  // acceptable today because the only PDF in /public is a static résumé;
  // adding a PDF that needs a stricter CSP requires emitting one inside
  // proxy() conditionally rather than excluding the path here. Pairs with
  // the route-specific X-Frame-Options: SAMEORIGIN override in next.config.js
  // — both rules must move together; relaxing one in isolation re-blocks
  // the embed.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf)$).*)',
  ],
}
