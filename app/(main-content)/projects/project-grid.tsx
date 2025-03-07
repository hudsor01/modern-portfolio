'use client';

import type { Route } from 'next';
import { ProjectCard } from './project-card';
import type { Project } from '@/lib/data/projects';

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {projects.map((project, index) => (
        <div
          key={project.id}
          className="h-full"
        >
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  );
}
