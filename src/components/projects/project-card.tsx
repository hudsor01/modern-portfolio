'use client'

import React from 'react'
import Link from 'next/link'
import { ProjectPreview } from '@/components/projects/project-preview'
import { buildProjectPreview } from '@/lib/project-preview'
import type { Project } from '@/types/project'
import { ArrowUpRight, Sparkles } from 'lucide-react'

interface ProjectCardProps {
  project: Project
  index?: number
}

export const ProjectCard = React.memo(function ProjectCard({
  project,
  index = 0,
}: ProjectCardProps) {
  // Get category label from client or category
  const categoryLabel =
    project.client ||
    project.category ||
    (project.tags && project.tags.length > 0 ? project.tags[0] : null)

  // Get technologies from tags (normalized field name)
  const technologies = project.tags || []

  // A project with no plottable result rows previews its key metrics; the
  // metrics row would then repeat the same figures, so show it only beside a
  // results chart (each fact once per card).
  const hasMetrics = Array.isArray(project.displayMetrics) && project.displayMetrics.length > 0
  const showMetricsRow = hasMetrics && buildProjectPreview(project).kind !== 'metrics'

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: `${index * 80}ms` }}>
      <Link href={`/projects/${project.slug || project.id}`} className="group block h-full">
        <article className="relative h-full bg-card border border-border rounded-2xl overflow-hidden shadow-sm transition-all duration-500 ease-out hover:border-primary/40 hover:shadow-lg hover:-translate-y-1">
          {/* Featured Badge - Premium Design */}
          {project.featured && (
            <div
              data-slot="featured-badge"
              className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white text-xs font-semibold rounded-full shadow-md"
            >
              <Sparkles className="w-3 h-3" aria-hidden="true" />
              Featured
            </div>
          )}

          {/* Image Section */}
          <div data-slot="project-media" className="relative aspect-16/10 overflow-hidden bg-muted">
            <ProjectPreview size="card" project={project} />

            {/* Arrow indicator */}
            <div className="absolute top-3 right-3 size-8 flex items-center justify-center bg-card/95 backdrop-blur-sm border border-border rounded-full shadow-sm opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-500">
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 text-foreground transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 lg:p-7 flex flex-col">
            {/* Category Badge - Works for all projects */}
            {categoryLabel && (
              <div className="mb-3">
                <span
                  data-slot="client-chip"
                  className="inline-flex max-w-full items-center px-2.5 py-1 text-xs font-semibold tracking-wide uppercase text-primary bg-primary/8 border border-primary/15 rounded-md"
                >
                  {categoryLabel}
                </span>
              </div>
            )}

            {/* Title - Better contrast */}
            <h3 className="mb-3 transition-colors duration-300 ease-out">{project.title}</h3>

            {/* Description - Improved contrast */}
            <p className="line-clamp-2 mb-5">{project.description}</p>

            {/* Metrics Row - Text only, no icons */}
            {showMetricsRow && (
              <div
                data-slot="metrics-row"
                className="flex flex-wrap gap-x-4 gap-y-2 py-4 border-t border-border mt-auto"
              >
                {(
                  project.displayMetrics as Array<{
                    label: string
                    value: string
                    iconName: string
                  }>
                )
                  .slice(0, 3)
                  .map((metric: { label: string; value: string; iconName: string }, i: number) => (
                    <div key={i} className="flex items-baseline gap-1.5">
                      <span className="font-sans text-base font-semibold tabular-nums text-foreground">
                        {metric.value}
                      </span>
                      <span className="text-xs text-muted-foreground">{metric.label}</span>
                    </div>
                  ))}
              </div>
            )}

            {/* Technologies - Works for all projects */}
            {technologies.length > 0 && (
              <div
                className={`flex flex-wrap gap-2 ${showMetricsRow ? 'mt-4 pt-4 border-t border-border' : 'mt-auto pt-4 border-t border-border'}`}
              >
                {technologies.slice(0, 4).map((tech, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-xs font-semibold text-foreground/80 bg-muted border border-border rounded-md transition-all duration-300 ease-out group-hover:border-primary/25 group-hover:bg-primary/5"
                  >
                    {tech}
                  </span>
                ))}
                {technologies.length > 4 && (
                  <span className="px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                    +{technologies.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </article>
      </Link>
    </div>
  )
})

ProjectCard.displayName = 'ProjectCard'
