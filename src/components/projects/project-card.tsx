'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import type { Project as ProjectType } from '@/types/project'

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

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const projectImage = isMockProject(project)
    ? '/images/projects/revenue-operations.jpg'
    : project.image

  const customCTA = getCustomCTA(project.id)

  return (
    <div className="group">
      <div className="relative bg-white/5 backdrop-blur border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 h-full flex flex-col hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25">
        <div className="p-8 flex-1 flex flex-col">
          {/* Inner Container for Content */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 mb-6 flex-1 flex flex-col">
            {/* Project Header */}
            <div className="mb-6">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent mb-3 leading-tight">
                {project.title}
              </h3>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Enhanced Metrics */}
            {isMockProject(project) && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                {project.metrics.map((metric, i) => (
                  <div
                    key={i}
                    className="text-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10"
                  >
                    <div className="flex items-center justify-center mb-3">
                      <metric.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400 mb-1">
                      {metric.value}
                    </div>
                    <div className="text-sm sm:text-base text-gray-400">{metric.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Enhanced Client Info */}
            {isMockProject(project) && (
              <div className="text-sm text-gray-300 mb-8 text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <span className="font-semibold text-blue-400">{project.client}</span> •{' '}
                {project.duration}
              </div>
            )}

            {/* Spacer to push content in inner container */}
            <div className="flex-1"></div>
          </div>

          {/* Project Image - After Content Container */}
          {projectImage && (
            <div className="relative h-32 overflow-hidden rounded-xl mb-6">
              <Image
                src={projectImage}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          )}

          {/* Centered CTA in remaining space */}
          <div className="flex-1 flex items-center justify-center min-h-[60px]">
            <Button
              size="lg"
              className="relative bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-base font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300 group border border-blue-400/20"
              asChild
            >
              <Link
                href={`/projects/${isMockProject(project) ? project.id : project.slug || project.id}`}
              >
                <span className="relative z-10 text-base font-semibold">{customCTA}</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}