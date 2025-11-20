/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { InteractionType } from '@/types/prisma-generated'
import { ApiResponse } from '@/types/shared-api'
import { validateProjectInteraction, ProjectInteractionInput, ValidationError } from '@/lib/validations/unified-schemas'
import { createContextLogger } from '@/lib/logging/logger';

const logger = createContextLogger('InteractionsAPI');

const prisma = new PrismaClient()

// Using centralized validation schema from unified-schemas

interface ProjectInteractionResponse {
  id: string
  type: InteractionType
  createdAt: string
  totalInteractions: {
    likes: number
    shares: number
    bookmarks: number
    downloads: number
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
): Promise<NextResponse<ApiResponse<ProjectInteractionResponse>>> {
  try {
    const body = await request.json()
    
    // Validate request data
    let validatedData: ProjectInteractionInput
    try {
      validatedData = validateProjectInteraction(body)
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid request data: ' + error.message,
            data: null as never
          },
          { status: 400 }
        )
      }
      throw error
    }
    
    const { type, value, metadata } = validatedData
    const projectSlug = params.slug

    // Generate anonymous visitor ID from request
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(/, /)[0] : request.headers.get('x-real-ip')
    const userAgent = request.headers.get('user-agent') || ''
    const visitorId = await generateVisitorId(ip || '', userAgent)
    const sessionId = request.headers.get('x-session-id') || crypto.randomUUID()

    // Validation is handled by validateProjectInteraction

    // For projects, we'll store interactions in a custom way since projects aren't in the blog schema
    // We could extend this to create a separate project interactions table if needed
    
    // Create the interaction record (using blog post structure as template)
    const interaction = await prisma.postInteraction.create({
      data: {
        postId: `project-${projectSlug}`, // Use project slug as pseudo-post ID
        type: type as InteractionType,
        ...(value && { value }),
        ...(metadata && { metadata }),
        visitorId,
        sessionId,
      }
    })

    // Get total interaction counts for this project
    const totalCounts = await prisma.postInteraction.groupBy({
      by: ['type'],
      where: {
        postId: `project-${projectSlug}`
      },
      _count: {
        id: true
      }
    })

    const totalInteractions = {
      likes: totalCounts.find((c: any) => c.type === 'LIKE')?._count.id || 0,
      shares: totalCounts.find((c: any) => c.type === 'SHARE')?._count.id || 0,
      bookmarks: totalCounts.find((c: any) => c.type === 'BOOKMARK')?._count.id || 0,
      downloads: totalCounts.find((c: any) => c.type === 'DOWNLOAD')?._count.id || 0,
    }

    const response: ApiResponse<ProjectInteractionResponse> = {
      success: true,
      data: {
        id: interaction.id,
        type: interaction.type,
        createdAt: interaction.createdAt.toISOString(),
        totalInteractions
      }
    }

    return NextResponse.json(response, { status: 201 })

  } catch (error) {
    logger.error('Project interaction error:', error instanceof Error ? error : new Error(String(error)))
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to record interaction',
        data: null as never
      },
      { status: 500 }
    )
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
): Promise<NextResponse<ApiResponse<{ totalInteractions: Record<string, number> }>>> {
  try {
    const projectSlug = params.slug

    // Get interaction counts for this project
    const totalCounts = await prisma.postInteraction.groupBy({
      by: ['type'],
      where: {
        postId: `project-${projectSlug}`
      },
      _count: {
        id: true
      }
    })

    const totalInteractions = totalCounts.reduce((acc: Record<string, number>, count: any) => {
      acc[count.type.toLowerCase()] = count._count.id
      return acc
    }, {} as Record<string, number>)

    const response: ApiResponse<{ totalInteractions: Record<string, number> }> = {
      success: true,
      data: { totalInteractions }
    }

    return NextResponse.json(response)

  } catch (error) {
    logger.error('Get project interactions error:', error instanceof Error ? error : new Error(String(error)))
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get interactions',
        data: null as never
      },
      { status: 500 }
    )
  }
}

// Helper function to generate consistent visitor ID
async function generateVisitorId(ip: string, userAgent: string): Promise<string> {
  const data = `${ip}-${userAgent}`
  const encoder = new TextEncoder()
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data))
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16)
}