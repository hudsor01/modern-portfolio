/**
 * Next.js Proxy
 * Handles Content Security Policy (CSP) headers
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // Build CSP header
  const cspHeader = buildCSP()

  // Create response
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Set CSP header
  response.headers.set('Content-Security-Policy', cspHeader)

  return response
}

function buildCSP(): string {
  const isDev = process.env.NODE_ENV === 'development'

  // Base CSP directives
  // Note: Using 'unsafe-inline' for scripts because Next.js generates inline scripts
  // that don't automatically receive nonce attributes. This is the pragmatic approach
  // for Next.js apps. For stricter CSP, use Next.js experimental.contentSecurityPolicy.
  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'", // Required for Next.js inline scripts
      // Vercel Analytics and Speed Insights
      'https://va.vercel-scripts.com',
      'https://vercel.live',
      'https://*.vercel-scripts.com',
      // Development only
      ...(isDev ? ["'unsafe-eval'"] : []),
    ],
    'script-src-elem': [
      "'self'",
      "'unsafe-inline'",
      'https://va.vercel-scripts.com',
      'https://vercel.live',
      'https://*.vercel-scripts.com',
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for Tailwind CSS and inline styles
      'https://fonts.googleapis.com',
    ],
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com',
      'data:',
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https://images.unsplash.com',
      'https://*.vercel.com',
      'https://*.githubusercontent.com',
    ],
    'connect-src': [
      "'self'",
      'https://va.vercel-scripts.com',
      'https://vercel.live',
      'https://vitals.vercel-insights.com',
      'https://*.vercel-scripts.com',
      // API endpoints
      ...(isDev ? ['ws://localhost:*', 'http://localhost:*'] : []),
    ],
    'frame-src': [
      "'self'",
      'https://vercel.live',
    ],
    'frame-ancestors': ["'none'"],
    'form-action': ["'self'"],
    'base-uri': ["'self'"],
    'object-src': ["'none'"],
    'upgrade-insecure-requests': [],
  }

  // Build CSP string
  return Object.entries(directives)
    .map(([key, values]) => {
      if (values.length === 0) return key
      return `${key} ${values.join(' ')}`
    })
    .join('; ')
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|pdf)$).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
