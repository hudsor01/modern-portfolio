import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Get session from cookie
  const session = request.cookies.get("admin-session")

  // Protected admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Track analytics
  if (
    !request.nextUrl.pathname.startsWith("/_next") &&
    !request.nextUrl.pathname.startsWith("/api") &&
    !request.nextUrl.pathname.includes(".") &&
    request.method === "GET"
  ) {
    try {
      const headers = new Headers(request.headers)
      const ip = headers.get("x-forwarded-for") ?? "anonymous"

      // Track pageview in database
      await fetch(`${request.nextUrl.origin}/api/analytics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: request.nextUrl.pathname,
          ip,
        }),
      })
    } catch (error) {
      // Don't block the request if analytics fails
      console.error("Analytics error:", error)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}

