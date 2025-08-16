/**
 * Form Auto-Save Hook Tests
 * Simplified tests for the new auto-save functionality
 */

import { renderHook, act } from '@testing-library/react'
import { useFormAutoSave, useAutoSaveStatus } from '../use-form-auto-save'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

// Mock timers
vi.useFakeTimers()

describe('useFormAutoSave', () => {
  let mockOnSave: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockOnSave = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    })
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.clearAllTimers()
  })

  it('should initialize with default state', () => {
    const formData = { name: '', email: '' }
    const { result } = renderHook(() =>
      useFormAutoSave('test-form', formData, { onSave: mockOnSave })
    )

    expect(result.current.status.hasUnsaved).toBe(false)
    expect(result.current.status.isSaving).toBe(false)
    expect(result.current.status.lastSaved).toBe(null)
    expect(result.current.status.error).toBe(null)
    expect(result.current.status.hasErrors).toBe(false)
  })

  it('should mark as unsaved when form data changes', () => {
    let formData = { name: '', email: '' }
    const { result, rerender } = renderHook(() =>
      useFormAutoSave('test-form', formData, {
        onSave: mockOnSave,
        debounceMs: 100
      })
    )

    // Update form data
    formData = { name: 'John Doe', email: 'john@example.com' }
    rerender()

    // Should be marked as having unsaved changes
    expect(result.current.status.hasUnsaved).toBe(true)
  })

  it('should trigger save after debounce period', async () => {
    let formData = { name: '', email: '' }
    const { rerender } = renderHook(() =>
      useFormAutoSave('test-form', formData, {
        onSave: mockOnSave,
        debounceMs: 100
      })
    )

    // Update form data
    formData = { name: 'John Doe', email: 'john@example.com' }
    rerender()

    // Wait for debounce
    await act(async () => {
      vi.advanceTimersByTime(150)
      await vi.runOnlyPendingTimersAsync()
    })

    // Should trigger save
    expect(mockOnSave).toHaveBeenCalledWith(formData)
  })

  it('should save to localStorage', async () => {
    let formData = { name: 'John', email: 'john@example.com' }
    const { rerender } = renderHook(() =>
      useFormAutoSave('test-form', formData, {
        onSave: mockOnSave,
        debounceMs: 50
      })
    )

    // Update form data
    formData = { name: 'John Doe', email: 'john@example.com' }
    rerender()

    // Wait for save
    await act(async () => {
      vi.advanceTimersByTime(100)
      await vi.runOnlyPendingTimersAsync()
    })

    // Check localStorage
    const stored = localStorageMock.getItem('form-auto-save-test-form')
    expect(stored).toBeTruthy()
    
    if (stored) {
      const parsed = JSON.parse(stored)
      expect(parsed.data).toEqual(formData)
    }
  })

  it('should handle save errors', async () => {
    const mockOnError = vi.fn()
    mockOnSave.mockRejectedValue(new Error('Save failed'))

    let formData = { name: 'John', email: 'john@example.com' }
    const { result, rerender } = renderHook(() =>
      useFormAutoSave('test-form', formData, {
        onSave: mockOnSave,
        onError: mockOnError,
        debounceMs: 50
      })
    )

    // Update form data
    formData = { name: 'John Doe', email: 'john@example.com' }
    rerender()

    // Wait for save attempt
    await act(async () => {
      vi.advanceTimersByTime(100)
      await vi.runOnlyPendingTimersAsync()
    })

    expect(result.current.status.hasErrors).toBe(true)
    expect(result.current.status.error).toBe('Save failed')
    expect(mockOnError).toHaveBeenCalled()
  })

  it('should provide force save functionality', async () => {
    const formData = { name: 'John', email: 'john@example.com' }
    const { result } = renderHook(() =>
      useFormAutoSave('test-form', formData, {
        onSave: mockOnSave
      })
    )

    await act(async () => {
      await result.current.forceSave()
    })

    expect(mockOnSave).toHaveBeenCalledWith(formData)
  })

  it('should provide clear saved data functionality', () => {
    const formData = { name: 'John', email: 'john@example.com' }
    localStorageMock.setItem('form-auto-save-test-form', JSON.stringify({ data: formData }))

    const { result } = renderHook(() =>
      useFormAutoSave('test-form', formData, {
        onSave: mockOnSave
      })
    )

    act(() => {
      result.current.clearSaved()
    })

    expect(localStorageMock.getItem('form-auto-save-test-form')).toBe(null)
  })
})

describe('useAutoSaveStatus', () => {
  it('should return default status', () => {
    const { result } = renderHook(() => useAutoSaveStatus())

    expect(result.current.hasUnsaved).toBe(false)
    expect(result.current.isSaving).toBe(false)
    expect(result.current.hasErrors).toBe(false)
    expect(result.current.count).toBe(0)
  })
})