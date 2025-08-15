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
  // Always call hooks at the top level - no conditional returns before hooks
  const { data: projects, isLoading } = useProjects();
  const prefetchProjects = usePrefetchProjects();

  // Determine the data source and loading state
  const hasInitialProjects = initialProjects && initialProjects.length > 0;
  const shouldUseInitialProjects = hasInitialProjects && !projects?.data;
  
  // Use hydrated data or convert API data, or fall back to initial projects
  const projectsToDisplay = shouldUseInitialProjects 
    ? initialProjects 
    : projects?.data 
      ? convertProjectData(projects.data) 
      : [];

  // Determine the actual loading state
  const isActuallyLoading = isLoading && !hasInitialProjects;

  // Always render ModernProjectsContent - let it handle different states
  return (
    <ModernProjectsContent 
      projects={projectsToDisplay}
      onPrefetch={prefetchProjects}
      isLoading={isActuallyLoading}
    />
  );
}