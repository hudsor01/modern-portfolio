// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'

vi.mock('@/lib/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
  },
}))

import { useCSRFToken, addCSRFTokenToHeaders, addCSRFTokenToFormData } from '@/hooks/use-csrf-token'

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('useCSRFToken', () => {
  it('starts in loading state', () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(
      () =>
        // Promise that never resolves keeps isLoading=true
        new Promise(() => {})
    )
    const { result } = renderHook(() => useCSRFToken())
    expect(result.current.isLoading).toBe(true)
    expect(result.current.token).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('fetches and exposes the token on success', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ token: 'abc123' }), { status: 200 })
    )
    const { result } = renderHook(() => useCSRFToken())
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current.token).toBe('abc123')
    expect(result.current.error).toBeNull()
  })

  it('exposes an error when fetch returns non-ok status', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }))
    const { result } = renderHook(() => useCSRFToken())
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current.token).toBeNull()
    expect(result.current.error).toBeInstanceOf(Error)
  })

  it('exposes an error when fetch throws', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network down'))
    const { result } = renderHook(() => useCSRFToken())
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current.error).toBeInstanceOf(Error)
  })
})

describe('addCSRFTokenToHeaders', () => {
  it('adds x-csrf-token header when token is present', () => {
    expect(addCSRFTokenToHeaders('xyz')).toEqual({ 'x-csrf-token': 'xyz' })
  })

  it('preserves existing headers', () => {
    expect(addCSRFTokenToHeaders('xyz', { 'X-Existing': '1' })).toEqual({
      'X-Existing': '1',
      'x-csrf-token': 'xyz',
    })
  })

  it('returns headers unchanged when token is null', () => {
    expect(addCSRFTokenToHeaders(null, { keep: 'me' })).toEqual({ keep: 'me' })
  })
})

describe('addCSRFTokenToFormData', () => {
  it('appends _csrf_token field when token is present', () => {
    const fd = new FormData()
    addCSRFTokenToFormData('xyz', fd)
    expect(fd.get('_csrf_token')).toBe('xyz')
  })

  it('returns FormData unchanged when token is null', () => {
    const fd = new FormData()
    addCSRFTokenToFormData(null, fd)
    expect(fd.get('_csrf_token')).toBeNull()
  })
})
