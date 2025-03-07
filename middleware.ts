import { NextResponse } from 'next/server';

export function middleware() {
  // Get response
  const response = NextResponse.next();

  // Add security headers
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https:;
    font-src 'self' data:;
    object-src 'self' data:;
    media-src 'self';
    connect-src 'self' https:;
    frame-src 'self';
  `
    .replace(/\s{2,}/g, ' ')
    .trim();

  // Set the headers
  response.headers.set('Content-Security-Policy', cspHeader);

  // Additional security headers
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

// Define which paths this middleware will run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
