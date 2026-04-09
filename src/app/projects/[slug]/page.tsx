import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProjects, getProject } from '@/lib/projects'
import ProjectDetailClientBoundary from './_components/project-detail-client-boundary'

// Official Next.js 16 Pattern: Static generation with ISR
export const revalidate = 3600 // Revalidate every hour

interface ProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

// Official Next.js 16 Pattern: generateStaticParams for SSG
// Pre-renders all projects at build time (zero runtime cost)
export async function generateStaticParams() {
  const projects = await getProjects()

  // Exclude projects that have their own dedicated pages
  const excludedSlugs = [
    'partnership-program-implementation',
    'cac-unit-economics',
    'churn-retention',
    'commission-optimization',
    'customer-lifetime-value',
    'deal-funnel',
    'lead-attribution',
    'multi-channel-attribution',
    'partner-performance',
    'revenue-kpi',
    'revenue-operations-center',
  ]

  return projects
    .filter((project) => !excludedSlugs.includes(project.slug || ''))
    .map((project) => ({
      slug: project.slug,
    }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found',
    }
  }

  return {
    title: `${project.title} | Richard Hudson`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      url: `/projects/${slug}`,
      images: project.image ? [{ url: project.image }] : undefined,
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) {
    notFound()
  }

  // Pass project data directly to client component
  // No TanStack Query, no fetch, no hydration boundary needed
  return <ProjectDetailClientBoundary slug={slug} initialProject={project} />
}
