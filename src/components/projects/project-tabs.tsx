'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProjectTabsProps } from '@/types/project'
import ReactSlickCarousel from './ReactSlickCarousel'

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

  // Convert projects to the format expected by ReactSlickCarousel
  const formattedProjects = React.useMemo(() => {
    return filteredProjects.map((project) => ({
      ...project,
      image: project.image || '',
      id: typeof project.id === 'string' ? project.id : '',
      createdAt: project.createdAt && (typeof project.createdAt === 'string' || typeof project.createdAt === 'number')
        ? new Date(project.createdAt)
        : new Date(),
      updatedAt: project.updatedAt
        ? (typeof project.updatedAt === 'string' || typeof project.updatedAt === 'number'
          ? new Date(project.updatedAt)
          : project.updatedAt instanceof Date ? project.updatedAt : undefined)
        : undefined,
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
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {filteredProjects.length > 0 ? (
            <ReactSlickCarousel projects={formattedProjects} />
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                No projects found in this category
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
