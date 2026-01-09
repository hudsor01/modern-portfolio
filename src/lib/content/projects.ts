import { cache } from 'react'
import type { Project } from '@/types/project'
import { showcaseProjects } from '@/data/projects'

// Map ShowcaseProject to Project type
function mapToProject(showcase: (typeof showcaseProjects)[number]): Project {
  return {
    id: showcase.id,
    slug: showcase.slug,
    title: showcase.title,
    description: showcase.description,
    longDescription: showcase.longDescription,
    content: null,
    image: showcase.image,
    link: null,
    github: null,
    category: showcase.category,
    tags: showcase.technologies,
    featured: showcase.featured,
    client: showcase.client,
    role: null,
    duration: showcase.duration,
    year: showcase.year,
    impact: showcase.impact,
    results: showcase.results,
    caseStudyUrl: showcase.caseStudyUrl,
    metrics: null,
    testimonial: null,
    gallery: null,
    details: null,
    charts: null,
    viewCount: 0,
    clickCount: 0,
    createdAt: new Date(showcase.year, 0, 1), // Default to January 1st of the project year
    updatedAt: new Date(showcase.year, 0, 1), // Default to January 1st of the project year
    displayMetrics: showcase.displayMetrics.map((m) => ({
      label: m.label,
      value: m.value,
      iconName:
        m.icon.name
          ?.toLowerCase()
          .replace(/([A-Z])/g, '-$1')
          .slice(1) || 'circle',
    })),
  }
}

// Get all projects
export const getProjects = cache(async (): Promise<Project[]> => {
  return showcaseProjects.map(mapToProject)
})

export const getProject = cache(async (slug: string): Promise<Project | null> => {
  const project = showcaseProjects.find((p) => p.slug === slug)
  return project ? mapToProject(project) : null
})

export const getFeaturedProjects = cache(async (): Promise<Project[]> => {
  return showcaseProjects.filter((p) => p.featured).map(mapToProject)
})

export const getProjectsByCategory = cache(async (category: string): Promise<Project[]> => {
  return showcaseProjects.filter((p) => p.category === category).map(mapToProject)
})

export const getCategories = cache(async (): Promise<string[]> => {
  const categories = new Set(showcaseProjects.map((p) => p.category))
  return Array.from(categories)
})
