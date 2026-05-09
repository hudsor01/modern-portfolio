import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { buildEnhancedCSP } from '@/lib/csp-edge'

export function proxy(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID())
  const isDev = process.env.NODE_ENV === 'development'

  // Decide whether to emit `upgrade-insecure-requests`. Two signals:
  //
  //   1. process.env.VERCEL_ENV === 'production' — set by the Vercel
  //      runtime itself, server-only (no NEXT_PUBLIC_ prefix), can't be
  //      spoofed by a client header. When this is true we KNOW the
  //      deployment is HTTPS-fronted and the directive is safe.
  //
  //   2. request.nextUrl.protocol === 'https:' — derived from the actual
  //      TLS state when Node terminates TLS directly, or from
  //      X-Forwarded-Proto when behind a trusted upstream. Reliable on
  //      Vercel (their edge always sets the header correctly) and on a
  //      direct HTTPS Node server. Self-hosted deployments behind a
  //      misconfigured reverse proxy that forwards client-supplied
  //      X-Forwarded-Proto unchanged would inherit that proxy's trust
  //      model — no different from any other Forwarded-header check, but
  //      worth knowing if you're forking.
  //
  // OR'ing them: signal #1 is the canonical Vercel-production gate;
  // signal #2 covers other HTTPS deployments. Either way, on local HTTP
  // (no VERCEL_ENV, http: protocol) we skip the directive so WebKit
  // doesn't try to upgrade subresource URLs to https://localhost and 404.
  const isVercelProduction = process.env.VERCEL_ENV === 'production'
  const isHttps = isVercelProduction || request.nextUrl.protocol === 'https:'

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
