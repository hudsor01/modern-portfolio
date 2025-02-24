import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // 1. Security Headers
  const headers = response.headers

  // Content Security Policy
  headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' blob: data: https://*",
      "font-src 'self' data:",
      "connect-src 'self' https://*",
    ].join("; "),
  )

  // CORS
  headers.set("Access-Control-Allow-Origin", process.env.NEXT_PUBLIC_APP_URL!)
  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  headers.set("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization")

  // Additional Security Headers
  headers.set("X-Frame-Options", "DENY")
  headers.set("X-Content-Type-Options", "nosniff")
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()")
  headers.set("X-XSS-Protection", "1; mode=block")

  // 2. Rate Limiting for API routes
  if (request.nextUrl.pathname.startsWith("/api")) {
    const ip = request.ip ?? "127.0.0.1"
    const rateLimit = await getRateLimit(ip)

    if (!rateLimit.success) {
      return new NextResponse(null, {
        status: 429,
        statusText: "Too Many Requests",
        headers: {
          "Retry-After": "60",
        },
      })
    }
  }

  return response
}

async function getRateLimit(identifier: string) {
  const rate = {
    tokens: 50,
    interval: 60 * 1000, // 1 minute
  }

  try {
    // Implement rate limiting logic here
    // For now, return success
    return { success: true }
  } catch {
    return { success: false }
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}

