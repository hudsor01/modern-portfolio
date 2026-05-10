// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'

const { toastMock } = vi.hoisted(() => {
  const success = vi.fn()
  const error = vi.fn()
  const warning = vi.fn()
  const info = vi.fn()
  const loading = vi.fn()
  const dismiss = vi.fn()
  const promise = vi.fn()
  return {
    toastMock: { success, error, warning, info, loading, dismiss, promise },
  }
})

vi.mock('sonner', () => ({
  toast: toastMock,
}))

import { useToast } from '@/hooks/use-sonner-toast'

beforeEach(() => {
  for (const fn of Object.values(toastMock)) {
    fn.mockReset()
  }
})

describe('useToast', () => {
  it('success() routes to toast.success', () => {
    const { result } = renderHook(() => useToast())
    result.current.success('yay')
    expect(toastMock.success).toHaveBeenCalledWith('yay', undefined)
  })

  it('error() routes to toast.error', () => {
    const { result } = renderHook(() => useToast())
    result.current.error('nope')
    expect(toastMock.error).toHaveBeenCalledWith('nope', undefined)
  })

  it('warning() routes to toast.warning', () => {
    const { result } = renderHook(() => useToast())
    result.current.warning('careful')
    expect(toastMock.warning).toHaveBeenCalledWith('careful', undefined)
  })

  it('info() routes to toast.info', () => {
    const { result } = renderHook(() => useToast())
    result.current.info('fyi')
    expect(toastMock.info).toHaveBeenCalledWith('fyi', undefined)
  })

  it('toast(message) defaults to info type', () => {
    const { result } = renderHook(() => useToast())
    result.current.toast('hello')
    expect(toastMock.info).toHaveBeenCalledWith('hello', undefined)
  })

  it('toast(message, type, options) maps action callback', () => {
    const { result } = renderHook(() => useToast())
    const onClick = vi.fn()
    result.current.toast('msg', 'success', {
      action: { label: 'undo', onClick },
    })
    expect(toastMock.success).toHaveBeenCalledTimes(1)
    const opts = toastMock.success.mock.calls[0]?.[1] as {
      action: { label: string; onClick: () => void }
    }
    expect(opts.action.label).toBe('undo')
    expect(opts.action.onClick).toBe(onClick)
  })

  it('loading() routes to toast.loading', () => {
    const { result } = renderHook(() => useToast())
    result.current.loading('working')
    expect(toastMock.loading).toHaveBeenCalledWith('working', undefined)
  })

  it('dismiss + promise are passed through unchanged', () => {
    const { result } = renderHook(() => useToast())
    expect(result.current.dismiss).toBe(toastMock.dismiss)
    expect(result.current.promise).toBe(toastMock.promise)
  })
})
