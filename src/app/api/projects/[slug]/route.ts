import { NextResponse } from 'next/server'
import { getProjectBySlug } from '@/app/projects/data/projects'

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const project = await getProjectBySlug(params.slug)
    
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
    console.error('Error fetching project:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch project',
      },
      { status: 500 }
    )
  }
}