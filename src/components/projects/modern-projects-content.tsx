'use client'

import { useMemo, memo } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { ProjectCard } from '@/components/projects/project-card'
import { ProjectStats } from '@/components/projects/project-stats'
import { ProjectCTASection } from '@/components/projects/project-cta-section'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorBoundary } from '@/components/error/error-boundary'
import { showcaseProjects, type ShowcaseProject } from '@/data/projects'
import type { Project as ProjectType } from '@/types/project'

// Union type for projects
type Project = ProjectType | ShowcaseProject

// Type guard
function isShowcaseProject(project: Project): project is ShowcaseProject {
  return (
    'year' in project &&
    'duration' in project &&
    'impact' in project &&
    'results' in project &&
    'displayMetrics' in project
  )
}

interface ModernProjectsContentProps {
  projects?: ProjectType[]
  onPrefetch?: () => void
  isLoading?: boolean
}

export const ModernProjectsContent = memo<ModernProjectsContentProps>(
  ({ projects: externalProjects, onPrefetch: _onPrefetch, isLoading = false }) => {
    // Use external projects if provided, otherwise fall back to showcase data
    const projectsData: Project[] = externalProjects || showcaseProjects

    // Memoized sorting to prevent expensive recalculations on every render
    const sortedProjects = useMemo(() => {
      // Ensure projectsData is an array before spreading
      const dataArray = Array.isArray(projectsData) ? projectsData : []
      return [...dataArray].sort((a, b) => {
        // Featured projects first
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1

        // Then by year (newest first)
        const aYear = isShowcaseProject(a) ? a.year : new Date(a.createdAt || 0).getFullYear()
        const bYear = isShowcaseProject(b) ? b.year : new Date(b.createdAt || 0).getFullYear()
        return bYear - aYear
      })
    }, [projectsData])

    return (
      <ErrorBoundary>
        <>
          <Navbar />
          <section className="relative min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 text-foreground overflow-hidden pt-20">
            {/* Modern Animated Background */}
            <div className="fixed inset-0 -z-10">
              {/* Floating Orbs */}
              <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"></div>
              <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float-delayed"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/3 rounded-full blur-3xl animate-pulse-glow"></div>

              {/* Grid Pattern */}
              <div
                className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-size-[50px_50px]"
                aria-hidden="true"
              ></div>
            </div>

            <div className="w-full relative z-10 px-6 mx-auto max-w-7xl py-24">
              {/* Hero Section */}
              <div className="section-hero">
                <h1 className="heading-page glow-primary mb-8">Project Portfolio</h1>

                <p className="text-body text-centered-md mb-16">
                  Transforming data into actionable insights and driving measurable business results
                  through innovative solutions.
                </p>

                {/* Stats Component */}
                <ProjectStats totalProjects={sortedProjects.length} isLoading={isLoading} />
              </div>

              {/* Projects Section Header */}
              <div className="section-header">
                <h2 className="heading-section glow-secondary mb-6">Featured Projects</h2>
                <p className="text-body text-centered-sm">
                  Explore my latest work in revenue operations and data analytics
                </p>
              </div>

              {/* Projects Grid */}
              <div className="mt-16">
                {isLoading ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 max-w-7xl mx-auto">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="space-y-4 p-6 border border-border rounded-xl">
                        <Skeleton className="h-48 w-full rounded-lg" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    ))}
                  </div>
                ) : sortedProjects.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-xl mb-4">📊</div>
                    <h3 className="typography-h4 mb-2 text-white">No projects available</h3>
                    <p className="typography-muted">Projects are currently being updated</p>
                  </div>
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
      </ErrorBoundary>
    )
  }
)

ModernProjectsContent.displayName = 'ModernProjectsContent'
