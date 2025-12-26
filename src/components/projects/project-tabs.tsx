'use client'

import React, { useState } from 'react'
import { ProjectTabsProps } from '@/types/project'
import { ProjectSwiper } from './project-swiper'
import { Button } from '@/components/ui/button'

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
          <Button
            key={category}
            variant={activeCategory === category ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setActiveCategory(category)}
            className="rounded-full"
          >
            {category}
          </Button>
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
