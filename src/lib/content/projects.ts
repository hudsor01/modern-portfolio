import { cache } from 'react'
import type { Project } from '@/types/project'
import { ProjectDataManager } from '@/lib/server/project-data-manager'

// Re-export the Project type for components to use
export type { Project }

// Cache the getProjects function for the duration of the request
export const getProjects = cache(async (): Promise<Project[]> => {
  return await ProjectDataManager.getProjects()
})

export const getProject = cache(async (slug: string): Promise<Project | null> => {
  return await ProjectDataManager.getProjectBySlug(slug)
})

export const getFeaturedProjects = cache(async (): Promise<Project[]> => {
  const allProjects = await getProjects()
  return allProjects.filter(p => p.featured)
})

export const getProjectsByCategory = cache(async (category: string): Promise<Project[]> => {
  const allProjects = await getProjects()
  return allProjects.filter(p => p.category === category)
})

export const getCategories = cache(async (): Promise<string[]> => {
  const allProjects = await getProjects()
  const categories = new Set(allProjects.map(p => p.category).filter(Boolean) as string[])
  return Array.from(categories)
})