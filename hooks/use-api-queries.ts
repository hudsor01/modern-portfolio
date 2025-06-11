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
  ResumeData
} from '@/types/shared-api';
import { queryKeys } from '@/types/shared-api';

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
    queryKey: queryKeys.projects,
    queryFn: () => apiCall<ProjectData[]>('/api/projects'),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: queryKeys.project(id),
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
    queryKey: queryKeys.analytics,
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
      queryClient.invalidateQueries({ queryKey: queryKeys.contact });
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
    queryKey: queryKeys.resume,
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
      queryKey: queryKeys.projects,
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
    'message' in error &&
    typeof (error as { message: string }).message === 'string'
  );
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