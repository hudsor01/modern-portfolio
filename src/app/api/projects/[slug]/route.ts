import { NextRequest, NextResponse } from 'next/server'
import { getProject } from '@/lib/content/projects'
import { z } from 'zod'
import { validationErrorResponse } from '@/lib/api/response'
import { createContextLogger } from '@/lib/monitoring/logger'
import { getEnhancedRateLimiter } from '@/lib/security/rate-limiter'

const logger = createContextLogger('SlugAPI')

// Input validation schema for slug parameter
const slugSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug cannot be empty')
    .max(100, 'Slug too long')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Invalid slug format'),
})

// Helper function to get client identifier
function getClientId(request: NextRequest): string {
  return request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
}

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const clientId = getClientId(request)

  // Rate limiting: 100 requests per minute for individual project views
  const rateLimiter = getEnhancedRateLimiter()

  const rateLimitResult = rateLimiter.checkLimit(
    clientId,
    {
      windowMs: 60 * 1000, // 1 minute
      maxAttempts: 100,
      progressivePenalty: false,
      blockDuration: 0,
      adaptiveThreshold: true,
      antiAbuse: true,
      burstProtection: {
        enabled: true,
        burstWindow: 5 * 1000,
        maxBurstRequests: 120,
      },
    },
    {
      path: `/api/projects/${(await params).slug}`,
      method: 'GET',
    }
  )

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: 'Rate limit exceeded. Please try again later.',
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rateLimitResult.retryAfter || 0) / 1000)),
          'X-RateLimit-Remaining': String(rateLimitResult.remaining || 0),
          'X-RateLimit-Reset': String(rateLimitResult.resetTime || 0),
        },
      }
    )
  }

  try {
    // Validate slug parameter
    const resolvedParams = await params
    const validatedParams = slugSchema.parse(resolvedParams)
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
