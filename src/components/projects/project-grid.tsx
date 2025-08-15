'use client'
import { ProjectCard } from './project-card'
import type { Project } from '@/types/project' // Changed import path

interface ProjectGridProps {
  projects: Project[]
  onProjectHover?: (slug: string) => void
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  // Ensure all projects have an id property
  const formattedProjects = projects.map((project) => ({
    ...project,
    // Ensure id exists (use slug as fallback)
    id: project.id || project.slug || `project-${Math.random().toString(36).substring(2, 9)}`,
    // Ensure tags property exists
    tags: project.tags || project.technologies || [],
  }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
      {formattedProjects.map((project) => (
        <div key={project.id} className="h-full">
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  )
}
