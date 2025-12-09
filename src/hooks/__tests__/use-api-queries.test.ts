import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import React, { ReactNode } from 'react'

// Unmock TanStack Query for this test file
vi.unmock('@tanstack/react-query')

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useProjects,
  useProject,
  useAnalytics,
  useContactMutation,
  useResumeGeneration,
  useResumeDownload,
  useGenericQuery,
  useGenericMutation,
  usePrefetchProjects,
  isApiError,
  getErrorMessage,
} from '../use-api-queries'
import { 
  createMockApiResponse, 
  createMockProject,
  createMockContactForm
} from '@/test/factories'

// Create a wrapper component for React Query using React.createElement
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })

  return ({ children }: { children: ReactNode }) => 
    React.createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useApiQueries hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn() as unknown as typeof fetch
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('useProjects', () => {
    it('should fetch projects successfully', async () => {
      const mockProjects = [createMockProject(), createMockProject({ id: '2' })]
      const mockResponse = createMockApiResponse(mockProjects)

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      } as Response)

      const wrapper = createWrapper()
      const { result } = renderHook(() => useProjects(), { wrapper })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockProjects)
      expect(global.fetch).toHaveBeenCalledWith('/api/projects', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    })

    it('should handle fetch error', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response)

      const wrapper = createWrapper()
      const { result } = renderHook(() => useProjects(), { wrapper })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      }, { timeout: 3000 })

      expect(result.current.error).toBeInstanceOf(Error)
      expect((result.current.error as Error).message).toContain('Failed to fetch projects')
    })
  })

  describe('useProject', () => {
    it('should fetch single project by id', async () => {
      const mockProject = createMockProject({ id: 'test-project' })
      const mockResponse = createMockApiResponse(mockProject)

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      } as Response)

      const wrapper = createWrapper()
      const { result } = renderHook(() => useProject('test-project'), { wrapper })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockProject)
      expect(global.fetch).toHaveBeenCalledWith('/api/projects/test-project', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    })

    it('should not fetch when id is empty', () => {
      const wrapper = createWrapper()
      const { result } = renderHook(() => useProject(''), { wrapper })

      expect(result.current.fetchStatus).toBe('idle')
      expect(global.fetch).not.toHaveBeenCalled()
    })
  })

  describe('useAnalytics', () => {
    it('should fetch analytics data', async () => {
      const mockAnalytics = { pageViews: 1000, uniqueVisitors: 500 }
      const mockResponse = createMockApiResponse(mockAnalytics)

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      } as Response)

      const wrapper = createWrapper()
      const { result } = renderHook(() => useAnalytics(), { wrapper })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockResponse)
      expect(global.fetch).toHaveBeenCalledWith('/api/analytics/vitals', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    })
  })

  describe('useContactMutation', () => {
    it('should submit contact form successfully', async () => {
      const mockFormData = createMockContactForm()
      const mockResponse = createMockApiResponse('Message sent successfully')

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      } as Response)

      const wrapper = createWrapper()
      const { result } = renderHook(() => useContactMutation(), { wrapper })

      result.current.mutate(mockFormData)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockResponse)
      expect(global.fetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockFormData),
      })
    })

    it('should handle contact form submission error', async () => {
      const mockFormData = createMockContactForm()

      // Mock all retry attempts to fail
      vi.mocked(global.fetch)
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          json: () => Promise.resolve({ error: 'Server error' }),
        } as Response)
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          json: () => Promise.resolve({ error: 'Server error' }),
        } as Response)
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          json: () => Promise.resolve({ error: 'Server error' }),
        } as Response)

      const wrapper = createWrapper()
      const { result } = renderHook(() => useContactMutation(), { wrapper })

      // Start the mutation
      result.current.mutate(mockFormData)

      // Wait for the mutation to complete with error after retries
      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      }, { timeout: 5000 })

      expect(result.current.error).toBeInstanceOf(Error)
      expect((result.current.error as Error).message).toContain('Failed to send message')
    })
  })

  describe('useResumeGeneration', () => {
    it('should generate resume successfully', async () => {
      const mockResumeData = { url: '/resume.pdf', filename: 'resume.pdf' }
      const mockResponse = createMockApiResponse(mockResumeData)

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      } as Response)

      const wrapper = createWrapper()
      const { result } = renderHook(() => useResumeGeneration(), { wrapper })

      result.current.mutate()

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockResponse)
      expect(global.fetch).toHaveBeenCalledWith('/api/generate-resume-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    })

    it('should handle resume generation error', async () => {
      // Mock all retry attempts to fail
      vi.mocked(global.fetch)
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          json: () => Promise.resolve({ error: 'Server error' }),
        } as Response)
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          json: () => Promise.resolve({ error: 'Server error' }),
        } as Response)
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          json: () => Promise.resolve({ error: 'Server error' }),
        } as Response)

      const wrapper = createWrapper()
      const { result } = renderHook(() => useResumeGeneration(), { wrapper })

      result.current.mutate()

      // Wait for the mutation to complete with error after retries
      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      }, { timeout: 5000 })

      expect(result.current.error).toBeInstanceOf(Error)
      expect((result.current.error as Error).message).toContain('Resume generation failed')
    })
  })

  describe('useResumeDownload', () => {
    it('should not fetch automatically', () => {
      const wrapper = createWrapper()
      const { result } = renderHook(() => useResumeDownload(), { wrapper })

      expect(result.current.fetchStatus).toBe('idle')
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('should fetch when refetch is called', async () => {
      const mockResumeData = { url: '/resume.pdf', filename: 'resume.pdf' }
      const mockResponse = createMockApiResponse(mockResumeData)

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      } as Response)

      const wrapper = createWrapper()
      const { result } = renderHook(() => useResumeDownload(), { wrapper })

      result.current.refetch()

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockResponse)
    })
  })

  describe('useGenericQuery', () => {
    it('should execute generic query', async () => {
      const mockData = { test: 'data' }
      const mockResponse = createMockApiResponse(mockData)
      const queryFn = vi.fn(() => Promise.resolve(mockResponse))

      const wrapper = createWrapper()
      const { result } = renderHook(
        () => useGenericQuery(['test'], queryFn),
        { wrapper }
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(queryFn).toHaveBeenCalledOnce()
      expect(result.current.data).toEqual(mockResponse)
    })

    it('should respect enabled option', () => {
      const queryFn = vi.fn()
      
      const wrapper = createWrapper()
      renderHook(
        () => useGenericQuery(['test'], queryFn, { enabled: false }),
        { wrapper }
      )

      expect(queryFn).not.toHaveBeenCalled()
    })
  })

  describe('useGenericMutation', () => {
    it('should execute generic mutation', async () => {
      const mockData = { success: true }
      const mockResponse = createMockApiResponse(mockData)
      const mutationFn = vi.fn(() => Promise.resolve(mockResponse))

      const wrapper = createWrapper()
      const { result } = renderHook(
        () => useGenericMutation(mutationFn),
        { wrapper }
      )

      result.current.mutate('test-data')

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      // TanStack Query passes variables to mutationFn
      expect(mutationFn).toHaveBeenCalled()
      // Verify first argument is the test data
      expect((mutationFn.mock.calls as unknown[][])[0]?.[0]).toBe('test-data')
      expect(result.current.data).toEqual(mockResponse)
    })

    it('should call onSuccess callback', async () => {
      const mockData = { success: true }
      const mockResponse = createMockApiResponse(mockData)
      const mutationFn = vi.fn(() => Promise.resolve(mockResponse))
      const onSuccess = vi.fn()

      const wrapper = createWrapper()
      const { result } = renderHook(
        () => useGenericMutation(mutationFn, { onSuccess }),
        { wrapper }
      )

      result.current.mutate('test-data')

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      // Verify onSuccess was called with at least the response data
      expect(onSuccess).toHaveBeenCalled()
      expect(onSuccess.mock.calls[0]?.[0]).toEqual(mockResponse)
    })
  })

  describe('usePrefetchProjects', () => {
    it('should prefetch projects', async () => {
      const mockProjects = [createMockProject()]
      const mockResponse = createMockApiResponse(mockProjects)

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      } as Response)

      const wrapper = createWrapper()
      const { result } = renderHook(() => usePrefetchProjects(), { wrapper })

      result.current.prefetchOnHover('project', 'test-slug')

      // Prefetch doesn't return data directly, but should make the API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/projects/test-slug')
      })
    })
  })

  describe('error utilities', () => {
    describe('isApiError', () => {
      it('should identify API error objects', () => {
        expect(isApiError({ message: 'Test error' })).toBe(true)
        expect(isApiError(new Error('Test error'))).toBe(true)
        expect(isApiError('string error')).toBe(false)
        expect(isApiError(null)).toBe(false)
        expect(isApiError(undefined)).toBe(false)
        expect(isApiError({})).toBe(false)
      })
    })

    describe('getErrorMessage', () => {
      it('should extract message from API error', () => {
        const apiError = { message: 'API error message' }
        expect(getErrorMessage(apiError)).toBe('API error message')
      })

      it('should extract message from Error instance', () => {
        const error = new Error('Error instance message')
        expect(getErrorMessage(error)).toBe('Error instance message')
      })

      it('should return default message for unknown errors', () => {
        expect(getErrorMessage('string error')).toBe('An unexpected error occurred')
        expect(getErrorMessage(null)).toBe('An unexpected error occurred')
        expect(getErrorMessage(undefined)).toBe('An unexpected error occurred')
        expect(getErrorMessage(123)).toBe('An unexpected error occurred')
      })
    })
  })
})