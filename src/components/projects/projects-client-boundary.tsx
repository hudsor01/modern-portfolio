'use client'

import { useProjects } from '@/hooks/use-api-queries'
import { ModernProjectsContent } from '@/components/projects/modern-projects-content'
import { Skeleton } from '@/components/ui/skeleton'
import type { Project } from '@/types/project'

interface ProjectsClientBoundaryProps {
  initialProjects?: Project[]
}

export default function ProjectsClientBoundary({ initialProjects }: ProjectsClientBoundaryProps) {
  // Use modern hook directly - no conversion needed
  const { data: projects, isLoading, error } = useProjects()

  // Show error state
  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <h3 className="typography-large mb-2">Failed to load projects</h3>
          <p className="typography-muted">Please try again later</p>
        </div>
      </div>
    )
  }

  // Show loading with skeleton
  if (isLoading && !initialProjects) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  // Use projects data or fallback to initial projects
  const displayProjects = projects || initialProjects || []

  return (
    <ModernProjectsContent 
      projects={displayProjects as Project[]}
      onPrefetch={() => {
        // Modern prefetch is handled automatically by the ultimate hooks
      }}
      isLoading={isLoading && !initialProjects}
    />
  )
}