'use client';

import { useState } from 'react';
import { useProjects, usePrefetchProject } from '@/hooks/use-projects';
import { ProjectFiltersEnhanced } from '@/components/projects/project-filters-enhanced';
import type { Project } from '@/types/project';
import type { ProjectFilters } from '@/lib/queryKeys';

interface ProjectsClientBoundaryProps {
  initialProjects?: Project[]; // Optional: SSR data for hydration
}

export default function ProjectsClientBoundary({ initialProjects }: ProjectsClientBoundaryProps) {
  const [filters] = useState<ProjectFilters>({});
  const { data: projects, isLoading, isError, error } = useProjects(filters);
  const { prefetchProject } = usePrefetchProject();

  // Use hydrated data or fallback to initial data
  const projectsToDisplay = projects || initialProjects || [];

  // Handle loading state (only show if no data available)
  if (isLoading && !projects && !initialProjects?.length) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mx-auto mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Handle error state (only if no data available)
  if (isError && !projects?.length && !initialProjects?.length) {
    return (
      <div className="text-center py-12 text-destructive">
        <h3 className="text-xl font-semibold mb-4">Error loading projects</h3>
        <p className="text-muted-foreground">{error?.message || 'An unknown error occurred.'}</p>
      </div>
    );
  }

  // Handle no projects found
  if (!projectsToDisplay.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-4">No projects found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or check back later.</p>
      </div>
    );
  }

  // Enhanced ProjectFiltersEnhanced with prefetching support
  return (
    <ProjectFiltersEnhanced 
      projects={projectsToDisplay} 
      onProjectHover={prefetchProject}
      isLoading={isLoading}
    />
  );
}
