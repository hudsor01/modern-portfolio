import { type NextRequest, NextResponse } from 'next/server'
import { getProject } from '@/lib/projects'
import { z } from 'zod'
import { validationErrorResponse } from '@/lib/api-response'
import { slugSchema } from '@/lib/schemas'
import { checkRateLimitOrRespond, RateLimitPresets } from '@/lib/api-rate-limit'
import { createContextLogger } from '@/lib/logger'

const logger = createContextLogger('SlugAPI')

// Canonical slug rules (lowercase + hyphens, max 100) shared with blog/entity
// validation — see src/lib/schemas.ts.
const slugParamsSchema = z.object({ slug: slugSchema })

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
    const validatedParams = slugParamsSchema.parse({ slug })
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
    logger.error(
      'Error fetching project:',
      error instanceof Error ? error : new Error(String(error))
    )

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
