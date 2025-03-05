import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
	// Clone the request headers
	const requestHeaders = new Headers(request.headers)

	// Get response
	const response = NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	})

	// Set security headers
	const ContentSecurityPolicy = `
default-src 'self'
script-src 'self'
style-src 'self'
img-src 'self' blob: data: https://your-image-domain.com
font-src 'self'
object-src 'none'
connect-src 'self' vitals.vercel-insights.com vercel-analytics.com
frame-src 'self'
report-uri /api/csp-report
`

	response.headers.set(
		'Content-Security-Policy',
		ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
	)
	response.headers.set('X-Frame-Options', 'DENY')
	response.headers.set('X-Content-Type-Options', 'nosniff')
	response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

	return response
}

// Only run middleware on the frontend paths
export const config = {
	matcher: [
		/*
		 * Match all paths except for:
		 * 1. /api routes
		 * 2. /_next (Next.js internals)
		 * 3. /_static (inside /public)
		 * 4. all root files inside /public (e.g. /favicon.ico)
		 */
		'/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
	],
}
