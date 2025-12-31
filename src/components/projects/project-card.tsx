'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Project as ProjectType } from '@/types/project'
import type { ShowcaseProject } from '@/data/projects'
import { ArrowUpRight, TrendingUp } from 'lucide-react'

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

  return (
    <div
      className="animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <Link
        href={`/projects/${isShowcaseProject(project) ? project.slug : project.slug || project.id}`}
        className="group block"
      >
        <article className="relative bg-card border border-border rounded-2xl overflow-hidden transition-all duration-500 ease-out hover:border-primary/30 hover:shadow-lg hover:-translate-y-1">
          {/* Image Section - Premium aspect ratio */}
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

            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Primary Metric Badge - Shows on hover */}
            {primaryMetric && (
              <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-card/95 backdrop-blur-sm border border-border rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                <TrendingUp className="w-3.5 h-3.5 text-primary" />
                <span className="font-mono text-sm font-medium text-foreground">{primaryMetric.value}</span>
                <span className="text-xs text-muted-foreground">{primaryMetric.label}</span>
              </div>
            )}

            {/* Featured badge */}
            {project.featured && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full shadow-sm">
                Featured
              </div>
            )}

            {/* Arrow indicator */}
            <div className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-card/90 backdrop-blur-sm border border-border rounded-full opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-500">
              <ArrowUpRight className="w-4 h-4 text-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 lg:p-8">
            {/* Category/Client */}
            {isShowcaseProject(project) && (
              <p className="text-xs font-medium tracking-wider uppercase text-primary mb-3">
                {project.client}
              </p>
            )}

            {/* Title */}
            <h3 className="font-display text-xl lg:text-2xl font-semibold text-foreground mb-3 transition-colors duration-300 group-hover:text-primary">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-muted-foreground text-sm lg:text-base leading-relaxed line-clamp-2 mb-6">
              {project.description}
            </p>

            {/* Metrics Grid */}
            {isShowcaseProject(project) && project.displayMetrics.length > 1 && (
              <div className="flex flex-wrap gap-4 pt-5 border-t border-border">
                {project.displayMetrics.slice(0, 3).map((metric, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-primary/5 border border-primary/10 rounded-lg">
                      <metric.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-mono text-sm font-semibold text-foreground">{metric.value}</div>
                      <div className="text-xs text-muted-foreground">{metric.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Technologies */}
            {isShowcaseProject(project) && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {project.technologies.slice(0, 4).map((tech, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-xs font-medium text-muted-foreground bg-muted/50 border border-border rounded-md transition-colors duration-300 group-hover:border-primary/20 group-hover:text-foreground"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 4 && (
                  <span className="px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    +{project.technologies.length - 4} more
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
