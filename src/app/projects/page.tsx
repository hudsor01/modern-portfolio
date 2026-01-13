export const dynamic = 'force-static'
export const revalidate = 3600 // Revalidate every hour

import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ErrorBoundary } from '@/components/error/error-boundary'
import { ProjectsPageContent } from './_components/projects-page-content'
import { getProjects } from '@/lib/content/projects'

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
