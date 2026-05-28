export const dynamic = 'force-static'

import { headers } from 'next/headers'
import { generateMetadata as genMeta } from '@/app/shared-metadata'
import { Navbar } from '@/components/layout/navbar'
import { ErrorBoundary } from '@/components/error/error-boundary'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import { ItemListJsonLd } from '@/components/seo/json-ld/item-list-json-ld'
import { ProjectsPageContent } from './_components/projects-page-content'
import { getProjects } from '@/lib/projects'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'

export const metadata = genMeta(
  'Projects | Richard Hudson - Revenue Operations Portfolio',
  'Explore 10+ revenue operations projects by Richard Hudson including pipeline analytics, partner performance dashboards, and CRM optimization case studies.',
  '/projects'
)

export default async function ProjectsPage() {
  const projects = await getProjects()
  const nonce = (await headers()).get('x-nonce')

  return (
    <ErrorBoundary>
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: SITE_ORIGIN },
          { name: 'Projects', url: canonicalUrl('/projects') },
        ]}
      />
      <ItemListJsonLd
        nonce={nonce}
        name="Revenue Operations projects by Richard Hudson"
        items={projects.map((project) => ({
          name: project.title,
          url: canonicalUrl(`/projects/${project.slug}`),
        }))}
      />
      <Navbar />
      <ProjectsPageContent initialProjects={projects} />
    </ErrorBoundary>
  )
}
