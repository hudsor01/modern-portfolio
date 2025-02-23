import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSession } from "@/lib/actions/auth"

export async function authMiddleware(request: NextRequest) {
  // Skip auth for public routes
  const publicPaths = ["/login", "/api/auth/login"]
  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  // Check admin routes
  if (request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/api/admin")) {
    const session = await getSession()

    if (!session || session.role !== "admin") {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("from", request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/login"],
}

