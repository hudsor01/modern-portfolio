import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { lowercasePathRedirect } from '@/lib/path-case'
import { buildEnhancedCSP, shouldEmitUpgradeInsecureRequests } from '@/lib/csp-edge'

export function proxy(request: NextRequest) {
  // Mixed-case page paths 308 to lowercase. This runs first so a response that
  // is only a redirect does no nonce/CSP work. 308 keeps the method. next.config
  // redirects run first and match case-insensitively, so a mixed-case redirected
  // source is answered there in one hop; the proxy lowercases only what they do
  // not match. The target is the cloned request URL with only pathname
  // replaced, so origin and query are preserved. Next strips that origin from
  // the Location it sends, which is why lowercasePathRedirect refuses `//` and
  // `\` paths: their lowercase form would be a protocol-relative, off-site URL.
  const lowered = lowercasePathRedirect(request.nextUrl.pathname)
  if (lowered !== null) {
    const url = request.nextUrl.clone()
    url.pathname = lowered
    return NextResponse.redirect(url, 308)
  }

  const nonce = btoa(crypto.randomUUID())
  const isDev = process.env.NODE_ENV === 'development'

  const csp = buildEnhancedCSP({
    isDev,
    emitUpgradeInsecureRequests: shouldEmitUpgradeInsecureRequests(
      process.env,
      request.nextUrl.protocol
    ),
  })

  // Pass nonce downstream for JSON-LD scripts in layout.tsx. CSP is set only on
  // the RESPONSE (below) — the browser enforces it from there; setting it on the
  // request headers is a no-op since request headers never reach the browser.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)

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
