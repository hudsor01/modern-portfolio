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
          {/* Premium Enhanced Background */}
          <div className="fixed inset-0 -z-20 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />

          {/* Animated Background Decorations */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Large ambient glows - similar to homepage */}
            <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />

            <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-gradient-to-tl from-emerald-500/15 via-teal-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />

            {/* Medium accent blobs */}
            <div className="absolute top-1/3 -left-16 w-96 h-96 bg-gradient-to-r from-violet-500/10 via-purple-500/5 to-transparent rounded-full blur-2xl" />

            <div className="absolute bottom-1/3 -right-16 w-96 h-96 bg-gradient-to-l from-blue-500/10 via-cyan-500/5 to-transparent rounded-full blur-2xl" />

            {/* Small floating elements for depth */}
            <div className="absolute top-1/4 left-1/3 w-48 h-48 bg-cyan-400/8 rounded-full blur-xl animate-float" />
            <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-emerald-400/8 rounded-full blur-xl animate-float-delayed" />

            {/* Subtle grid overlay for texture */}
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(100 200 255 / 0.3) 1px, transparent 0)',
                backgroundSize: '50px 50px'
              }}
            />
          </div>

          <div className="w-full relative z-10 px-6 mx-auto max-w-7xl py-24">
            {/* Hero Section */}
            <div className="section-hero">
              <h1 className="heading-page glow-primary mb-8">Project Portfolio</h1>
              <p className="text-body text-centered-md mb-16">
                Transforming data into actionable insights and driving measurable business results
                through innovative solutions.
              </p>
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
