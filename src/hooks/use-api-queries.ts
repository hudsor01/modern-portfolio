/**
 * Type-safe React Query hooks for API communication
 * Part of the comprehensive type architecture strategy
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { 
  ApiResponse, 
  ProjectData, 
  AnalyticsData, 
  ContactFormData,
  ContactResponse,
  ResumeData,
  BlogPostData,
  BlogCategoryData,
  BlogTagData,
  BlogPostFilters,
  BlogPostSort
} from '@/types/shared-api';
import { projectKeys, analyticsKeys, contactKeys, resumeKeys, blogKeys } from '@/lib/queryKeys';
import { 
  fetchBlogPosts, 
  fetchBlogPost, 
  createBlogPost, 
  updateBlogPost, 
  deleteBlogPost,
  fetchBlogCategories,
  createBlogCategory,
  fetchBlogTags,
  createBlogTag,
  fetchBlogAnalytics,
  fetchRSSFeed
} from '@/lib/api';

// Base API client function with proper typing
async function apiCall<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const response = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<ApiResponse<T>>;
}

/**
 * Projects API Hooks
 */
export function useProjects() {
  return useQuery({
    queryKey: projectKeys.all(),
    queryFn: () => apiCall<ProjectData[]>('/api/projects'),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => apiCall<ProjectData>(`/api/projects/${id}`),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}

/**
 * Analytics API Hooks
 */
export function useAnalytics() {
  return useQuery({
    queryKey: analyticsKeys.all(),
    queryFn: () => apiCall<AnalyticsData>('/api/analytics/vitals'),
    staleTime: 1000 * 60 * 2, // 2 minutes for fresh analytics
    gcTime: 1000 * 60 * 10,
  });
}

/**
 * Contact Form API Hooks
 */
export function useContactMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ContactFormData) => 
      apiCall<ContactResponse>('/api/contact', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      // Invalidate and refetch any contact-related queries
      queryClient.invalidateQueries({ queryKey: contactKeys.all() });
    },
    onError: (error) => {
      console.error('Contact form submission failed:', error);
    },
  });
}

/**
 * Resume API Hooks
 */
export function useResumeGeneration() {
  return useMutation({
    mutationFn: () => apiCall<ResumeData>('/api/generate-resume-pdf', {
      method: 'POST',
    }),
    onError: (error) => {
      console.error('Resume generation failed:', error);
    },
  });
}

export function useResumeDownload() {
  return useQuery({
    queryKey: resumeKeys.pdf(),
    queryFn: () => apiCall<ResumeData>('/api/pdf'),
    enabled: false, // Only fetch when explicitly called
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Generic hooks for common patterns
 */

// Generic mutation hook with proper typing
export function useGenericMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options?: {
    onSuccess?: (data: ApiResponse<TData>) => void;
    onError?: (error: Error) => void;
    invalidateKeys?: readonly (readonly unknown[])[];
  }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      // Invalidate specified query keys
      if (options?.invalidateKeys) {
        options.invalidateKeys.forEach(key => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

// Generic query hook with proper typing
export function useGenericQuery<T>(
  key: readonly unknown[],
  queryFn: () => Promise<ApiResponse<T>>,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
  }
) {
  return useQuery({
    queryKey: key,
    queryFn,
    enabled: options?.enabled,
    staleTime: options?.staleTime ?? 1000 * 60 * 5,
    gcTime: options?.gcTime ?? 1000 * 60 * 30,
  });
}

/**
 * Query client helpers
 */
export function usePrefetchProjects() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: projectKeys.all(),
      queryFn: () => apiCall<ProjectData[]>('/api/projects'),
      staleTime: 1000 * 60 * 5,
    });
  };
}

export function useInvalidateQuery() {
  const queryClient = useQueryClient();

  return (key: readonly unknown[]) => {
    queryClient.invalidateQueries({ queryKey: key });
  };
}

// Error handling helper
export function isApiError(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    !(error instanceof Error) &&
    'message' in error &&
    typeof (error as { message: string }).message === 'string'
  );
}

/**
 * Blog Posts API Hooks
 */
