import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useCSRFToken, addCSRFTokenToHeaders, addCSRFTokenToFormData } from '../use-csrf-token'

// Mock logger
vi.mock('@/lib/monitoring/logger', () => ({
  createContextLogger: vi.fn(() => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn()
  }))
}))

describe('useCSRFToken', () => {
  const mockFetch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', mockFetch)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should fetch CSRF token successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: 'test-csrf-token' })
    })

    const { result } = renderHook(() => useCSRFToken())

    // Initially loading
    expect(result.current.isLoading).toBe(true)
    expect(result.current.token).toBeNull()

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.token).toBe('test-csrf-token')
    expect(result.current.error).toBeNull()
  })

  it('should handle fetch errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    })

    const { result } = renderHook(() => useCSRFToken())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.token).toBeNull()
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toContain('Failed to fetch CSRF token: 500')
  })

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useCSRFToken())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.token).toBeNull()
    expect(result.current.error?.message).toBe('Network error')
  })

  it('should call fetch with correct parameters', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: 'token' })
    })

    renderHook(() => useCSRFToken())

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })

    expect(mockFetch).toHaveBeenCalledWith('/api/contact/csrf', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
  })
})

describe('addCSRFTokenToHeaders', () => {
  it('should add token to empty headers', () => {
    const result = addCSRFTokenToHeaders('test-token')
    expect(result).toEqual({ 'x-csrf-token': 'test-token' })
  })

  it('should add token to existing headers', () => {
    const existing = { 'Content-Type': 'application/json' }
    const result = addCSRFTokenToHeaders('test-token', existing)
    expect(result).toEqual({
      'Content-Type': 'application/json',
      'x-csrf-token': 'test-token'
    })
  })

  it('should return original headers when token is null', () => {
    const existing = { 'Content-Type': 'application/json' }
    const result = addCSRFTokenToHeaders(null, existing)
    expect(result).toEqual({ 'Content-Type': 'application/json' })
  })

  it('should return empty object when both token and headers are empty', () => {
    const result = addCSRFTokenToHeaders(null)
    expect(result).toEqual({})
  })
})

describe('addCSRFTokenToFormData', () => {
  it('should add token to form data', () => {
    const formData = new FormData()
    formData.append('name', 'test')

    const result = addCSRFTokenToFormData('test-token', formData)

    expect(result.get('_csrf_token')).toBe('test-token')
    expect(result.get('name')).toBe('test')
  })

  it('should not modify form data when token is null', () => {
    const formData = new FormData()
    formData.append('name', 'test')

    const result = addCSRFTokenToFormData(null, formData)

    expect(result.get('_csrf_token')).toBeNull()
    expect(result.get('name')).toBe('test')
  })
})
