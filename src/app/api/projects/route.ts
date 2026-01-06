import { NextResponse } from 'next/server'
import { getProjects } from '@/lib/content/projects'

// Enable ISR with 1 hour revalidation
export const revalidate = 3600

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
