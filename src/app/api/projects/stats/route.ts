import { NextResponse } from 'next/server'
import { ProjectDataManager } from '@/lib/server/project-data-manager'
import { createContextLogger } from '@/lib/logging/logger';

const logger = createContextLogger('StatsAPI');

export async function GET() {
  try {
    const stats = await ProjectDataManager.getProjectStats()
    return NextResponse.json(stats)
  } catch (error) {
    logger.error('Project stats API error:', error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(
      { error: 'Failed to fetch project statistics' },
      { status: 500 }
    )
  }
}