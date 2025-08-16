/**
 * Client-side hook for project data API calls
 * Replaces direct ProjectDataManager usage with proper API calls
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Project, ProjectsResponse } from '@/types/project'

// API utility functions
async function fetchProjects(): Promise<Project[]> {
  const response = await fetch('/api/projects/data')
  if (!response.ok) {
    throw new Error('Failed to fetch projects')
  }
  const data = await response.json()
  return data.projects
}

async function fetchProjectsWithFilters(): Promise<ProjectsResponse> {
  const response = await fetch('/api/projects/data?withFilters=true')
  if (!response.ok) {
    throw new Error('Failed to fetch projects with filters')
  }
  return response.json()
}

async function fetchFeaturedProjects(): Promise<Project[]> {
  const response = await fetch('/api/projects/data?featured=true')
  if (!response.ok) {
    throw new Error('Failed to fetch featured projects')
  }
  const data = await response.json()
  return data.projects
}

async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  const response = await fetch(`/api/projects/${slug}`)
  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    throw new Error('Failed to fetch project')
  }
  const data = await response.json()
  return data.project
}

async function searchProjects(query: string): Promise<Project[]> {
  const response = await fetch(`/api/projects/data?search=${encodeURIComponent(query)}`)
  if (!response.ok) {
    throw new Error('Failed to search projects')
  }
  const data = await response.json()
  return data.projects
}

async function fetchProjectsByCategory(category: string): Promise<Project[]> {
  const response = await fetch(`/api/projects/data?category=${encodeURIComponent(category)}`)
  if (!response.ok) {
    throw new Error('Failed to fetch projects by category')
  }
  const data = await response.json()
  return data.projects
}

async function fetchProjectStats(): Promise<{
  total: number
  featured: number
  categories: Record<string, number>
  technologies: Record<string, number>
}> {
  const response = await fetch('/api/projects/stats')
  if (!response.ok) {
    throw new Error('Failed to fetch project stats')
  }
  return response.json()
}

// React Query hooks
export function useProjects(): UseQueryResult<Project[], Error> {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useProjectsWithFilters(): UseQueryResult<ProjectsResponse, Error> {
  return useQuery({
    queryKey: ['projects', 'with-filters'],
    queryFn: fetchProjectsWithFilters,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useFeaturedProjects(): UseQueryResult<Project[], Error> {
  return useQuery({
    queryKey: ['projects', 'featured'],
    queryFn: fetchFeaturedProjects,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  })
}

export function useProject(slug: string): UseQueryResult<Project | null, Error> {
  return useQuery({
    queryKey: ['projects', 'by-slug', slug],
    queryFn: () => fetchProjectBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

export function useProjectSearch(query: string): UseQueryResult<Project[], Error> {
  return useQuery({
    queryKey: ['projects', 'search', query],
    queryFn: () => searchProjects(query),
    enabled: !!query && query.length > 2, // Only search if query is meaningful
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    gcTime: 5 * 60 * 1000,
  })
}

export function useProjectsByCategory(category: string): UseQueryResult<Project[], Error> {
  return useQuery({
    queryKey: ['projects', 'by-category', category],
    queryFn: () => fetchProjectsByCategory(category),
    enabled: !!category,
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

export function useProjectStats(): UseQueryResult<{
  total: number
  featured: number
  categories: Record<string, number>
  technologies: Record<string, number>
}, Error> {
  return useQuery({
    queryKey: ['projects', 'stats'],
    queryFn: fetchProjectStats,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  })
}

// Legacy compatibility - direct API calls (use hooks above instead)
export const projectsApi = {
  getProjects: fetchProjects,
  getProjectsWithFilters: fetchProjectsWithFilters,
  getFeaturedProjects: fetchFeaturedProjects,
  getProjectBySlug: fetchProjectBySlug,
  searchProjects,
  getProjectsByCategory: fetchProjectsByCategory,
  getProjectStats: fetchProjectStats,
}