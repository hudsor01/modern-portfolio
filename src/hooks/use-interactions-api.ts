/**
 * Client-side hooks for user interaction APIs
 * Handles likes, shares, bookmarks, views, and other user interactions
 */

import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { InteractionType } from '@/types/prisma-generated'
import { ApiResponse } from '@/types/shared-api'

// Types based on API responses
interface InteractionCounts {
  likes: number
  shares: number
  bookmarks: number
  downloads: number
  comments?: number
  subscribes?: number
}

interface InteractionResponse {
  id: string
  type: InteractionType
  createdAt: string
  totalInteractions?: InteractionCounts
  postCounts?: InteractionCounts
}

interface ViewTrackingData {
  type: 'project' | 'blog'
  slug: string
  readingTime?: number
  scrollDepth?: number
  referrer?: string
}

interface ViewResponse {
  id: string
  type: string
  slug: string
  viewedAt: string
  totalViews: number
}

// API functions
async function trackProjectInteraction(
  slug: string, 
  type: 'LIKE' | 'SHARE' | 'BOOKMARK' | 'DOWNLOAD',
  value?: string,
  metadata?: Record<string, string | number | boolean>
): Promise<InteractionResponse> {
  const response = await fetch(`/api/projects/${slug}/interactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type, value, metadata }),
  })

  if (!response.ok) {
    throw new Error('Failed to record project interaction')
  }

  const data: ApiResponse<InteractionResponse> = await response.json()
  if (!data.success) {
    throw new Error(data.error || 'Failed to record interaction')
  }

  return data.data
}

async function trackBlogInteraction(
  slug: string,
  type: 'LIKE' | 'SHARE' | 'COMMENT' | 'BOOKMARK' | 'SUBSCRIBE' | 'DOWNLOAD',
  value?: string,
  metadata?: Record<string, string | number | boolean>
): Promise<InteractionResponse> {
  const response = await fetch(`/api/blog/${slug}/interactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type, value, metadata }),
  })

  if (!response.ok) {
    throw new Error('Failed to record blog interaction')
  }

  const data: ApiResponse<InteractionResponse> = await response.json()
  if (!data.success) {
    throw new Error(data.error || 'Failed to record interaction')
  }

  return data.data
}

async function getProjectInteractions(slug: string): Promise<{ totalInteractions: Record<string, number> }> {
  const response = await fetch(`/api/projects/${slug}/interactions`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch project interactions')
  }

  const data: ApiResponse<{ totalInteractions: Record<string, number> }> = await response.json()
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch interactions')
  }

  return data.data
}

async function getBlogInteractions(slug: string): Promise<{ postCounts: Record<string, number> }> {
  const response = await fetch(`/api/blog/${slug}/interactions`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch blog interactions')
  }

  const data: ApiResponse<{ postCounts: Record<string, number> }> = await response.json()
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch interactions')
  }

  return data.data
}

async function trackView(viewData: ViewTrackingData): Promise<ViewResponse> {
  const response = await fetch('/api/analytics/views', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(viewData),
  })

  if (!response.ok) {
    throw new Error('Failed to track view')
  }

  const data: ApiResponse<ViewResponse> = await response.json()
  if (!data.success) {
    throw new Error(data.error || 'Failed to track view')
  }

  return data.data
}

async function getViews(type?: 'project' | 'blog', slug?: string): Promise<{ views: Array<{ slug: string; type: string; totalViews: number }> }> {
  const params = new URLSearchParams()
  if (type) params.append('type', type)
  if (slug) params.append('slug', slug)

  const response = await fetch(`/api/analytics/views?${params.toString()}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch views')
  }

  const data: ApiResponse<{ views: Array<{ slug: string; type: string; totalViews: number }> }> = await response.json()
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch views')
  }

  return data.data
}

// React Query hooks
export function useProjectInteraction(slug: string) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ type, value, metadata }: {
      type: 'LIKE' | 'SHARE' | 'BOOKMARK' | 'DOWNLOAD'
      value?: string
      metadata?: Record<string, string | number | boolean>
    }) => trackProjectInteraction(slug, type, value, metadata),
    onSuccess: () => {
      // Invalidate and refetch interactions
      queryClient.invalidateQueries({ queryKey: ['project-interactions', slug] })
      queryClient.invalidateQueries({ queryKey: ['views'] })
    },
  })

  return mutation
}

export function useBlogInteraction(slug: string) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ type, value, metadata }: {
      type: 'LIKE' | 'SHARE' | 'COMMENT' | 'BOOKMARK' | 'SUBSCRIBE' | 'DOWNLOAD'
      value?: string
      metadata?: Record<string, string | number | boolean>
    }) => trackBlogInteraction(slug, type, value, metadata),
    onSuccess: () => {
      // Invalidate and refetch interactions
      queryClient.invalidateQueries({ queryKey: ['blog-interactions', slug] })
      queryClient.invalidateQueries({ queryKey: ['views'] })
    },
  })

  return mutation
}

export function useProjectInteractions(slug: string): UseQueryResult<{ totalInteractions: Record<string, number> }, Error> {
  return useQuery({
    queryKey: ['project-interactions', slug],
    queryFn: () => getProjectInteractions(slug),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useBlogInteractions(slug: string): UseQueryResult<{ postCounts: Record<string, number> }, Error> {
  return useQuery({
    queryKey: ['blog-interactions', slug],
    queryFn: () => getBlogInteractions(slug),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useViewTracking() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: trackView,
    onSuccess: () => {
      // Invalidate views queries
      queryClient.invalidateQueries({ queryKey: ['views'] })
    },
  })

  return mutation
}

export function useViews(type?: 'project' | 'blog', slug?: string): UseQueryResult<{ views: Array<{ slug: string; type: string; totalViews: number }> }, Error> {
  return useQuery({
    queryKey: ['views', type, slug],
    queryFn: () => getViews(type, slug),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Convenience hooks for specific interactions
export function useLikeProject(slug: string) {
  const interaction = useProjectInteraction(slug)
  
  return {
    like: () => interaction.mutate({ type: 'LIKE' }),
    isLiking: interaction.isPending,
    error: interaction.error,
  }
}

export function useShareProject(slug: string) {
  const interaction = useProjectInteraction(slug)
  
  return {
    share: (platform?: string) => interaction.mutate({ 
      type: 'SHARE', 
      value: platform,
      metadata: { timestamp: new Date().toISOString() }
    }),
    isSharing: interaction.isPending,
    error: interaction.error,
  }
}

export function useBookmarkProject(slug: string) {
  const interaction = useProjectInteraction(slug)
  
  return {
    bookmark: () => interaction.mutate({ type: 'BOOKMARK' }),
    isBookmarking: interaction.isPending,
    error: interaction.error,
  }
}

export function useLikeBlogPost(slug: string) {
  const interaction = useBlogInteraction(slug)
  
  return {
    like: () => interaction.mutate({ type: 'LIKE' }),
    isLiking: interaction.isPending,
    error: interaction.error,
  }
}

export function useShareBlogPost(slug: string) {
  const interaction = useBlogInteraction(slug)
  
  return {
    share: (platform?: string) => interaction.mutate({ 
      type: 'SHARE', 
      value: platform,
      metadata: { timestamp: new Date().toISOString() }
    }),
    isSharing: interaction.isPending,
    error: interaction.error,
  }
}