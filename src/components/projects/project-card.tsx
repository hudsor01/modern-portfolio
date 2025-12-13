'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Project as ProjectType } from '@/types/project'
import type { ShowcaseProject } from '@/data/projects'
import { ArrowRight } from 'lucide-react'

type Project = ProjectType | ShowcaseProject

interface ProjectCardProps {
  project: Project
  priority?: boolean
  index?: number
}

function isShowcaseProject(project: Project): project is ShowcaseProject {
  return 'displayMetrics' in project && Array.isArray((project as ShowcaseProject).displayMetrics)
}

// Custom call-to-action messages for each project
const getCustomCTA = (projectId: string): string => {
  switch (projectId) {
    case 'churn-retention':
      return 'Come Find the Customer Churn!'
    case 'deal-funnel':
      return 'The Sales Pipeline is This Way!'
    case 'lead-attribution':
      return 'Track Those Leads Here!'
    case 'revenue-kpi':
      return 'See Revenue Magic Happen!'
    case 'partner-performance':
      return 'Meet Your Performance Partners!'
    case 'cac-unit-economics':
      return 'Calculate Your Customer Worth!'
    case 'revenue-operations-center':
      return 'Enter the Revenue Command Center!'
    case 'customer-lifetime-value':
      return 'Predict Your Customer Future!'
    case 'commission-optimization':
      return 'Optimize Those Sweet Commissions!'
    case 'multi-channel-attribution':
      return 'Follow the Attribution Trail!'
    default:
      return 'Explore This Project!'
  }
}

export const ProjectCard: React.FC<ProjectCardProps> = React.memo(({ project, priority = false, index = 0 }) => {
  const projectImage = isShowcaseProject(project)
    ? project.image
    : project.image || '/images/projects/analytics-dashboard.jpg'

  // Memoize expensive calculations
  const customCTA = useMemo(() => getCustomCTA(project.id), [project.id])

  return (
    <div
      className="animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-8 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 h-full group">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl md:typography-h3 text-foreground mb-2">
            {project.title}
          </h3>
          {isShowcaseProject(project) && (
            <p className="text-primary text-sm font-medium">
              {project.client} • {project.duration}
            </p>
          )}
          <p className="text-base md:typography-lead leading-relaxed mt-3">
            {project.description}
          </p>
        </div>

        {/* Challenge-Solution-Results Format */}
        <div className="space-y-6 mb-6">
          {isShowcaseProject(project) && (
            <>
              {/* Challenge */}
              <div className="p-4 bg-destructive-bg border border-destructive-border rounded-lg">
                <h4 className="text-sm font-bold text-destructive mb-2">🎯 CHALLENGE</h4>
                <p className="typography-small text-muted-foreground">{project.longDescription}</p>
              </div>

              {/* Solution */}
              <div className="p-4 bg-success-bg border border-success-border rounded-lg">
                <h4 className="text-sm font-bold text-success mb-2">⚡ SOLUTION</h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 4).map((tech, i) => (
                    <span key={i} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs border border-primary/20">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Results */}
              <div className="p-4 bg-primary-bg border border-primary-border rounded-lg">
                <h4 className="text-sm font-bold text-primary/70 mb-3">📊 RESULTS</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {project.displayMetrics.slice(0, 3).map((metric, i) => (
                    <div key={i} className="text-center">
                      <div className="text-primary mb-1 flex justify-center">
                        <metric.icon className="w-4 h-4" />
                      </div>
                      <div className="typography-large text-white">{metric.value}</div>
                      <div className="typography-small text-muted-foreground">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Project Image */}
          {projectImage && (
            <div className="relative h-40 overflow-hidden rounded-lg">
              <Image
                src={projectImage}
                alt={`${project.title} - Revenue Operations Project Dashboard`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={85}
                priority={priority || index < 2}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8A0XqoC2QtJQFgx+GktulvNKyWnLWJdZJvVy2PqwEEgT+OFOccNaJJcGqDYB4LCqTU69jQFf/Z"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Link
            href={`/projects/${isShowcaseProject(project) ? project.slug : project.slug || project.id}`}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-bold px-6 py-4 min-h-[44px] rounded-lg shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 flex items-center gap-2"
          >
            <span>{customCTA}</span>
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  )
})

ProjectCard.displayName = 'ProjectCard'
