'use client';

import { useState, useCallback, useEffect } from 'react';
import { Project } from '@/lib/data/projects';
import { ProjectGrid } from '@/app/(main-content)/projects/project-grid';
import { Button } from '@/components/ui/button';
import ClientSideOnly from '@/components/client-side-only';

interface ProjectFiltersEnhancedProps {
  projects: Project[];
}

export function ProjectFiltersEnhanced({ projects }: ProjectFiltersEnhancedProps) {
  // Get all unique technologies from projects and clean any quotes
  const cleanTechnologies = projects.flatMap((p) => {
    return (p.technologies || []).map(tech => tech.replace(/^['"]|['"]$/g, ''));
  });
  const allTechnologies = ['All', ...new Set(cleanTechnologies)];

  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);

  const handleFilterChange = useCallback(
    (filter: string) => {
      setSelectedFilter(filter);

      if (filter === 'All') {
        setFilteredProjects(projects);
      } else {
        setFilteredProjects(projects.filter((project) => {
          // Compare without quotes to ensure proper matching
          return project.technologies?.some(tech => {
            const cleanTech = tech.replace(/^['"]|['"]$/g, '');
            return cleanTech === filter;
          });
        }));
      }
    },
    [projects]
  );

  // Initialize with all projects
  useEffect(() => {
    setFilteredProjects(projects);
  }, [projects]);

  return (
    <ClientSideOnly
      fallback={
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-300 mb-6">Loading projects...</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-72 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <div className="container mx-auto max-w-7xl px-4">
      {/* Filter Pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-10 py-6 px-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl shadow-sm">
        {allTechnologies.map((tech) => (
          <button
            key={tech}
            onClick={() => handleFilterChange(tech)}
            className={`px-5 py-4 rounded-full text-sm md:text-base font-medium transition-colors ${
              selectedFilter === tech
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {tech}
          </button>
        ))}
      </div>

      {/* Project Grid */}
      {filteredProjects.length > 0 ? (
        <div>
          <ProjectGrid projects={filteredProjects} />
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
            No projects found with the selected technology.
          </h3>
          <Button
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => handleFilterChange('All')}
          >
            Show All Projects
          </Button>
        </div>
      )}
      </div>
    </ClientSideOnly>
  );
}
