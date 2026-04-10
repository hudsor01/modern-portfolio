export const dynamic = 'force-static'

import { generateMetadata as genMeta } from '@/app/shared-metadata'
import { Navbar } from '@/components/layout/navbar'

export const metadata = genMeta(
  'Projects | Richard Hudson - Revenue Operations Portfolio',
  'Explore 10+ revenue operations projects by Richard Hudson including pipeline analytics, partner performance dashboards, and CRM optimization case studies.',
  '/projects'
)
import { Footer } from '@/components/layout/footer'
import { ErrorBoundary } from '@/components/error/error-boundary'
import { ProjectsPageContent } from './_components/projects-page-content'
import { getProjects } from '@/lib/projects'

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
