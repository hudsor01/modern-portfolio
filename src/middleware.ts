/**
 * Next.js Middleware
 * Handles Content Security Policy (CSP) with nonces for inline scripts
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Generate a random nonce for CSP
function generateNonce(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Buffer.from(array).toString('base64')
}

export function middleware(request: NextRequest) {
  // Generate nonce for this request
  const nonce = generateNonce()

  // Build CSP header
  const cspHeader = buildCSP(nonce)

  // Clone the request headers
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)

  // Create response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Set CSP header
  response.headers.set('Content-Security-Policy', cspHeader)

  return response
}

function buildCSP(nonce: string): string {
  const isDev = process.env.NODE_ENV === 'development'

  // Base CSP directives
  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      // Vercel Analytics and Speed Insights
      'https://va.vercel-scripts.com',
      'https://vercel.live',
      // Development only
      ...(isDev ? ["'unsafe-eval'", "'unsafe-inline'"] : []),
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
    ],
    'connect-src': [
      "'self'",
      'https://va.vercel-scripts.com',
      'https://vercel.live',
      'https://vitals.vercel-insights.com',
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
