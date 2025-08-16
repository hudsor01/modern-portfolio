import { NextResponse } from 'next/server'
import { ProjectDataManager } from '@/lib/server/project-data-manager'

export async function GET() {
  try {
    const stats = await ProjectDataManager.getProjectStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Project stats API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project statistics' },
      { status: 500 }
    )
  }
}