// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'

vi.mock('@/lib/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
  },
}))

const { getAllMock } = vi.hoisted(() => ({ getAllMock: vi.fn() }))
vi.mock('@/lib/data-service/service', () => ({
  analyticsDataService: {
    getAllAnalyticsData: getAllMock,
  },
}))

import { useAnalyticsData } from '@/hooks/use-analytics-data'

const sampleBundle = {
  churn: [],
  leadAttribution: [],
  leadTrends: [],
  growth: [],
  yearOverYear: [],
  topPartners: [],
}

beforeEach(() => {
  getAllMock.mockReset()
})

describe('useAnalyticsData', () => {
  it('starts in loading state', () => {
    getAllMock.mockReturnValue(new Promise(() => {})) // never resolves
    const { result } = renderHook(() => useAnalyticsData())
    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeNull()
  })

  it('exposes data on success and clears loading flag', async () => {
    getAllMock.mockResolvedValue(sampleBundle)
    const { result } = renderHook(() => useAnalyticsData())
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current.data).toEqual(sampleBundle)
    expect(result.current.error).toBeNull()
  })

  it('exposes an error when service throws', async () => {
    getAllMock.mockRejectedValue(new Error('service down'))
    const { result } = renderHook(() => useAnalyticsData())
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current.error).toBeInstanceOf(Error)
  })

  it('refresh() re-invokes the service', async () => {
    getAllMock.mockResolvedValue(sampleBundle)
    const { result } = renderHook(() => useAnalyticsData())
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(getAllMock).toHaveBeenCalledTimes(1)

    await act(async () => {
      await result.current.refresh()
    })
    expect(getAllMock).toHaveBeenCalledTimes(2)
  })

  it('does NOT loop on every render — fetchData identity is stable (useCallback fix)', async () => {
    getAllMock.mockResolvedValue(sampleBundle)
    const { rerender } = renderHook(() => useAnalyticsData())
    await waitFor(() => {
      expect(getAllMock).toHaveBeenCalledTimes(1)
    })
    rerender()
    rerender()
    rerender()
    // Identity stability via useCallback prevents extra effect re-runs
    expect(getAllMock).toHaveBeenCalledTimes(1)
  })
})
