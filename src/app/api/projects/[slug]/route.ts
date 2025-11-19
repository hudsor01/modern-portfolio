import { NextResponse } from 'next/server'
import { getProjectBySlug } from '@/data/projects'
import { z } from 'zod'
import { validationErrorResponse } from '@/lib/api/response'
import { createContextLogger } from '@/lib/logging/logger';

const logger = createContextLogger('SlugAPI');

// Input validation schema for slug parameter
const slugSchema = z.object({
  slug: z.string()
    .min(1, 'Slug cannot be empty')
    .max(100, 'Slug too long')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Invalid slug format')
})

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // Validate slug parameter
    const resolvedParams = await params
    const validatedParams = slugSchema.parse(resolvedParams)
    const project = await getProjectBySlug(validatedParams.slug)
    
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