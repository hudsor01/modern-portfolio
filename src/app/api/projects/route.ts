import { NextResponse } from 'next/server'
import { getProjects } from '@/lib/projects'
import { createApiSuccessResponse } from '@/lib/api-core'
import { handleApiError } from '@/lib/api-core'
import { ApiErrorType } from '@/types/api'

// Enable ISR with 1 hour revalidation
export const revalidate = 3600

export async function GET() {
  try {
    const projects = await getProjects()
    const response = createApiSuccessResponse(projects)
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=7200', // Cache for 1 hour, CDN for 2 hours
      },
    })
  } catch (error) {
    return handleApiError(
      error,
      'Projects API - Failed to fetch projects',
      ApiErrorType.INTERNAL_ERROR,
      500,
      { operation: 'getProjects' }
    )
  }
}
