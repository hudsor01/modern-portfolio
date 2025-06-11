'use client';

import { useProject } from '@/hooks/use-projects';
import type { Project } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ProjectDetailClientBoundaryProps {
  slug: string;
  initialProject?: Project;
}

export default function ProjectDetailClientBoundary({ 
  slug, 
  initialProject 
}: ProjectDetailClientBoundaryProps) {
  const { data: project, isLoading, isError, error } = useProject(slug);
  
  // Use hydrated data or fallback to initial data
  const projectToDisplay = project || initialProject;

  // Handle loading state
  if (isLoading && !projectToDisplay) {
    return (
      <div className="container mx-auto max-w-7xl py-16 px-4">
        <div className="animate-pulse">
          {/* Back button skeleton */}
          <div className="h-6 w-32 bg-muted rounded mb-8"></div>
          
          {/* Title skeleton */}
          <div className="h-12 w-3/4 bg-muted rounded mb-6"></div>
          
          {/* Tech badges skeleton */}
          <div className="flex gap-2 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-6 w-20 bg-muted rounded-full"></div>
            ))}
          </div>
          
          {/* Image skeleton */}
          <div className="h-96 bg-muted rounded-xl mb-12"></div>
          
          {/* Content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-xl"></div>
              ))}
            </div>
            <div className="space-y-8">
              <div className="h-80 bg-muted rounded-xl"></div>
              <div className="h-48 bg-muted rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (isError && !projectToDisplay) {
    return (
      <div className="container mx-auto max-w-7xl py-16 px-4 text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">Project Not Found</h1>
        <p className="text-muted-foreground mb-8">
          {error?.message || 'The project you are looking for could not be found.'}
        </p>
        <Button asChild>
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>
        </Button>
      </div>
    );
  }

  // Handle project not found
  if (!projectToDisplay) {
    return (
      <div className="container mx-auto max-w-7xl py-16 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The project "{slug}" could not be found.
        </p>
        <Button asChild>
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl py-16 px-4">
      {/* Back Navigation */}
      <Link
        href="/projects"
        className="text-muted-foreground hover:text-primary mb-8 inline-flex items-center gap-1 transition-all"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to all projects</span>
      </Link>

      {/* Project Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-6 portfolio-text-gradient">
          {projectToDisplay.title}
        </h1>

        {/* Technology Badges */}
        <div className="mt-4 flex flex-wrap gap-2">
          {projectToDisplay.technologies?.map((tech: string) => (
            <Badge
              key={tech}
              variant="secondary"
              className="bg-primary/10 text-primary border-0"
            >
              {tech}
            </Badge>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-4">
          {(projectToDisplay.liveUrl || projectToDisplay.link) && (
            <Button asChild className="bg-primary text-primary-foreground">
              <a
                href={projectToDisplay.liveUrl || projectToDisplay.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View Live Project
              </a>
            </Button>
          )}
          {(projectToDisplay.githubUrl || projectToDisplay.github) && (
            <Button asChild variant="outline" className="border-primary text-primary">
              <a
                href={projectToDisplay.githubUrl || projectToDisplay.github}
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
      <div className="mb-12 overflow-hidden rounded-xl shadow-lg border border-border">
        <div className="relative h-[300px] w-full sm:h-[400px] md:h-[500px]">
          <Image
            src={projectToDisplay.image || '/images/project-placeholder.jpg'}
            alt={projectToDisplay.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Project Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-8">
            {/* Project Overview */}
            <section className="bg-card rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-primary">Project Overview</h2>
              <p className="text-foreground mb-4">{projectToDisplay.description}</p>
              <p className="text-foreground">
                This project was developed to streamline the revenue operations process and provide
                better visibility into key performance metrics. The solution incorporates data
                visualization, automated reporting, and user-friendly interfaces to make complex
                information accessible to stakeholders at all levels.
              </p>
            </section>

            {/* Key Features */}
            <section className="bg-card rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-primary">Key Features</h2>
              <ul className="list-disc pl-6 space-y-3 text-foreground">
                <li>Interactive dashboard for real-time performance monitoring</li>
                <li>Automated reporting and alert system</li>
                <li>Seamless integration with existing CRM systems</li>
                <li>Custom analytics for revenue forecasting</li>
                <li>Role-based access controls for secure data sharing</li>
              </ul>
            </section>

            {/* Results & Impact */}
            <section className="bg-card rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-primary">Results & Impact</h2>
              <p className="text-foreground mb-4">
                Implementation of this solution resulted in:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-foreground">
                <li>40% reduction in time spent on manual reporting tasks</li>
                <li>35% improvement in forecast accuracy</li>
                <li>25% increase in team productivity through process automation</li>
                <li>Improved data-driven decision making across the organization</li>
              </ul>
            </section>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Technologies Used */}
          <section className="bg-card rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-primary">Technologies Used</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Frontend</h3>
                <ul className="list-disc pl-6 space-y-2 text-foreground">
                  <li>React & Next.js</li>
                  <li>TypeScript</li>
                  <li>Tailwind CSS</li>
                  <li>Data visualization libraries</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Backend</h3>
                <ul className="list-disc pl-6 space-y-2 text-foreground">
                  <li>Node.js</li>
                  <li>PostgreSQL database</li>
                  <li>RESTful API design</li>
                  <li>Cloud deployment</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-8 text-white text-center shadow-xl">
            <p className="text-xl mb-6">Interested in working together on a similar project?</p>
            <Button
              asChild
              variant="outline"
              className="bg-white text-primary hover:bg-white/90 border-white"
            >
              <Link href="/contact">Get In Touch</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}