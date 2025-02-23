"use client"

import * as React from "react"
import { ProjectCard } from "@/components/projects/project-card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import type { Project, ProjectFilter } from "@/types/project"

interface ProjectGridProps {
  initialProjects: Project[]
  filter?: ProjectFilter
}

export function ProjectGrid({ initialProjects, filter }: ProjectGridProps) {
  const [projects, setProjects] = React.useState(initialProjects)
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    const filterProjects = () => {
      setIsLoading(true)
      let filtered = [...initialProjects]

      if (filter?.category) {
        filtered = filtered.filter((project) => project.category === filter.category)
      }

      if (filter?.tag) {
        filtered = filtered.filter((project) => project.tags.includes(filter.tag!))
      }

      if (filter?.search) {
        const searchLower = filter.search.toLowerCase()
        filtered = filtered.filter(
          (project) =>
            project.title.toLowerCase().includes(searchLower) ||
            project.description.toLowerCase().includes(searchLower) ||
            project.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
        )
      }

      setProjects(filtered)
      setIsLoading(false)
    }

    filterProjects()
  }, [initialProjects, filter])

  if (isLoading) {
    return <LoadingSpinner className="my-8" />
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
      {projects.length === 0 && (
        <div className="col-span-full text-center">
          <p className="text-muted-foreground">No projects found.</p>
        </div>
      )}
    </div>
  )
}

