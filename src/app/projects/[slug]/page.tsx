import { notFound } from 'next/navigation'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getProjects, getProject } from '@/data/projects'
import type { Project } from '@/types/project'
import { Metadata } from 'next'
import { createServerQueryClient } from '@/lib/query-config'
import { projectKeys } from '@/lib/queryKeys'
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
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

// Fix the metadata generation function
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const project = await getProject(params.slug)

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
      url: `/projects/${params.slug}`,
      images: project.image ? [{ url: project.image }] : undefined,
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const queryClient = createServerQueryClient()
  const project = await getProject(params.slug)
  
  if (!project) {
    notFound()
  }

  // Convert to the expected Project type for the component
  const convertedProject: Project = {
    id: project.id,
    title: project.title,
    slug: project.slug || project.id,
    description: project.description,
    content: project.content,
    featured: project.featured ?? false,
    image: project.image,
    link: project.link,
    github: project.github,
    category: project.category || 'Other',
    tags: project.tags,
    createdAt: project.createdAt instanceof Date ? project.createdAt : new Date(project.createdAt || Date.now()),
    updatedAt: project.updatedAt ? (project.updatedAt instanceof Date ? project.updatedAt : new Date(project.updatedAt)) : undefined,
    technologies: project.tags,
    liveUrl: project.link,
    githubUrl: project.github,
  }

  // Prefetch project data on the server
  await queryClient.prefetchQuery({
    queryKey: projectKeys.detail(params.slug),
    queryFn: () => getProject(params.slug),
    staleTime: 1000 * 60 * 10, // 10 minutes
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectDetailClientBoundary 
        slug={params.slug} 
        initialProject={convertedProject}
      />
    </HydrationBoundary>
  )
}
