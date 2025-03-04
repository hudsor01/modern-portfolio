import * as React from 'react'
import { ProjectCarousel } from '@/app/(marketing)/projects/project-carousel'
import { getProjects } from '@/lib/data/projects'

function HomePage() {
  // Get featured projects from your data source
  const featuredProjects = getProjects().filter(project => project.featured);

  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to my portfolio</h1>
        <p className="text-muted-foreground text-lg max-w-3xl">
          I design and build modern web applications with focus on performance and user experience.
        </p>
      </section>

      <ProjectCarousel
        projects={featuredProjects}
        title="Featured Projects"
        subtitle="Check out some of my recent work"
      />

      {/* Additional homepage content can go here */}
    </div>
  );
}

export default HomePage;
