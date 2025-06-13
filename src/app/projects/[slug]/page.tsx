import { notFound } from 'next/navigation'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getProjects, getProject } from '@/lib/content/projects'
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
        initialProject={project}
      />
    </HydrationBoundary>
  )
}
