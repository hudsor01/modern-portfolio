'use client'

import React, { useState } from 'react'
import { ProjectTabsProps } from '@/types/project'
import { ProjectSwiper } from './project-swiper'

export function ProjectTabs({ projects }: ProjectTabsProps) {
  // Extract unique categories from projects
  const allCategories = React.useMemo(() => {
    const categories = new Set<string>()
    projects.forEach((project) => {
      project.technologies?.forEach((tag) => categories.add(tag))
    })
    return ['All', ...Array.from(categories)]
  }, [projects])

  const [activeCategory, setActiveCategory] = useState('All')

  // Filter projects by category
  const filteredProjects = React.useMemo(() => {
    if (activeCategory === 'All') return projects
    return projects.filter((project) => project.technologies?.includes(activeCategory))
  }, [projects, activeCategory])

  // Ensure projects have required fields for ProjectSwiper
  const formattedProjects = React.useMemo(() => {
    return filteredProjects.map((project) => ({
      ...project,
      image: project.image || '',
      id: project.id || '',
      slug: project.slug || '',
      featured: project.featured ?? false,
      category: project.category || '',
    }))
  }, [filteredProjects])

  return (
    <div className="space-y-8">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {allCategories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${
                activeCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Projects display */}
      <div key={activeCategory} className="animate-fade-in-up">
        {filteredProjects.length > 0 ? (
          <ProjectSwiper projects={formattedProjects} showViewAll={false} />
        ) : (
          <div className="text-center py-16">
            <p className="typography-lead">
              No projects found in this category
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
