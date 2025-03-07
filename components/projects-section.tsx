'use client';

import React from 'react';
import { NextSeo } from 'next-seo';
import { useFeaturedProjects } from '@/hooks/use-projects';
import { SkillsChart } from './ui/skills-chart';
import { ProjectCard } from '@/app/(main-content)/projects/project-card'

export function ProjectsSection() {
  const { data: projects, isLoading, error } = useFeaturedProjects()

  return (
    <section className="bg-background py-16">
      <NextSeo
        title="Projects | Richard Hudson Portfolio"
        description="Featured projects showcasing my skills in web development and software engineering."
      />
      <div className="container-custom">
        <h2 className="mb-8 text-3xl font-bold">Featured Projects</h2>

        {isLoading && <div>Loading projects...</div>}
        {error && <div>Error loading projects</div>}

        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {projects?.map((project) => (
            <ProjectCard
              key={project.id}
              project={{
                ...project,
                slug: project.slug ?? project.id,
                image: project.imageUrl,
                technologies: project.technologies.split(',').map((tech: string) => tech.trim()),
              }}
            />
          ))}
        </div>

        <div className="mt-16">
          <h3 className="mb-6 text-2xl font-semibold">Skills Overview</h3>
          <SkillsChart />
        </div>
      </div>
    </section>
  )
}
