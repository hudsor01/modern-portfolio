'use client';

import { motion } from 'framer-motion';
import type { Route } from 'next';
import { ProjectCard } from './project-card';
import type { Project } from '@/lib/data/projects';

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="h-full"
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </div>
  );
}
