import { NextResponse } from 'next/server'
import { getProjects } from '@/app/projects/data/projects'

export async function GET() {
  try {
    const projects = await getProjects()
    return NextResponse.json({
      success: true,
      data: projects,
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch projects',
      },
      { status: 500 }
    )
  }
}