'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Project as ProjectType } from '@/types/project'
import { 
  ProfessionalCard, 
  ProfessionalCardHeader, 
  ProfessionalCardTitle, 
  ProfessionalCardSubtitle,
  ProfessionalCardDescription,
  ProfessionalCardContent,
  ProfessionalCardStats,
  ProfessionalCardBadge,
  ProfessionalCardFooter
} from '@/components/ui/professional-card'
import { ArrowRight, ExternalLink } from 'lucide-react'

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
    <ProfessionalCard variant="interactive" size="lg" className="h-full group">
      <ProfessionalCardHeader>
        <ProfessionalCardTitle className="text-xl font-bold">
          {project.title}
        </ProfessionalCardTitle>
        {isMockProject(project) && (
          <ProfessionalCardSubtitle>
            {project.client} • {project.duration}
          </ProfessionalCardSubtitle>
        )}
        <ProfessionalCardDescription className="mt-3">
          {project.description}
        </ProfessionalCardDescription>
      </ProfessionalCardHeader>

      <ProfessionalCardContent className="space-y-6">
        {/* Business Metrics */}
        {isMockProject(project) && project.metrics.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {project.metrics.slice(0, 3).map((metric, i) => (
              <ProfessionalCardStats 
                key={i}
                value={metric.value}
                label={metric.label}
                trend="up"
              />
            ))}
          </div>
        )}

        {/* Technology Tags */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((tech, i) => (
              <ProfessionalCardBadge key={i} variant="secondary" className="text-xs">
                {tech}
              </ProfessionalCardBadge>
            ))}
            {project.technologies.length > 4 && (
              <ProfessionalCardBadge variant="outline" className="text-xs">
                +{project.technologies.length - 4} more
              </ProfessionalCardBadge>
            )}
          </div>
        )}

        {/* Project Image */}
        {projectImage && (
          <div className="relative h-40 overflow-hidden rounded-lg">
            <Image
              src={projectImage}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}
      </ProfessionalCardContent>

      <ProfessionalCardFooter className="pt-6">
        <Link
          href={`/projects/${isMockProject(project) ? project.id : project.slug || project.id}`}
          className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 group"
        >
          <span>{customCTA}</span>
          <ArrowRight size={16} className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
        
        {(('link' in project && project.link) || (isMockProject(project) && project.liveUrl)) && (
          <a
            href={('link' in project && project.link) || (isMockProject(project) ? project.liveUrl : '') || ''}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-slate-400 hover:text-slate-300 transition-colors duration-200"
          >
            <ExternalLink size={16} className="mr-1" />
            <span className="text-sm">Live Demo</span>
          </a>
        )}
      </ProfessionalCardFooter>
    </ProfessionalCard>
  )
})