'use client'

import React from 'react'
import Link from 'next/link'
import { OptimizedImage } from '@/components/ui/optimized-image'
import type { Project as ProjectType } from '@/types/project'
import { ArrowRight } from 'lucide-react'

// Mock project interface
interface MockProject {
  id: string
  title: string
  description: string
  longDescription: string
  category: 'revenue-ops' | 'data-analytics' | 'business-intelligence' | 'process-optimization'
  technologies: string[]
  metrics: {
    label: string
    value: string
    icon: React.ElementType
  }[]
  featured: boolean
  year: number
  client: string
  duration: string
  impact: string[]
  results: {
    metric: string
    before: string
    after: string
    improvement: string
  }[]
  liveUrl?: string
  githubUrl?: string
  caseStudyUrl?: string
}

type Project = ProjectType | MockProject

interface ProjectCardProps {
  project: Project
}

function isMockProject(project: Project): project is MockProject {
  return 'metrics' in project && Array.isArray(project.metrics)
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

export const ProjectCard: React.FC<ProjectCardProps> = React.memo(({ project }) => {
  const projectImage = isMockProject(project)
    ? 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop&crop=center&q=80'
    : project.image

  const customCTA = getCustomCTA(project.id)

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-2 h-full group">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
          {project.title}
        </h3>
        {isMockProject(project) && (
          <p className="text-cyan-400 text-sm font-medium">
            {project.client} • {project.duration}
          </p>
        )}
        <p className="text-base md:text-lg text-gray-300 leading-relaxed mt-3">
          {project.description}
        </p>
      </div>

      {/* Challenge-Solution-Results Format */}
      <div className="space-y-6 mb-6">
        {isMockProject(project) && (
          <>
            {/* Challenge */}
            <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <h4 className="text-sm font-bold text-red-300 mb-2">🎯 CHALLENGE</h4>
              <p className="text-sm text-gray-300">{project.longDescription}</p>
            </div>

            {/* Solution */}
            <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <h4 className="text-sm font-bold text-green-300 mb-2">⚡ SOLUTION</h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.slice(0, 4).map((tech, i) => (
                  <span key={i} className="bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded text-xs border border-cyan-500/20">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <h4 className="text-sm font-bold text-blue-300 mb-3">📊 RESULTS</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {project.metrics.slice(0, 3).map((metric, i) => (
                  <div key={i} className="text-center">
                    <div className="text-cyan-400 mb-1 flex justify-center">
                      <metric.icon className="w-4 h-4" />
                    </div>
                    <div className="text-lg font-bold text-white">{metric.value}</div>
                    <div className="text-xs text-gray-400">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Project Image */}
        {projectImage && (
          <div className="relative h-40 overflow-hidden rounded-lg">
            <OptimizedImage
              src={projectImage}
              alt={`${project.title} - Revenue Operations Project Dashboard`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={85}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        )}
      </div>

      {/* CTA Button */}
      <div className="flex justify-center">
        <Link
          href={`/projects/${isMockProject(project) ? project.id : project.slug || project.id}`}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-bold px-6 py-4 min-h-[44px] rounded-lg shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 flex items-center gap-2"
        >
          <span>{customCTA}</span>
          <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  )
})