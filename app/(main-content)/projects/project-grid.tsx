'use client';

import type { Route } from 'next';
import { ProjectCard } from './project-card';
import type { Project } from '@/lib/data/projects';

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
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
