'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import type { ProjectTabsProps } from '@/types/project'
import { Skeleton } from '@/components/ui/skeleton'

function SwiperSkeleton() {
  return (
    <div className="w-full animate-pulse" style={{ height: 400 }}>
      <Skeleton className="w-full h-full rounded-xl bg-white/5" />
    </div>
  )
}

const ProjectSwiper = dynamic(
  () => import('./project-swiper').then((m) => ({ default: m.ProjectSwiper })),
  {
    ssr: false,
    loading: () => <SwiperSkeleton />,
  }
)

export function ProjectTabs({ projects }: ProjectTabsProps) {
  // Extract unique categories from projects
  const allCategories = (() => {
    const categories = new Set<string>()
    projects.forEach((project) => {
      project.tags?.forEach((tag) => {
        categories.add(tag)
      })
    })
    return ['All', ...Array.from(categories)]
  })()

  const [activeCategory, setActiveCategory] = useState('All')

  // Filter projects by category
  const filteredProjects = (() => {
    if (activeCategory === 'All') return projects
    return projects.filter((project) => project.tags?.includes(activeCategory))
  })()

  // Ensure projects have required fields for ProjectSwiper
  const formattedProjects = filteredProjects.map((project) => ({
    ...project,
    image: project.image || '',
    id: project.id || '',
    slug: project.slug || '',
    featured: project.featured ?? false,
    category: project.category || '',
  }))

  return (
    <div className="space-y-8">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {allCategories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ease-out
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
            <p className="typography-lead">No projects found in this category</p>
          </div>
        )}
      </div>
    </div>
  )
}
