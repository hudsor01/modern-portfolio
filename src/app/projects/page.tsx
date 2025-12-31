'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ProjectCard } from '@/components/projects/project-card'
import { ProjectStats } from '@/components/projects/project-stats'
import { ProjectCTASection } from '@/components/projects/project-cta-section'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorBoundary } from '@/components/error/error-boundary'
import type { Project } from '@/types/project'

export default function ProjectsPage() {
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await fetch('/api/projects')
      if (!res.ok) throw new Error('Failed to fetch projects')
      return (await res.json()).data || []
    },
    staleTime: 5 * 60 * 1000,
  })

  const sortedProjects = useMemo(() => {
    if (!projects) return []
    return [...projects].sort((a: Project, b: Project) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    })
  }, [projects])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="typography-large mb-2">Failed to load projects</h3>
          <p className="typography-muted">Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <>
        <Navbar />
        <main id="main-content" className="relative min-h-screen text-foreground overflow-hidden pt-20">
          {/* Clean Background */}
          <div className="fixed inset-0 -z-20 bg-background" />

          {/* Subtle texture */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 0.5px, transparent 0)',
                backgroundSize: '32px 32px'
              }}
            />
          </div>

          <div className="w-full relative z-10 px-6 mx-auto max-w-7xl py-24">
            {/* Hero Section */}
            <div className="section-hero">
              <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-8 text-center">Project Portfolio</h1>
              <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-16">
                Transforming data into actionable insights and driving measurable business results
                through innovative solutions.
              </p>
              <ProjectStats totalProjects={sortedProjects.length} isLoading={isLoading} />
            </div>

            {/* Projects Section Header */}
            <div className="section-header mt-24">
              <h2 className="font-display text-3xl font-semibold text-foreground mb-6 text-center">Featured Projects</h2>
              <p className="text-muted-foreground text-center max-w-xl mx-auto">
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
                  <h3 className="text-xl font-semibold mb-2 text-foreground">No projects available</h3>
                  <p className="text-muted-foreground">Projects are currently being updated</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 max-w-7xl mx-auto">
                  {sortedProjects.map((project: Project, index: number) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                  ))}
                </div>
              )}
            </div>

            {/* CTA Section */}
            <ProjectCTASection />
          </div>
        </main>
        <Footer />
      </>
    </ErrorBoundary>
  )
}
