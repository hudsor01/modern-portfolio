'use client';

import { useProjects, usePrefetchProjects } from '@/hooks/use-api-queries';
import { ModernProjectsContent } from '@/components/projects/modern-projects-content';
import type { Project } from '@/types/project';
import type { ProjectData } from '@/types/shared-api';

interface ProjectsClientBoundaryProps {
  initialProjects?: Project[]; // Optional: SSR data for hydration
}

// Function to convert ProjectData to Project for compatibility
function convertProjectData(projectData: ProjectData[]): Project[] {
  return projectData.map(p => ({
    ...p,
    slug: p.id, // Use id as slug for compatibility
    createdAt: new Date(p.createdAt),
    updatedAt: p.updatedAt ? new Date(p.updatedAt) : undefined,
    category: p.category,
    technologies: p.technologies,
    image: p.imageUrl,
    liveUrl: p.demoUrl,
    githubUrl: p.githubUrl,
  }));
}

export default function ProjectsClientBoundary({ initialProjects }: ProjectsClientBoundaryProps) {
  // Always call hooks at the top level
  const { data: projects, isLoading, isError, error } = useProjects();
  const prefetchProjects = usePrefetchProjects();

  // Use initial projects directly if available
  if (initialProjects && initialProjects.length > 0) {
    return (
      <ModernProjectsContent 
        projects={initialProjects}
        isLoading={false}
      />
    );
  }

  // Use hydrated data or convert API data
  const projectsToDisplay = projects?.data 
    ? convertProjectData(projects.data) 
    : [];

  // Handle loading state
  if (isLoading) {
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

  // Handle error state
  if (isError) {
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

  // Use ModernProjectsContent with TanStack Query integration
  return (
    <ModernProjectsContent 
      projects={projectsToDisplay}
      onPrefetch={prefetchProjects}
      isLoading={isLoading}
    />
  );
}
