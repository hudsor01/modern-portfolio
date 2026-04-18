import { NextRequest, NextResponse } from 'next/server'
import { getProjects } from '@/lib/projects'
import { createApiSuccessResponse, createApiErrorResponse } from '@/lib/api-response'
import { ApiErrorType } from '@/types/api'
import { checkRateLimitOrRespond, RateLimitPresets } from '@/lib/api-rate-limit'

// Enable ISR with 1 hour revalidation
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
    const response = createApiSuccessResponse(projects)
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=7200', // Cache for 1 hour, CDN for 2 hours
      },
    })
  } catch (error) {
    const { response, statusCode } = createApiErrorResponse(
      error,
      'Projects API - Failed to fetch projects',
      ApiErrorType.INTERNAL_ERROR,
      500,
      { operation: 'getProjects' }
    )
    return new Response(JSON.stringify(response), {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  }
}
