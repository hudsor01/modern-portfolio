'use client';

import { useProject } from '@/hooks/use-api-queries';
import { notFound } from 'next/navigation';
import type { Project } from '@/types/project';
import type { ProjectData } from '@/types/shared-api';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ProjectDetailClientBoundaryProps {
  slug: string;
  initialProject?: Project; // Optional: SSR data for hydration
}

// Type guard to check if project is the full Project type
function isFullProject(project: ProjectData | Project): project is Project {
  return 'longDescription' in project && 'metrics' in project && 'year' in project;
}

export default function ProjectDetailClientBoundary({ 
  slug, 
  initialProject 
}: ProjectDetailClientBoundaryProps) {
  const { data: projectResponse, isLoading, isError, error } = useProject(slug);
  
  // Use hydrated data or fallback to initial data
  const project = projectResponse?.data || initialProject;

  // Handle loading state (only show if no data available)
  if (isLoading && !project) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0f172a] text-white">
          <div className="container mx-auto max-w-7xl py-16 px-4">
            <div className="animate-pulse space-y-8">
              <div className="h-4 bg-white/10 rounded w-32"></div>
              <div className="h-12 bg-white/10 rounded w-96"></div>
              <div className="h-4 bg-white/10 rounded w-full max-w-2xl"></div>
              <div className="h-64 bg-white/10 rounded-xl"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Handle error state (only if no data available)
  if (isError && !project) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0f172a] text-white">
          <div className="container mx-auto max-w-7xl py-16 px-4">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4 text-red-400">Error loading project</h3>
              <p className="text-gray-400 mb-8">{error?.message || 'An unknown error occurred.'}</p>
              <Link
                href="/projects"
                className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to all projects
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // If no project found, show 404
  if (!project) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0f172a] text-white">
        <div className="container mx-auto max-w-7xl py-16 px-4">
          {/* Back Navigation */}
          <Link
            href="/projects"
            className="text-gray-400 hover:text-blue-400 mb-8 inline-flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to all projects</span>
          </Link>

          {/* Project Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400">
              {project.title}
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">
              {project.description}
            </p>

            {/* Technology Badges */}
            {project.technologies && (
              <div className="flex flex-wrap gap-2 mb-8">
                {project.technologies.map((tech: string) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="bg-blue-500/10 border border-blue-500/30 text-blue-300"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {(isFullProject(project) && (project.liveUrl || project.link)) && (
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <a
                    href={project.liveUrl || project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Live Project
                  </a>
                </Button>
              )}
              {(!isFullProject(project) && project.demoUrl) && (
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Live Project
                  </a>
                </Button>
              )}
              {(isFullProject(project) && (project.githubUrl || project.github)) && (
                <Button asChild variant="outline" className="border-blue-500 text-blue-300 hover:bg-blue-500/10">
                  <a
                    href={project.githubUrl || project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Github className="h-4 w-4" />
                    View Source Code
                  </a>
                </Button>
              )}
              {(!isFullProject(project) && project.githubUrl) && (
                <Button asChild variant="outline" className="border-blue-500 text-blue-300 hover:bg-blue-500/10">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Github className="h-4 w-4" />
                    View Source Code
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Project Image */}
          {(isFullProject(project) && project.image) && (
            <div className="mb-12 overflow-hidden rounded-xl border border-white/10">
              <div className="relative h-[300px] w-full md:h-[500px]">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}
          {(!isFullProject(project) && project.imageUrl) && (
            <div className="mb-12 overflow-hidden rounded-xl border border-white/10">
              <div className="relative h-[300px] w-full md:h-[500px]">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}

          {/* Project Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {/* Project Overview */}
              {isFullProject(project) && project.details?.challenge && (
                <section className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8">
                  <h2 className="text-2xl font-bold mb-4 text-blue-300">Challenge</h2>
                  <p className="text-gray-300 leading-relaxed">
                    {project.details.challenge}
                  </p>
                </section>
              )}

              {isFullProject(project) && project.details?.solution && (
                <section className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8">
                  <h2 className="text-2xl font-bold mb-4 text-blue-300">Solution</h2>
                  <p className="text-gray-300 leading-relaxed">
                    {project.details.solution}
                  </p>
                </section>
              )}

              {isFullProject(project) && project.details?.impact && (
                <section className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8">
                  <h2 className="text-2xl font-bold mb-4 text-blue-300">Impact</h2>
                  <p className="text-gray-300 leading-relaxed">
                    {project.details.impact}
                  </p>
                </section>
              )}

              {/* For ProjectData type, show basic description */}
              {!isFullProject(project) && (
                <section className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8">
                  <h2 className="text-2xl font-bold mb-4 text-blue-300">About This Project</h2>
                  <p className="text-gray-300 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="mt-4">
                    <p className="text-sm text-gray-400">
                      Category: {project.category} • Created: {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Metrics for full project type */}
              {isFullProject(project) && project.metrics && (
                <section className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-6 text-blue-300">Key Metrics</h2>
                  <div className="space-y-4">
                    {Object.entries(project.metrics).map(([key, value]) => (
                      <div key={key} className="text-center p-4 bg-white/5 rounded-lg">
                        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400">
                          {String(value)}
                        </div>
                        <div className="text-sm text-gray-400 capitalize">
                          {key.replace(/_/g, ' ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Project Info for basic project type */}
              {!isFullProject(project) && (
                <section className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-6 text-blue-300">Project Info</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Category</span>
                      <span className="text-white capitalize">{project.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Featured</span>
                      <span className="text-white">{project.featured ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Created</span>
                      <span className="text-white">{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </section>
              )}

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-center">
                <p className="text-lg mb-4">Interested in working together?</p>
                <Button asChild variant="outline" className="bg-white text-blue-600 hover:bg-white/90">
                  <Link href="/contact">Get In Touch</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}