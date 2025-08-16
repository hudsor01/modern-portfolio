import { notFound } from 'next/navigation'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getProjects, getProject } from '@/data/projects'
import type { Project } from '@/types/project'
import { Metadata } from 'next'
import { createQueryClient } from '@/lib/query-config'
import ProjectDetailClientBoundary from '@/components/projects/project-detail-client-boundary'

// Define our own ProjectPageProps instead of extending PageProps
interface ProjectPageProps {
  params: {
    slug: string
  }
  searchParams?: Record<string, string | string[] | undefined>
}

// Generate static params for all projects
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
    'revenue-operations-center'
  ]
  return projects
    .filter(project => !excludedSlugs.includes(project.slug || ''))
    .map((project) => ({
      slug: project.slug,
    }))
}

// Fix the metadata generation function
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const resolvedParams = await params
  const project = await getProject(resolvedParams.slug)

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
      url: `/projects/${resolvedParams.slug}`,
      images: project.image ? [{ url: project.image }] : undefined,
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const queryClient = createQueryClient()
  const resolvedParams = await params
  const project = await getProject(resolvedParams.slug)
  
  if (!project) {
    notFound()
  }

  // Convert to the expected Project type for the component
  const convertedProject: Project = {
    id: project.id,
    title: project.title,
    slug: project.slug || project.id,
    description: project.description,
    ...(project.content && { content: project.content }),
    featured: project.featured ?? false,
    ...(project.image && { image: project.image }),
    ...(project.link && { link: project.link }),
    ...(project.github && { github: project.github }),
    category: project.category || 'Other',
    ...(project.tags && { tags: project.tags }),
    createdAt: project.createdAt instanceof Date ? project.createdAt : new Date(project.createdAt || '2024-01-01'),
    ...(project.updatedAt && { updatedAt: project.updatedAt instanceof Date ? project.updatedAt : new Date(project.updatedAt) }),
    ...(project.tags && { technologies: project.tags }),
    ...(project.link && { liveUrl: project.link }),
    ...(project.github && { githubUrl: project.github }),
  }

  // Prefetch project data on the server
  await queryClient.prefetchQuery({
    queryKey: ['projects', 'detail', resolvedParams.slug],
    queryFn: () => getProject(resolvedParams.slug),
    staleTime: 1000 * 60 * 10, // 10 minutes
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectDetailClientBoundary 
        slug={resolvedParams.slug} 
        initialProject={convertedProject}
      />
    </HydrationBoundary>
  )
}
