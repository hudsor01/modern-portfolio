export const dynamic = 'force-static'

import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ErrorBoundary } from '@/components/error/error-boundary'
import { ProjectsPageContent } from './_components/projects-page-content'
import type { Project } from '@/types/project'

// Server-side data fetching
async function getProjects(): Promise<Project[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/projects`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!response.ok) {
      console.error('Failed to fetch projects:', response.status)
      return []
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <ErrorBoundary>
      <>
        <Navbar />
        <ProjectsPageContent initialProjects={projects} />
        <Footer />
      </>
    </ErrorBoundary>
  )
}
