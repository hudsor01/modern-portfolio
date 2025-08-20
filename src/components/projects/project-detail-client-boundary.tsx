'use client'

import { useProject } from '@/hooks/use-api-queries'
import { usePageAnalytics } from '@/hooks/use-page-analytics'
import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  ArrowLeft, 
  ExternalLink, 
  ArrowRight 
} from 'lucide-react'
import { SiGithub } from 'react-icons/si'
import Link from 'next/link'
import Image from 'next/image'
import { ProjectCharts } from '@/components/projects/project-charts'
import type { Project } from '@/types/project'

interface ProjectDetailClientBoundaryProps {
  slug: string
  initialProject?: Project
}

function ProjectDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-32 mb-4" />
          <Skeleton className="h-12 w-96 mb-2" />
          <Skeleton className="h-6 w-64" />
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-20" />
                ))}
              </div>
            </div>
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProjectDetailClientBoundary({ 
  slug, 
  initialProject 
}: ProjectDetailClientBoundaryProps) {
  // Track page analytics for projects
  usePageAnalytics({
    type: 'project',
    slug: slug,
    trackReadingTime: true,
    trackScrollDepth: true
  })

  // Use modern hook with automatic prefetching
  const { data: project, isLoading, error } = useProject(slug, {
    prefetchAnalytics: true, // Modern: prefetch analytics
    prefetchRelated: true // Modern: prefetch related projects
  })

  // Show loading skeleton
  if (isLoading && !initialProject) {
    return <ProjectDetailSkeleton />
  }

  // Show error state
  if (error && !initialProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <div className="container mx-auto px-6 py-8">
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Project not found</h3>
              <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist.</p>
              <Button asChild>
                <Link href="/projects">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Projects
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Use project data or fallback
  const displayProject = project || initialProject
  
  if (!displayProject) {
    return <ProjectDetailSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <main className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/projects" className="flex items-center gap-2 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </Button>

        {/* Project Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {displayProject.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
            {displayProject.description}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Project Image */}
            {displayProject.image && (
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={displayProject.image}
                  alt={displayProject.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Project Description */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                About This Project
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p>{displayProject.longDescription || displayProject.description}</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Technologies & Links */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {displayProject.technologies?.map((tech: string, index: number) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {displayProject.liveUrl && (
                  <Button asChild className="flex-1">
                    <a href={displayProject.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </a>
                  </Button>
                )}
                {displayProject.githubUrl && (
                  <Button asChild variant="outline" className="flex-1">
                    <a href={displayProject.githubUrl} target="_blank" rel="noopener noreferrer">
                      <SiGithub className="w-4 h-4 mr-2" />
                      View Code
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* Project Metrics */}
            {displayProject.metrics && displayProject.slug && (
              <ProjectCharts projectId={displayProject.slug} />
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Impressed by This Case Study?</h2>
          <p className="text-xl mb-6 opacity-90">
            Connect with me to discuss professional opportunities and revenue operations collaboration
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8"
            asChild
          >
            <Link href="/contact">
              Get In Touch
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}