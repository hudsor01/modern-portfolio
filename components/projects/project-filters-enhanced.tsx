'use client'

import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ProjectGrid } from './project-grid'
import type { Project } from '@/types/project' // Changed import path

// Filter type removed - not needed

interface ProjectFiltersEnhancedProps {
  projects: Project[];
  onProjectHover?: (slug: string) => void;
  isLoading?: boolean;
}

export function ProjectFiltersEnhanced({ projects, onProjectHover }: ProjectFiltersEnhancedProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);

  // Generate filters from projects
  const filters = useMemo(() => {
    const categories = projects.reduce((acc, project) => {
      const category = project.category || 'uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categories).map(([category, count]) => ({
      category,
      count,
    }));
  }, [projects]);

  // Update filtered projects when filter changes
  useEffect(() => {
    if (selectedFilter === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter((project) => project.category === selectedFilter)
      );
    }
  }, [selectedFilter, projects]);

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        <Button
          variant={selectedFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('all')}
          className="text-sm"
        >
          All ({projects.length})
        </Button>

        {filters.map(({ category, count }) => (
          <Button
            key={category}
            variant={selectedFilter === category ? 'default' : 'outline'}
            onClick={() => setSelectedFilter(category)}
            className="text-sm"
          >
            {category} ({count})
          </Button>
        ))}
      </div>

      <ProjectGrid projects={filteredProjects} onProjectHover={onProjectHover} />
    </div>
  )
}
