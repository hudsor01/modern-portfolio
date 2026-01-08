'use client'

import { useQuery } from '@tanstack/react-query'
import { usePageAnalytics } from '@/hooks/use-page-analytics'
import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProjectPageLayout } from './project-page-layout'
import { SectionCard } from '@/components/ui/section-card'
import { ChartContainer } from '@/components/ui/chart-container'
import { DataLoadingState } from '@/components/ui/loading-states'
import { ExternalLink, ArrowRight, Github } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Project } from '@/types/project'
import { normalizeProjectForDisplay } from '@/types/project'
import type { ProjectTag } from '@/lib/design-system/types'

interface ProjectDetailClientBoundaryProps {
  slug: string
  initialProject?: Project
}

export default function ProjectDetailClientBoundary({
  slug,
  initialProject,
}: ProjectDetailClientBoundaryProps) {
  // Track page analytics for projects
  usePageAnalytics({
    type: 'project',
    slug: slug,
    trackReadingTime: true,
    trackScrollDepth: true,
  })

  // Direct TanStack Query usage
  const {
    data: project,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['project', slug],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${slug}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) throw new Error('Failed to fetch project')
      const result = await response.json()
      return result.data || result
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  })

  // Use project data or fallback
  const displayProject =
    project || initialProject ? normalizeProjectForDisplay(project || initialProject!) : null

  // Convert project data to standardized format
  const projectTags: ProjectTag[] =
    displayProject?.technologies?.map((tech: string) => ({
      label: tech,
      variant: 'secondary' as const,
    })) || []

  // Add category tag if available
  if (displayProject?.category) {
    projectTags.unshift({
      label: displayProject.category,
      variant: 'primary' as const,
    })
  }

  const handleRetry = () => {
    refetch()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <DataLoadingState
        loading={isLoading && !initialProject}
        error={error && !initialProject ? error : null}
        empty={!displayProject && !isLoading && !error}
        emptyMessage="Project not found"
        emptyAction={{
          label: 'Back to Projects',
          onClick: () => (window.location.href = '/projects'),
        }}
        retryAction={handleRetry}
        errorVariant="not-found"
        loadingComponent={
          <ProjectPageLayout
            title="Loading..."
            description="Please wait while we load the project details."
            tags={[]}
          >
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <SectionCard title="Project Image" variant="glass">
                  <div className="aspect-video bg-muted animate-pulse rounded-lg" />
                </SectionCard>
                <SectionCard title="About This Project" variant="glass">
                  <div className="space-y-3">
                    <div className="h-4 bg-muted animate-pulse rounded" />
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                    <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                  </div>
                </SectionCard>
              </div>
              <div className="space-y-8">
                <SectionCard title="Technologies Used" variant="glass">
                  <div className="flex gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-6 w-20 bg-muted animate-pulse rounded" />
                    ))}
                  </div>
                </SectionCard>
                <ChartContainer title="Impact Analysis" loading>
                  <div />
                </ChartContainer>
              </div>
            </div>
          </ProjectPageLayout>
        }
      >
        {displayProject && (
          <ProjectPageLayout
            title={displayProject.title}
            description={displayProject.description}
            tags={projectTags}
            navigation={{
              backUrl: '/projects',
              backLabel: 'Back to Projects',
            }}
          >
            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Project Image */}
                {displayProject.image && (
                  <SectionCard title="Project Overview" variant="glass">
                    <div className="relative aspect-video rounded-xl overflow-hidden">
                      <Image
                        src={displayProject.image}
                        alt={displayProject.title}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  </SectionCard>
                )}

                {/* Project Description */}
                <SectionCard
                  title="About This Project"
                  description="Detailed overview of the project goals, challenges, and approach"
                  variant="default"
                >
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      {displayProject.longDescription || displayProject.description}
                    </p>
                  </div>
                </SectionCard>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Technologies & Links */}
                <SectionCard
                  title="Technologies & Resources"
                  description="Technical stack and project links"
                  variant="default"
                >
                  <div className="space-y-6">
                    {/* Technologies */}
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                        Technologies Used
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {displayProject.technologies?.map((tech: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {(displayProject.liveUrl || displayProject.githubUrl) && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                          Project Links
                        </h4>
                        <div className="flex gap-3">
                          {displayProject.liveUrl && (
                            <Button asChild className="flex-1">
                              <a
                                href={displayProject.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Live Demo
                              </a>
                            </Button>
                          )}
                          {displayProject.githubUrl && (
                            <Button asChild variant="outline" className="flex-1">
                              <a
                                href={displayProject.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Github className="w-4 h-4 mr-2" />
                                View Code
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </SectionCard>
              </div>
            </div>

            {/* CTA Section */}
            <SectionCard
              title="Impressed by This Case Study?"
              variant="gradient"
              className="mt-16 text-center"
            >
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Connect with me to discuss professional opportunities and revenue operations
                  collaboration
                </p>
                <Button size="lg" className="font-semibold px-8" asChild>
                  <Link href="/contact">
                    Get In Touch
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </SectionCard>
          </ProjectPageLayout>
        )}
      </DataLoadingState>
    </div>
  )
}
