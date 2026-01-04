'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Project as ProjectType } from '@/types/project'
import type { ShowcaseProject } from '@/data/projects'
import { ArrowUpRight, Sparkles } from 'lucide-react'

type Project = ProjectType | ShowcaseProject

interface ProjectCardProps {
  project: Project
  priority?: boolean
  index?: number
}

function isShowcaseProject(project: Project): project is ShowcaseProject {
  return 'displayMetrics' in project && Array.isArray((project as ShowcaseProject).displayMetrics)
}

export const ProjectCard: React.FC<ProjectCardProps> = React.memo(({ project, priority = false, index = 0 }) => {
  const projectImage = isShowcaseProject(project)
    ? project.image
    : project.image || '/images/projects/analytics-dashboard.jpg'

  // Get primary metric for hero display
  const primaryMetric = useMemo(() => {
    if (isShowcaseProject(project) && project.displayMetrics.length > 0) {
      return project.displayMetrics[0]
    }
    return null
  }, [project])

  // Get category label - works for both Project and ShowcaseProject
  const categoryLabel = useMemo(() => {
    if (isShowcaseProject(project)) {
      return project.client
    }
    return project.category || (project.tags && project.tags.length > 0 ? project.tags[0] : null)
  }, [project])

  // Get technologies - works for both types
  const technologies = useMemo(() => {
    if (isShowcaseProject(project)) {
      return project.technologies
    }
    // Prefer technologies if it has items, otherwise fallback to tags
    const techs = project.technologies
    if (techs && techs.length > 0) return techs
    return project.tags || []
  }, [project])

  return (
    <div
      className="animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <Link
        href={`/projects/${isShowcaseProject(project) ? project.slug : project.slug || project.id}`}
        className="group block h-full"
      >
        <article className="relative h-full bg-card border border-border rounded-2xl overflow-hidden shadow-sm transition-all duration-500 ease-out hover:border-primary/40 hover:shadow-lg hover:-translate-y-1.5">
          {/* Featured Badge - Premium Design */}
          {project.featured && (
            <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-accent text-accent-foreground text-xs font-semibold rounded-full shadow-md">
              <Sparkles className="w-3 h-3" />
              Featured
            </div>
          )}

          {/* Image Section */}
          <div className="relative aspect-[16/10] overflow-hidden bg-muted">
            {projectImage && (
              <Image
                src={projectImage}
                alt={`${project.title} - Revenue Operations Project`}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                quality={90}
                priority={priority || index < 2}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8A0XqoC2QtJQFgx+GktulvNKyWnLWJdZJvVy2PqwEEgT+OFOccNaJJcGqDYB4LCqTU69jQFf/Z"
              />
            )}

            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Primary Metric Badge - Shows on hover */}
            {primaryMetric && (
              <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-2 bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-md opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                <primaryMetric.icon className="w-4 h-4 text-secondary" />
                <span className="font-mono text-sm font-semibold text-foreground">{primaryMetric.value}</span>
                <span className="text-xs text-muted-foreground">{primaryMetric.label}</span>
              </div>
            )}

            {/* Arrow indicator */}
            <div className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-card/95 backdrop-blur-sm border border-border rounded-full shadow-sm opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-500">
              <ArrowUpRight className="w-4 h-4 text-foreground transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 lg:p-7 flex flex-col">
            {/* Category Badge - Works for all projects */}
            {categoryLabel && (
              <div className="mb-3">
                <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold tracking-wide uppercase text-primary bg-primary/8 border border-primary/15 rounded-md">
                  {categoryLabel}
                </span>
              </div>
            )}

            {/* Title - Better contrast */}
            <h3 className="font-display text-xl lg:text-2xl font-semibold text-foreground mb-3 leading-tight transition-colors duration-300 ease-out group-hover:text-primary">
              {project.title}
            </h3>

            {/* Description - Improved contrast */}
            <p className="text-foreground/70 text-sm lg:text-base leading-relaxed line-clamp-2 mb-5">
              {project.description}
            </p>

            {/* Metrics Row - Only for ShowcaseProject */}
            {isShowcaseProject(project) && project.displayMetrics.length > 1 && (
              <div className="flex flex-wrap gap-x-5 gap-y-3 py-4 border-t border-border mt-auto">
                {project.displayMetrics.slice(0, 3).map((metric, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-7 h-7 flex items-center justify-center bg-secondary/10 border border-secondary/20 rounded-lg">
                      <metric.icon className="w-3.5 h-3.5 text-secondary" />
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-mono text-sm font-semibold text-foreground">{metric.value}</span>
                      <span className="text-xs text-muted-foreground">{metric.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Technologies - Works for all projects */}
            {technologies.length > 0 && (
              <div className={`flex flex-wrap gap-2 ${isShowcaseProject(project) && project.displayMetrics.length > 1 ? 'mt-4 pt-4 border-t border-border' : 'mt-auto pt-4 border-t border-border'}`}>
                {technologies.slice(0, 4).map((tech, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-xs font-medium text-foreground/80 bg-muted border border-border rounded-md transition-all duration-300 ease-out group-hover:border-primary/25 group-hover:bg-primary/5"
                  >
                    {tech}
                  </span>
                ))}
                {technologies.length > 4 && (
                  <span className="px-2.5 py-1 text-xs font-medium text-muted-foreground">
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
