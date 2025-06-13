import React from 'react'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { generateMetadata } from '@/app/shared-metadata'
import { createServerQueryClient } from '@/lib/query-config'
import { projectKeys } from '@/lib/queryKeys'
import { getProjects } from '@/lib/content/projects'
import ProjectsClientBoundary from '@/components/projects/projects-client-boundary'

export const metadata = generateMetadata(
  "Projects | Richard Hudson's Portfolio",
  "Explore Richard Hudson's portfolio of revenue operations projects and case studies demonstrating successful business optimization strategies.",
  '/projects'
)

export default async function ProjectsPage() {
  const queryClient = createServerQueryClient()
  
  // Prefetch projects data on the server
  await queryClient.prefetchQuery({
    queryKey: projectKeys.all(),
    queryFn: () => getProjects(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectsClientBoundary />
    </HydrationBoundary>
  )
}
