import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { buildEnhancedCSP, shouldEmitUpgradeInsecureRequests } from '@/lib/csp-edge'
import { resolveSingleHop } from '@/lib/redirect-resolve'
import { REDIRECT_MAP } from '@/lib/redirects'

export function proxy(request: NextRequest) {
  // One 308 to the final URL for every mixed-case, trailing-slash or
  // non-canonical /blog?page= request. This runs first so a response that is
  // only a redirect does no nonce/CSP work; 308 keeps the method.
  //
  // next.config `redirects()` (built from the same table) run before the
  // proxy. On Vercel they match only the exact lowercase source, optionally
  // with one trailing slash, so `/Home` or `/Github/` reach the proxy; local
  // `next start` matches them case-insensitively, so the local e2e suite cannot
  // show Vercel's double hop. src/lib/__tests__/redirect-hops.test.ts simulates
  // both and is the guard. Next's built-in trailing-slash redirect is off
  // (`skipTrailingSlashRedirect` in next.config.js), so resolveSingleHop owns
  // case + slash + table + /blog?page= and answers them in one hop.
  //
  // The Location is built from the resolved path on the request origin, never
  // from a cloned request.nextUrl: NextURL remembers the request's trailing
  // slash and re-appends it when serialised, which would loop `/about/` onto
  // itself. Next relativizes a same-origin Location before sending it, which is
  // why resolveSingleHop refuses `//` and `\` paths: they would leave as a
  // protocol-relative, off-site URL. External hosts come only from the table.
  const hop = resolveSingleHop(request.nextUrl.pathname, request.nextUrl.search, REDIRECT_MAP)
  if (hop?.kind === 'internal') {
    return NextResponse.redirect(
      new URL(`${hop.pathname}${hop.search}`, request.nextUrl.origin),
      308
    )
  }
  if (hop?.kind === 'external') {
    return NextResponse.redirect(new URL(hop.href), 308)
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
  // the embed. `favicon\.ico$` is anchored like the extensions, so only the
  // exact file skips the proxy: `/favicon.ico/` reaches it and gets the same
  // one-hop 308 to the slashless path as `/llms.txt/` or `/x.png/`, instead of
  // a duplicate 200.
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico$|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf)$).*)',
  ],
}
