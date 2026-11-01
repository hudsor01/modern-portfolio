import { type NextRequest, NextResponse } from 'next/server'
import { getProjects } from '@/lib/projects'
import { logAndSanitizeError } from '@/lib/api-response'
import { checkRateLimitOrRespond, RateLimitPresets } from '@/lib/api-rate-limit'

// Not ISR: this export only opts the GET into a build-time prerender, which
// bails when the rate limiter reads request.headers, so the route renders per
// request (ƒ in the build output). CDN caching comes from the Cache-Control
// header below.
export const revalidate = 3600

export async function GET(request: NextRequest) {
  const rateLimitResponse = checkRateLimitOrRespond(
    request,
    RateLimitPresets.read,
    '/api/projects',
    'GET'
  )
  if (rateLimitResponse) return rateLimitResponse

  try {
    const projects = await getProjects()
    // Standard { success, data } envelope (matches the blog/contact routes).
    return NextResponse.json(
      { success: true, data: projects },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=7200', // 1h browser, 2h CDN
        },
      }
    )
  } catch (error) {
    // logAndSanitizeError logs the full error internally and returns a
    // production-safe message (no path/stack leakage).
    const message = logAndSanitizeError(
      'Projects API - Failed to fetch projects',
      error,
      'DATABASE_ERROR',
      { operation: 'getProjects' }
    )
    return NextResponse.json(
      { success: false, error: message },
      {
        status: 500,
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
      }
    )
  }
}
