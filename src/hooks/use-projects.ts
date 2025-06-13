import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchProjects, fetchFeaturedProjects, fetchProjectById } from '@/lib/api'
import type { Project } from '@/types/project'
import { projectKeys, type ProjectFilters } from '@/lib/queryKeys'
import { CACHE_TIMES } from '@/lib/query-config'

/**
 * Hook for fetching all projects with optional filtering
 */
export function useProjects(filters?: ProjectFilters) {
  return useQuery<Project[]>({
    queryKey: projectKeys.list(filters),
    queryFn: () => fetchProjects(filters),
    staleTime: CACHE_TIMES.DYNAMIC_CONTENT.staleTime,
    gcTime: CACHE_TIMES.DYNAMIC_CONTENT.gcTime,
  })
}

/**
 * Hook for fetching featured projects only
 */
export function useFeaturedProjects() {
  return useQuery<Project[]>({
    queryKey: projectKeys.featured(),
    queryFn: fetchFeaturedProjects,
    staleTime: CACHE_TIMES.STATIC_CONTENT.staleTime,
    gcTime: CACHE_TIMES.STATIC_CONTENT.gcTime,
  })
}

/**
 * Hook for fetching a single project by slug
 */
export function useProject(slug: string) {
  return useQuery<Project>({
    queryKey: projectKeys.detail(slug),
    queryFn: () => fetchProjectById(slug),
    enabled: !!slug,
    staleTime: CACHE_TIMES.STATIC_CONTENT.staleTime,
    gcTime: CACHE_TIMES.STATIC_CONTENT.gcTime,
  })
}

/**
 * Hook for prefetching a project (for hover/link prefetching)
 */
export function usePrefetchProject() {
  const queryClient = useQueryClient()
  
  return {
    prefetchProject: (slug: string) => {
      queryClient.prefetchQuery({
        queryKey: projectKeys.detail(slug),
        queryFn: () => fetchProjectById(slug),
        staleTime: CACHE_TIMES.PREFETCH_CONTENT.staleTime,
        gcTime: CACHE_TIMES.PREFETCH_CONTENT.gcTime,
      })
    }
  }
}
