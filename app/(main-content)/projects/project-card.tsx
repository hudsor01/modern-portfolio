'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Route } from 'next';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart2, LineChart, PieChart } from 'lucide-react';
import { RevenueDashboardPreview } from './revenue-dashboard-preview';
import type { Project } from '@/lib/data/projects';
import { projectPaths } from '@/lib/data/projects-paths';

interface ProjectCardProps {
  project: Project;
}

// Get icon based on project type
const getProjectIcon = (projectType: string) => {
  switch (projectType) {
    case 'dashboard':
      return <BarChart2 className="h-5 w-5 text-blue-500" />;
    case 'analytics':
      return <LineChart className="h-5 w-5 text-indigo-500" />;
    case 'visualization':
      return <PieChart className="h-5 w-5 text-purple-500" />;
    default:
      return <BarChart2 className="h-5 w-5 text-blue-500" />;
  }
};

// Component implementation
function ProjectCardComponent({ project }: ProjectCardProps) {
  const projectPath = projectPaths[project.id] || '/projects';
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full border-slate-200 dark:border-slate-700">
      {project.image && (
        <div className="relative aspect-video w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 z-10"></div>
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-all duration-500 hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
            priority={project.featured}
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEogJbKxoRiQAAAABJRU5ErkJggg=="
            placeholder="blur"
          />
          {project.featured && (
            <div className="absolute top-3 right-3 z-20 bg-blue-600 text-white text-xs font-bold py-1 px-2 rounded-full">
              Featured
            </div>
          )}
        </div>
      )}

      {project.id === 'revenue-dashboard' && !project.image && (
        <div className="bg-slate-100 dark:bg-slate-800/50 h-48 w-full overflow-hidden relative">
          <RevenueDashboardPreview />
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="line-clamp-1 text-xl">{project.title}</CardTitle>
          <div>{getProjectIcon(project.type || 'dashboard')}</div>
        </div>
        <CardDescription className="line-clamp-2 mt-1">{project.description}</CardDescription>
      </CardHeader>

      {project.technologies && project.technologies.length > 0 && (
        <CardContent className="pt-0 pb-4 flex-grow">
          <div className="flex flex-wrap gap-2 mt-3">
            {project.technologies.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 rounded-full px-2.5 py-0.5 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full px-2.5 py-0.5 text-xs font-medium">
                +{project.technologies.length - 3} more
              </span>
            )}
          </div>
        </CardContent>
      )}

      <CardFooter className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <Button variant="ghost" className="group ml-auto text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-0" asChild>
          <Link href={projectPath as Route<string>}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const ProjectCard = React.memo(ProjectCardComponent);
