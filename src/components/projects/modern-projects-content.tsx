'use client'

import React, { useMemo, memo } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { ProjectCard } from '@/components/projects/project-card' 
import { ProjectStats } from '@/components/projects/project-stats'
import { ProjectCTASection } from '@/components/projects/project-cta-section'
import { ShadcnSkeletonWrapper } from '@/components/ui/shadcn-skeleton-wrapper'
import { ProjectErrorBoundary } from '@/components/error/project-error-boundary'
import { mockProjects, type MockProject } from '@/data/mock-projects'
import type { Project as ProjectType } from '@/types/project'
import { MotionDiv, optimizedVariants } from '@/lib/motion/optimized-motion'
import { useMotionConfig } from '@/lib/motion/reduced-motion'

// Union type for projects
type Project = ProjectType | MockProject

// Type guard
function isMockProject(project: Project): project is MockProject {
  return 'year' in project && 'duration' in project && 'impact' in project && 'results' in project && 'displayMetrics' in project
}

interface ModernProjectsContentProps {
  projects?: ProjectType[]
  onPrefetch?: () => void
  isLoading?: boolean
}

export const ModernProjectsContent = memo<ModernProjectsContentProps>(({
  projects: externalProjects,
  onPrefetch: _onPrefetch,
  isLoading = false,
}) => {
  const { shouldAnimate } = useMotionConfig()

  // Use external projects if provided, otherwise fall back to mock data
  const projectsData: Project[] = externalProjects || mockProjects

  // Memoized sorting to prevent expensive recalculations on every render
  const sortedProjects = useMemo(() => {
    // Ensure projectsData is an array before spreading
    const dataArray = Array.isArray(projectsData) ? projectsData : []
    return [...dataArray].sort((a, b) => {
      // Featured projects first
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1

      // Then by year (newest first)
      const aYear = isMockProject(a) ? a.year : new Date(a.createdAt || 0).getFullYear()
      const bYear = isMockProject(b) ? b.year : new Date(b.createdAt || 0).getFullYear()
      return bYear - aYear
    })
  }, [projectsData])

  return (
    <ProjectErrorBoundary>
      <>
        <Navbar />
        <section className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden pt-20">
        {/* Modern Animated Background */}
        <div className="fixed inset-0 -z-10">
          {/* Floating Orbs */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-400/3 rounded-full blur-3xl animate-pulse-glow"></div>
          
          {/* Grid Pattern */}
          <div
            className="absolute inset-0 bg-[image:linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[length:50px_50px]"
            aria-hidden="true"
          ></div>
        </div>

        <div className="container relative z-10 px-6 mx-auto max-w-7xl py-24">
          {/* Hero Section */}
          <div className="text-center space-y-16 max-w-6xl mx-auto pt-12 mb-24">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 page-title-gradient glow-cyan break-words leading-tight py-2">
              Project Portfolio
            </h1>

            <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transforming data into actionable insights and driving measurable business results
              through innovative solutions.
            </p>

            {/* Stats Component */}
            <ProjectStats totalProjects={sortedProjects.length} isLoading={isLoading} />
          </div>

          {/* Projects Section Header */}
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight section-heading-gradient glow-blue">
              Featured Projects
            </h2>
            <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Explore my latest work in revenue operations and data analytics
            </p>
          </div>

          {/* Projects Grid */}
          <div className="space-y-16">
            {isLoading ? (
              <ShadcnSkeletonWrapper layout="card" count={6} variant="default" />
            ) : sortedProjects.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2 text-white">No projects available</h3>
                <p className="text-gray-400">Projects are currently being updated</p>
              </div>
            ) : shouldAnimate ? (
              <MotionDiv
                variants={optimizedVariants.staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 max-w-7xl mx-auto"
              >
                {sortedProjects.map((project, index) => (
                  <MotionDiv
                    key={project.id}
                    variants={optimizedVariants.staggerItem}
                  >
                    <ProjectCard project={project} index={index} />
                  </MotionDiv>
                ))}
              </MotionDiv>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 max-w-7xl mx-auto">
                {sortedProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            )}
          </div>

          {/* CTA Section */}
          <ProjectCTASection />
        </div>
      </section>

      </>
    </ProjectErrorBoundary>
  )
})

ModernProjectsContent.displayName = 'ModernProjectsContent'