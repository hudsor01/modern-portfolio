import { NextRequest, NextResponse } from 'next/server'
import { ProjectDataManager } from '@/lib/server/project-data-manager'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const withFilters = searchParams.get('withFilters')

    // Handle different query types
    if (withFilters === 'true') {
      const data = await ProjectDataManager.getProjectsWithFilters()
      return NextResponse.json(data)
    }

    if (category) {
      const projects = await ProjectDataManager.getProjectsByCategory(category)
      return NextResponse.json({ projects })
    }

    if (featured === 'true') {
      const projects = await ProjectDataManager.getFeaturedProjects()
      return NextResponse.json({ projects })
    }

    if (search) {
      const projects = await ProjectDataManager.searchProjects(search)
      return NextResponse.json({ projects })
    }

    // Default: return all projects
    const projects = await ProjectDataManager.getProjects()
    return NextResponse.json({ projects })

  } catch (error) {
    console.error('Projects API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}