export function useBlogPosts(params?: {
  filters?: BlogPostFilters;
  sort?: BlogPostSort;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: blogKeys.postsList(params?.filters, params?.sort),
    queryFn: () => fetchBlogPosts(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: blogKeys.post(slug),
    queryFn: () => fetchBlogPost(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10, // 10 minutes - blog posts don't change frequently
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postData: Partial<BlogPostData>) => createBlogPost(postData),
    onSuccess: () => {
      // Invalidate all blog posts lists
      queryClient.invalidateQueries({ queryKey: blogKeys.posts() });
      queryClient.invalidateQueries({ queryKey: blogKeys.analytics() });
    },
    onError: (error) => {
      console.error('Blog post creation failed:', error);
    },
  });
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, postData }: { slug: string; postData: Partial<BlogPostData> }) =>
      updateBlogPost(slug, postData),
    onSuccess: (_, { slug }) => {
      // Invalidate the specific post and all lists
      queryClient.invalidateQueries({ queryKey: blogKeys.post(slug) });
      queryClient.invalidateQueries({ queryKey: blogKeys.posts() });
      queryClient.invalidateQueries({ queryKey: blogKeys.analytics() });
    },
    onError: (error) => {
      console.error('Blog post update failed:', error);
    },
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => deleteBlogPost(slug),
    onSuccess: () => {
      // Invalidate all blog-related queries
      queryClient.invalidateQueries({ queryKey: blogKeys.posts() });
      queryClient.invalidateQueries({ queryKey: blogKeys.analytics() });
    },
    onError: (error) => {
      console.error('Blog post deletion failed:', error);
    },
  });
}

/**
 * Blog Categories API Hooks
 */
export function useBlogCategories() {
  return useQuery({
    queryKey: blogKeys.categories(),
    queryFn: () => fetchBlogCategories(),
    staleTime: 1000 * 60 * 15, // 15 minutes - categories don't change often
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useCreateBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryData: Partial<BlogCategoryData>) => createBlogCategory(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.categories() });
    },
    onError: (error) => {
      console.error('Blog category creation failed:', error);
    },
  });
}

/**
 * Blog Tags API Hooks
 */
export function useBlogTags(params?: {
  search?: string;
  popular?: boolean;
  limit?: number;
}) {
  return useQuery({
    queryKey: [...blogKeys.tags(), params],
    queryFn: () => fetchBlogTags(params),
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useCreateBlogTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tagData: Partial<BlogTagData>) => createBlogTag(tagData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.tags() });
    },
    onError: (error) => {
      console.error('Blog tag creation failed:', error);
    },
  });
}

/**
 * Blog Analytics API Hooks
 */
export function useBlogAnalytics(params?: {
  timeRange?: '7d' | '30d' | '90d' | '1y';
  details?: boolean;
}) {
  return useQuery({
    queryKey: [...blogKeys.analytics(), params],
    queryFn: () => fetchBlogAnalytics(params),
    staleTime: 1000 * 60 * 5, // 5 minutes - analytics should be relatively fresh
    gcTime: 1000 * 60 * 20, // 20 minutes
  });
}

/**
 * RSS Feed API Hooks
 */
export function useRSSFeed(params?: {
  format?: 'json' | 'xml';
  limit?: number;
}) {
  return useQuery({
    queryKey: [...blogKeys.rss(), params],
    queryFn: () => fetchRSSFeed(params),
    staleTime: 1000 * 60 * 30, // 30 minutes - RSS doesn't need to be super fresh
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
    enabled: false, // Only fetch when explicitly requested
  });
}

/**
 * Blog-specific prefetch hooks
 */
export function usePrefetchBlogPosts() {
  const queryClient = useQueryClient();

  return (params?: {
    filters?: BlogPostFilters;
    sort?: BlogPostSort;
    page?: number;
    limit?: number;
  }) => {
    queryClient.prefetchQuery({
      queryKey: blogKeys.postsList(params?.filters, params?.sort),
      queryFn: () => fetchBlogPosts(params),
      staleTime: 1000 * 60 * 5,
    });
  };
}

export function usePrefetchBlogPost() {
  const queryClient = useQueryClient();

  return (slug: string) => {
    queryClient.prefetchQuery({
      queryKey: blogKeys.post(slug),
      queryFn: () => fetchBlogPost(slug),
      staleTime: 1000 * 60 * 10,
    });
  };
}

// Type-safe error message extractor
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}