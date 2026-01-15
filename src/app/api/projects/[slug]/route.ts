import { NextRequest, NextResponse } from 'next/server'
import { getProject } from '@/lib/projects'
import { z } from 'zod'
import { validationErrorResponse, checkRateLimitOrRespond, RateLimitPresets } from '@/lib/api-core'
import { createContextLogger } from '@/lib/logger'

const logger = createContextLogger('SlugAPI')

// Input validation schema for slug parameter
const slugSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug cannot be empty')
    .max(100, 'Slug too long')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Invalid slug format'),
})

export async function GET(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params

  // Rate limiting using shared utility
  const rateLimitResponse = checkRateLimitOrRespond(
    request,
    RateLimitPresets.read,
    `/api/projects/${slug}`,
    'GET'
  )
  if (rateLimitResponse) return rateLimitResponse

  try {
    // Validate slug parameter
    const validatedParams = slugSchema.parse({ slug })
    const project = await getProject(validatedParams.slug)

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: 'Project not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: project,
    })
  } catch (error) {
    logger.error('Error fetching project:', error instanceof Error ? error : new Error(String(error)))

    if (error instanceof z.ZodError) {
      return validationErrorResponse(error)
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch project',
      },
      { status: 500 }
    )
  }
}
