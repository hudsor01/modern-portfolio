'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Route } from 'next'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight} from 'lucide-react'
import { RevenueDashboardPreview } from './revenue-dashboard-preview'
import type { Project } from '@/types/project'
import { projectPaths } from '@/app/projects/data/projects-paths'

interface ProjectCardProps {
  project: Project
  onHover?: (slug: string) => void
}

// Component implementation
function ProjectCardComponent({ project, onHover }: ProjectCardProps) {
  const projectPath = projectPaths[project.id] || '/projects'

  return (
    <Card 
      className="overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full border-slate-200 dark:border-slate-700 group hover:-translate-y-2 rounded-xl bg-white dark:bg-slate-900" // Explicitly set background: white for light, slate-900 for dark
      onMouseEnter={() => onHover?.(project.slug)}
    >
      {project.image && (
        <div className="relative aspect-video w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 z-10 group-hover:opacity-0 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEogJbKxoRiQAAAABJRU5ErkJggg=="
            placeholder="blur"
          />
        </div>
      )}

      {project.id === 'revenue-dashboard' && !project.image && (
        <div className="bg-slate-100 dark:bg-slate-800/50 h-48 w-full overflow-hidden relative">
          <RevenueDashboardPreview />
        </div>
      )}

      <CardHeader className="pb-2">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center">
          {project.title}
        </CardTitle>
        <CardDescription className="mt-3 text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100"> {/* Changed to very dark gray (black) and bold for light mode, light gray for dark mode */}
          {project.description}
        </CardDescription>
      </CardHeader>

      {((project.technologies && project.technologies.length > 0) ||
        (project.tags && project.tags.length > 0)) && (
        <CardContent className="pt-0 pb-4 flex-grow">
          <div className="flex flex-wrap gap-3 mt-5">
            {(project.technologies || project.tags || []).map((tag) => {
              // Clean the tag by removing any quotes at the beginning or end
              const cleanTag = tag.replace(/^['"]+|['"]+$/g, '')
              return (
                <span
                  key={tag}
                  className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 rounded-full px-4 py-2 text-base sm:text-lg font-medium shadow-sm"
                >
                  {cleanTag}
                </span>
              )
            })}
          </div>
        </CardContent>
      )}

      <CardFooter className="pt-6 border-t border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex justify-center w-full">
          <Button
            variant="ghost"
            className="px-12 py-6 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            asChild
          >
            <Link href={projectPath as Route<string>} className="flex items-center gap-3">
              <span>
                {project.id === 'churn-retention' && 'View Customer Churn'}
                {project.id === 'deal-funnel' && 'View Sales Pipeline'}
                {project.id === 'lead-attribution' && 'View Lead Attribution'}
                {project.id === 'revenue-kpi' && 'View Revenue KPIs'}
                {!['churn-retention', 'deal-funnel', 'lead-attribution', 'revenue-kpi'].includes(
                  project.id
                ) && `View ${project.title}`}
              </span>
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const ProjectCard = React.memo(ProjectCardComponent)
