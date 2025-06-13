'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { ProjectGrid } from './project-grid'
import type { Project } from '@/types/project'

interface ProjectFiltersEnhancedProps {
  projects: Project[];
  onProjectHover?: (slug: string) => void;
  isLoading?: boolean;
}

interface CategoryFilter { // Define a type for the category filters
  category: string;
  count: number;
}

export function ProjectFiltersEnhanced({ projects, onProjectHover }: ProjectFiltersEnhancedProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const projectCategories: CategoryFilter[] = useMemo(() => { // Added type here
    if (!projects || projects.length === 0) return [];
    const categories = projects.reduce((acc, project) => {
      const category = project.category || 'uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(categories).map(([category, count]) => ({ category, count }));
  }, [projects]);

  const totalProjectsCount = projects?.length || 0;

  const filteredProjects = useMemo(() => {
    if (!isMounted) return projects;
    if (selectedFilter === 'all') return projects;
    return projects.filter((project) => project.category === selectedFilter);
  }, [projects, selectedFilter, isMounted]);

  // DEBUG: Log what 'projects' looks like on initial renders
  // console.log('[ProjectFiltersEnhanced] Rendering - isMounted:', isMounted, 'Projects count:', projects?.length);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-wrap gap-3 mb-10 justify-center items-center">
        <Button
          variant={isMounted && selectedFilter === 'all' ? 'default' : 'outline'}
          onClick={() => isMounted && setSelectedFilter('all')}
          className="text-sm px-4 py-2 h-auto"
        >
          All ({totalProjectsCount})
        </Button>
        {projectCategories.map(({ category, count }: CategoryFilter) => ( // Added type for destructured props
          <Button
            key={category}
            variant={isMounted && selectedFilter === category ? 'default' : 'outline'}
            onClick={() => isMounted && setSelectedFilter(category)}
            className="text-sm px-4 py-2 h-auto"
          >
            {category} ({count})
          </Button>
        ))}
      </div>
      <ProjectGrid projects={filteredProjects} onProjectHover={onProjectHover} />
    </div>
  )
}
