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
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full border-slate-200 dark:border-slate-700 group hover:-translate-y-2 rounded-xl">
      {project.image && (
        <div className="relative aspect-video w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 z-10 group-hover:opacity-0 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading={project.featured ? undefined : "lazy"}
            priority={!!project.featured}
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEogJbKxoRiQAAAABJRU5ErkJggg=="
            placeholder="blur"
          />
          {project.featured && (
            <div className="absolute top-3 right-3 z-20 bg-blue-600 text-white text-xs font-bold py-1 px-3 rounded-full shadow-md">
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
          <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{project.title}</CardTitle>
          <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-full">
            {getProjectIcon((project.type as string) || 'dashboard')}
          </div>
        </div>
        <CardDescription className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300">{project.description}</CardDescription>
      </CardHeader>

      {project.technologies && project.technologies.length > 0 && (
        <CardContent className="pt-0 pb-4 flex-grow">
          <div className="flex flex-wrap gap-2 mt-3">
            {project.technologies.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 rounded-full px-3 py-1 text-xs sm:text-sm font-medium shadow-sm"
              >
                {tag}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full px-3 py-1 text-xs font-medium shadow-sm">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        </CardContent>
      )}

      <CardFooter className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <Button
          variant="ghost"
          className="w-full justify-center py-3 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium"
          asChild
        >
          <Link href={projectPath as Route<string>} className="group">
            View Project
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const ProjectCard = React.memo(ProjectCardComponent);
