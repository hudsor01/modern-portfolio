'use client'

import { usePageAnalytics } from '@/hooks/use-page-analytics'
import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SectionCard } from '@/components/ui/section-card'
import { ChartContainer } from '@/components/ui/chart-container'
import { ExternalLink, ArrowRight, Github } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Project } from '@/types/project'
import { normalizeProjectForDisplay } from '@/types/project'

interface ProjectDetailClientBoundaryProps {
  slug: string
  initialProject: Project
}

/**
 * Official Next.js 16 Pattern: Client Component with Server-Provided Data
 *
 * This component receives data from the Server Component parent.
 * No client-side fetching needed - data is already available.
 * Uses React 19 patterns for optimal performance.
 */
export default function ProjectDetailClientBoundary({
  slug,
  initialProject,
}: ProjectDetailClientBoundaryProps) {
  // Track page analytics
  usePageAnalytics({
    type: 'project',
    slug: slug,
    trackReadingTime: true,
    trackScrollDepth: true,
  })

  // Use the server-provided data directly - no fetching needed
  const project = normalizeProjectForDisplay(initialProject)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-1/4 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -left-32 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

        <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-20">
          {/* Hero Section */}
          <div className="container mx-auto px-6 mb-16">
            <div className="max-w-4xl mx-auto">
              <Link
                href="/projects"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
              >
                <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                Back to Projects
              </Link>

              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{project.category}</Badge>
                  {project.featured && <Badge variant="default">Featured</Badge>}
                </div>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  {project.title}
                </h1>

                <p className="text-xl text-muted-foreground">
                  {project.description}
                </p>

                {/* Project meta */}
                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                  {project.client && (
                    <div>
                      <span className="font-medium">Client:</span> {project.client}
                    </div>
                  )}
                  {project.duration && (
                    <div>
                      <span className="font-medium">Duration:</span> {project.duration}
                    </div>
                  )}
                  {project.year && (
                    <div>
                      <span className="font-medium">Year:</span> {project.year}
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-4">
                  {project.link && (
                    <Button asChild>
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        View Live <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {project.github && (
                    <Button variant="outline" asChild>
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        Source Code
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Project Image */}
          {project.image && (
            <div className="container mx-auto px-6 mb-16">
              <div className="max-w-5xl mx-auto">
                <div className="relative aspect-video rounded-lg overflow-hidden border">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          )}

          {/* Display Metrics */}
          {Array.isArray(project.displayMetrics) && project.displayMetrics.length > 0 && (
            <div className="container mx-auto px-6 mb-16">
              <div className="max-w-5xl mx-auto">
                <SectionCard title="Key Metrics">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(project.displayMetrics as Array<{ label: string; value: string; iconName: string }>).filter(Boolean).map((metric, index) => (
                      <div key={index} className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">
                          {metric.value}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </div>
            </div>
          )}

          {/* Long Description */}
          {project.longDescription && (
            <div className="container mx-auto px-6 mb-16">
              <div className="max-w-4xl mx-auto">
                <SectionCard title="Overview">
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="text-lg leading-relaxed">{project.longDescription}</p>
                  </div>
                </SectionCard>
              </div>
            </div>
          )}

          {/* Technologies */}
          {project.tags && project.tags.length > 0 && (
            <div className="container mx-auto px-6 mb-16">
              <div className="max-w-4xl mx-auto">
                <SectionCard title="Technologies Used">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </SectionCard>
              </div>
            </div>
          )}

          {/* Impact & Results */}
          {(project.impact || project.results) && (
            <div className="container mx-auto px-6 mb-16">
              <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
                {Array.isArray(project.impact) && project.impact.length > 0 && (
                  <SectionCard title="Impact">
                    <ul className="space-y-2">
                      {(project.impact as string[]).map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </SectionCard>
                )}
                {Array.isArray(project.results) && project.results.length > 0 && (
                  <SectionCard title="Results">
                    <ul className="space-y-2">
                      {(project.results as Array<{ metric: string; before: string; after: string; improvement: string }>).map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{item.metric}: {item.before} → {item.after} ({item.improvement})</span>
                        </li>
                      ))}
                    </ul>
                  </SectionCard>
                )}
              </div>
            </div>
          )}

          {/* Charts */}
          {Array.isArray(project.charts) && project.charts.length > 0 && (
            <div className="container mx-auto px-6 mb-16">
              <div className="max-w-5xl mx-auto space-y-8">
                {(project.charts as Array<{ type: string; title: string; description?: string; dataKey: string }>).map((chart, index) => (
                  <ChartContainer
                    key={index}
                    title={chart.title}
                    description={chart.description}
                  >
                    {/* Chart component would go here */}
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      Chart: {chart.title}
                    </div>
                  </ChartContainer>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
