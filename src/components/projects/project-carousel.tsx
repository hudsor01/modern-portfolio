'use client'

import React, { useState } from 'react'
// Carousel component removed - using simple container
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Info, ExternalLink } from 'lucide-react'
import { ProjectQuickView } from '@/components/projects/project-quick-view'
import type { Project } from '@/types/project' // Changed import path

interface ProjectCarouselProps {
  title?: string
  subtitle?: string
  projects: Project[]
}

export function ProjectCarousel({ title, subtitle, projects }: ProjectCarouselProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const handleOpenQuickView = (project: Project) => {
    setSelectedProject(project)
    setIsDrawerOpen(true)
  }

  const handleOpenChange = (isOpen: boolean) => {
    // If the drawer is being closed (isOpen is false),
    // and we have a selected project, we might want to clear it.
    // However, ProjectQuickView might call this with true as well.
    // The primary action is to sync the state.
    setIsDrawerOpen(isOpen)
    if (!isOpen) {
      setSelectedProject(null) // Optionally clear selected project when drawer closes
    }
  }

  return (
    <section className="py-10" aria-labelledby={title ? 'project-carousel-title' : undefined}>
      {(title || subtitle) && (
        <div className="mb-8 text-center">
          {title && (
            <h2 id="project-carousel-title" className="text-3xl font-bold">
              {title}
            </h2>
          )}
          {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="h-full rounded-lg border bg-card p-3 shadow-sm">
            <div className="group relative aspect-video overflow-hidden rounded-lg">
              <Image
                src={project.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center&q=80'}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority={project.featured === true}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute bottom-0 w-full p-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => handleOpenQuickView(project)}
                      variant="outline"
                      size="sm"
                      className="bg-background/95 text-xs backdrop-blur-sm"
                    >
                      <Info className="mr-1 h-3 w-3" />
                      Quick View
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="bg-background/95 text-xs backdrop-blur-sm"
                    >
                      <Link href={`/projects/${project.id}`}>Details</Link>
                    </Button>
                    {project.liveUrl && (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="bg-background/95 text-xs backdrop-blur-sm"
                      >
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                          <ExternalLink className="mr-1 h-3 w-3" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <h3 className="mt-3 text-lg font-semibold">{project.title}</h3>
            <p className="text-muted-foreground line-clamp-2 text-sm">{project.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.technologies?.slice(0, 3).map((tech) => (
                <Badge key={tech} variant="outline" className="bg-primary/5 text-xs">
                  {tech}
                </Badge>
              ))}
              {(project.technologies?.length || 0) > 3 && (
                <Badge variant="outline" className="bg-muted/50 text-xs">
                  +{(project.technologies?.length || 0) - 3} more
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedProject && (
        <ProjectQuickView
          open={isDrawerOpen}
          onOpenChangeAction={handleOpenChange}
          project={selectedProject}
        />
      )}
    </section>
  )
}
