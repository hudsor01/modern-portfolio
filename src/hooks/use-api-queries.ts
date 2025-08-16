/**
 * CLEAN API Query Hooks
 * Direct TanStack Query implementation with proper types
 * No duplication - clean, focused implementations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ProjectData, ContactFormData, ContactResponse, AnalyticsData, ResumeData, BlogPostData, BlogCategoryData, BlogTagData } from '@/types/shared-api'

// Projects
export function useProjects(_options?: {
  prefetchRelated?: boolean
  suspense?: boolean
}) {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async (): Promise<ProjectData[]> => {
      const response = await fetch('/api/projects', {
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) throw new Error('Failed to fetch projects')
      const result = await response.json()
      // API returns { success: boolean, data: projects[] }
      return result.data || []
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

export function useProject(id: string, _options?: {
  prefetchAnalytics?: boolean
  prefetchRelated?: boolean
}) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async (): Promise<ProjectData> => {
      const response = await fetch(`/api/projects/${id}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) throw new Error('Failed to fetch project')
      const result = await response.json()
      // API returns { success: boolean, data: project }
      return result.data || result
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

// Analytics
export function useAnalytics(type?: string) {
  const endpoint = type ? `/api/analytics/${type}/realtime` : '/api/analytics/vitals'
  
  return useQuery({
    queryKey: ['analytics', type || 'vitals'],
    queryFn: async (): Promise<AnalyticsData> => {
      const response = await fetch(endpoint, {
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) throw new Error('Failed to fetch analytics')
      return response.json()
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000,
  })
}

// Contact Form
export function useContactMutation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: ContactFormData): Promise<ContactResponse> => {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to send message')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] })
    },
    retry: 2,
  })
}

// Resume
export function useResumeGeneration() {
  return useMutation({
    mutationFn: async (): Promise<ResumeData> => {
      const response = await fetch('/api/generate-resume-pdf', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) throw new Error('Resume generation failed')
      return response.json()
    },
    retry: 2,
  })
}

export function useResumeDownload() {
  return useQuery({
    queryKey: ['resume', 'pdf'],
    queryFn: async (): Promise<ResumeData> => {
      const response = await fetch('/api/pdf')
      if (!response.ok) throw new Error('Resume download failed')
      return response.json()
    },
    enabled: false, // Only fetch when explicitly called
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  })
}

// Blog
export function useBlogPosts() {
  return useQuery({
    queryKey: ['blog', 'posts'],
    queryFn: async (): Promise<BlogPostData[]> => {
      const response = await fetch('/api/blog?page=1&limit=10&sort=newest')
      if (!response.ok) throw new Error('Failed to fetch blog posts')
      return response.json()
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ['blog', 'post', slug],
    queryFn: async (): Promise<BlogPostData> => {
      const response = await fetch(`/api/blog/${slug}`)
      if (!response.ok) throw new Error('Failed to fetch blog post')
      return response.json()
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export function useBlogCategories() {
  return useQuery({
    queryKey: ['blog', 'categories'],
    queryFn: async (): Promise<BlogCategoryData[]> => {
      const response = await fetch('/api/blog/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      return response.json()
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  })
}

export function useBlogTags() {
  return useQuery({
    queryKey: ['blog', 'tags'],
    queryFn: async (): Promise<BlogTagData[]> => {
      const response = await fetch('/api/blog/tags')
      if (!response.ok) throw new Error('Failed to fetch tags')
      return response.json()
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  })
}

// Generic utilities
export function useGenericQuery<T>(
  key: readonly unknown[],
  queryFn: () => Promise<T>,
  options?: {
    enabled?: boolean
    staleTime?: number
    gcTime?: number
  }
) {
  return useQuery({
    queryKey: key,
    queryFn,
    enabled: options?.enabled,
    staleTime: options?.staleTime || 5 * 60 * 1000,
    gcTime: options?.gcTime || 30 * 60 * 1000,
  })
}

export function useGenericMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData) => void
    onError?: (error: Error) => void
    invalidateKeys?: readonly (readonly unknown[])[]
  }
) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      options?.invalidateKeys?.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key })
      })
      options?.onSuccess?.(data)
    },
    onError: options?.onError,
    retry: 2,
  })
}

// Prefetch utilities
export function usePrefetchProjects() {
  const queryClient = useQueryClient()
  
  return {
    prefetchOnHover: (type: 'project' | 'blog', slug: string) => {
      if (type === 'project') {
        queryClient.prefetchQuery({
          queryKey: ['project', slug],
          queryFn: () => fetch(`/api/projects/${slug}`).then(res => res.json()),
          staleTime: 5 * 60 * 1000,
        })
      }
    },
    prefetchOnVisible: (urls: string[]) => {
      urls.forEach(url => {
        queryClient.prefetchQuery({
          queryKey: ['generic', url],
          queryFn: () => fetch(url).then(res => res.json()),
          staleTime: 5 * 60 * 1000,
        })
      })
    },
    prefetchNextPage: (currentPage: number, totalPages: number) => {
      if (currentPage < totalPages) {
        queryClient.prefetchQuery({
          queryKey: ['projects', 'page', currentPage + 1],
          queryFn: () => fetch(`/api/projects?page=${currentPage + 1}`).then(res => res.json()),
          staleTime: 5 * 60 * 1000,
        })
      }
    },
  }
}

// Error handling
export function isApiError(error: unknown): error is { message: string; status?: number; code?: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: string }).message === 'string'
  )
}

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}