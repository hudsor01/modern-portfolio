import { NextResponse } from 'next/server'
import { getProjects } from '@/data/projects'

export async function GET() {
  try {
    const projects = await getProjects()
    return NextResponse.json({
      success: true,
      data: projects,
    })
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch projects',
      },
      { status: 500 }
    )
  }
}