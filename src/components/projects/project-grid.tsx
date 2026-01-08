'use client'
import { ProjectCard } from '@/components/projects/project-card'
import type { Project } from '@/types/project' // Changed import path

interface ProjectGridProps {
  projects: Project[]
  onProjectHover?: (slug: string) => void
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  // Ensure all projects have an id property
  const formattedProjects = projects.map((project, index) => ({
    ...project,
    // Ensure id exists (use slug as fallback, then deterministic index-based id)
    id:
      project.id ||
      project.slug ||
      `project-${index}-${project.title?.replace(/\s+/g, '-').toLowerCase() || 'untitled'}`,
    // Ensure tags property exists
    tags: project.tags || [],
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
