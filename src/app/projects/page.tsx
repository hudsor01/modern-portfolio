'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useQueryState } from 'nuqs'
import { projectKeys } from '@/lib/queryKeys'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ProjectCard } from '@/components/projects/project-card'
import { ProjectStats } from '@/components/projects/project-stats'
import { ProjectCTASection } from '@/components/projects/project-cta-section'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ErrorBoundary } from '@/components/error/error-boundary'
import { BarChart3, Search } from 'lucide-react'
import type { Project } from '@/types/project'

export default function ProjectsPage() {
  // Hydration safety - only render interactive elements after mount
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // URL state management with nuqs - URL is the source of truth
  const [search, setSearch] = useQueryState('search', { defaultValue: '' })
  const [category, setCategory] = useQueryState('category', { defaultValue: 'all' })

  const {
    data: projects,
    isLoading,
    error,
  } = useQuery({
    queryKey: projectKeys.list(),
    queryFn: async () => {
      const res = await fetch('/api/projects')
      if (!res.ok) throw new Error('Failed to fetch projects')
      return (await res.json()).data || []
    },
    staleTime: 5 * 60 * 1000,
  })

  const sortedProjects = (() => {
    if (!projects) return []
    return [...projects].sort((a: Project, b: Project) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    })
  })()

  const categories = (() => {
    if (!projects) return []
    const cats = new Set((projects as Project[]).map((p) => p.category).filter(Boolean))
    return Array.from(cats)
  })()

  const filteredProjects = (() => {
    let filtered = sortedProjects
    if (search) {
      const lowerSearch = search.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(lowerSearch) ||
          p.description.toLowerCase().includes(lowerSearch) ||
          (p.tags || []).some((tag: string) => tag.toLowerCase().includes(lowerSearch))
      )
    }
    if (category && category !== 'all') {
      filtered = filtered.filter((p) => p.category === category)
    }
    return filtered
  })()

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
          {/* Decorative background elements */}
          <div className="absolute top-1/4 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 -left-32 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

          <div className="w-full relative z-10 px-6 lg:px-8 mx-auto max-w-7xl">
            {/* Hero Section */}
            <section className="pt-24 pb-16 lg:pt-32 lg:pb-20">
              {/* Eyebrow */}
              <p className="text-center text-sm font-medium tracking-widest uppercase text-primary mb-6 animate-fade-in-up">
                Portfolio
              </p>

              {/* Main Heading */}
              <h1
                className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground text-center mb-6 animate-fade-in-up"
                style={{ animationDelay: '80ms' }}
              >
                Revenue Operations
                <br className="hidden sm:block" /> Excellence
              </h1>

              {/* Subheading */}
              <p
                className="text-lg lg:text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-16 animate-fade-in-up"
                style={{ animationDelay: '160ms' }}
              >
                Transforming data into actionable insights and driving measurable business results
                through innovative solutions.
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
                  {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value || null)}
                    className="pl-10"
                  />
                </div>
                {mounted ? (
                  <Select
                    value={category}
                    onValueChange={(value) => setCategory(value === 'all' ? null : value)}
                  >
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Skeleton className="h-10 w-full sm:w-48 rounded-md" />
                )}
              </div>

              {/* Projects Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-card border border-border rounded-2xl overflow-hidden"
                    >
                      <Skeleton className="aspect-video w-full" />
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
              ) : filteredProjects.length === 0 ? (
                <div className="text-center py-24 bg-card border border-border rounded-2xl">
                  <div className="flex justify-center mb-4">
                    <BarChart3 className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {projects && projects.length === 0
                      ? 'No projects yet'
                      : 'No projects match your search'}
                  </h3>
                  <p className="text-muted-foreground">
                    {projects && projects.length === 0
                      ? 'Projects are currently being updated'
                      : 'Try adjusting your search or filters'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {filteredProjects.map((project: Project, index: number) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      index={index}
                      priority={index < 2}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* CTA Section */}
            <ProjectCTASection totalProjects={sortedProjects.length} />
          </div>
        </main>
        <Footer />
      </>
    </ErrorBoundary>
  )
}
