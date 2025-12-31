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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <h3 className="font-display text-2xl text-foreground mb-3">Unable to load projects</h3>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <>
        <Navbar />
        <main id="main-content" className="relative min-h-screen bg-background overflow-hidden">
          {/* Subtle dot pattern background */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div
              className="absolute inset-0 opacity-[0.015]"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 0.5px, transparent 0)',
                backgroundSize: '40px 40px'
              }}
            />
          </div>

          <div className="w-full relative z-10 px-6 mx-auto max-w-7xl">
            {/* Hero Section */}
            <section className="pt-32 pb-20">
              {/* Eyebrow */}
              <p className="text-center text-sm font-medium tracking-widest uppercase text-primary mb-6 animate-fade-in-up">
                Portfolio
              </p>

              {/* Main Heading */}
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground text-center mb-6 animate-fade-in-up" style={{ animationDelay: '80ms' }}>
                Revenue Operations<br className="hidden sm:block" /> Excellence
              </h1>

              {/* Subheading */}
              <p className="text-lg lg:text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-16 animate-fade-in-up" style={{ animationDelay: '160ms' }}>
                Transforming data into actionable insights and driving measurable business results through innovative solutions.
              </p>

              {/* Stats Grid */}
              <div className="animate-fade-in-up" style={{ animationDelay: '240ms' }}>
                <ProjectStats totalProjects={sortedProjects.length} isLoading={isLoading} />
              </div>
            </section>

            {/* Divider */}
            <div className="w-16 h-px bg-border mx-auto mb-20" />

            {/* Projects Section */}
            <section className="pb-16">
              {/* Section Header */}
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
                <div>
                  <h2 className="font-display text-2xl lg:text-3xl font-semibold text-foreground mb-2">
                    Featured Work
                  </h2>
                  <p className="text-muted-foreground">
                    Explore case studies in revenue operations and data analytics
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {sortedProjects.length} {sortedProjects.length === 1 ? 'project' : 'projects'}
                </p>
              </div>

              {/* Projects Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden">
                      <Skeleton className="aspect-[16/10] w-full" />
                      <div className="p-6 lg:p-8 space-y-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-7 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <div className="flex gap-2 pt-4">
                          <Skeleton className="h-8 w-20" />
                          <Skeleton className="h-8 w-20" />
                          <Skeleton className="h-8 w-20" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : sortedProjects.length === 0 ? (
                <div className="text-center py-24 bg-card border border-border rounded-2xl">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">No projects yet</h3>
                  <p className="text-muted-foreground">Projects are currently being updated</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {sortedProjects.map((project: Project, index: number) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                  ))}
                </div>
              )}
            </section>

            {/* CTA Section */}
            <ProjectCTASection />
          </div>
        </main>
        <Footer />
      </>
    </ErrorBoundary>
  )
}
