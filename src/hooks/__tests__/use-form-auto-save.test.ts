/**
 * Form Auto-Save Hook Tests
 * Comprehensive unit tests for auto-save functionality
 */

import { renderHook, act } from '@testing-library/react'
import { useFormAutoSave, useAutoSaveStatus } from '../use-form-auto-save'
import { describe, it, expect, beforeEach, afterEach, vi, type MockedFunction } from 'vitest'
import { Provider as JotaiProvider } from 'jotai'
import React from 'react'

// Wrapper component for Jotai provider
const JotaiTestWrapper = ({ children }: { children: React.ReactNode }) => (
  <JotaiProvider>{children}</JotaiProvider>
)

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    key: vi.fn(),
    length: 0
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock timers
vi.useFakeTimers()

describe('useFormAutoSave', () => {
  const mockOnSave = vi.fn()
  const mockOnError = vi.fn()
  const mockOnRestore = vi.fn()
  const mockValidate = vi.fn()

  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
    vi.clearAllTimers()
    mockOnSave.mockResolvedValue(undefined)
    mockValidate.mockReturnValue(true)
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  it('should initialize with default state', () => {
    const formData = { name: '', email: '' }
    const { result } = renderHook(() =>
      useFormAutoSave('test-form', formData, { onSave: mockOnSave }),
      { wrapper: JotaiTestWrapper }
    )

    expect(result.current.isDirty).toBe(false)
    expect(result.current.isSaving).toBe(false)
    expect(result.current.lastSaved).toBe(null)
    expect(result.current.error).toBe(null)
    expect(result.current.hasUnsavedChanges).toBe(false)
  })

  it('should trigger auto-save when form data changes', async () => {
    let formData = { name: 'John', email: '' }
    const { result, rerender } = renderHook(() =>
      useFormAutoSave('test-form', formData, {
        onSave: mockOnSave,
        debounceMs: 100
      })
    )

    // Update form data
    formData = { name: 'John Doe', email: 'john@example.com' }
    rerender()

    // Should be marked as dirty immediately
    expect(result.current.isDirty).toBe(true)

    // Wait for debounce
    await act(async () => {
      vi.advanceTimersByTime(150)
    })

    // Should trigger save
    expect(mockOnSave).toHaveBeenCalledWith(formData)
    expect(result.current.isSaving).toBe(true)

    // Wait for save to complete
    await act(async () => {
      await vi.runOnlyPendingTimersAsync()
    })

    expect(result.current.isDirty).toBe(false)
    expect(result.current.isSaving).toBe(false)
    expect(result.current.lastSaved).toBeTruthy()
  })

  it('should debounce multiple rapid changes', async () => {
    let formData = { name: '', email: '' }
    const { rerender } = renderHook(() =>
      useFormAutoSave('test-form', formData, {
        onSave: mockOnSave,
        debounceMs: 300
      })
    )

    // Make rapid changes
    formData = { name: 'J', email: '' }
    rerender()

    formData = { name: 'Jo', email: '' }
    rerender()

    formData = { name: 'Joh', email: '' }
    rerender()

    formData = { name: 'John', email: '' }
    rerender()

    // Advance time partially
    await act(async () => {
      vi.advanceTimersByTime(200)
    })

    // Should not have saved yet
    expect(mockOnSave).not.toHaveBeenCalled()

    // Complete the debounce
    await act(async () => {
      vi.advanceTimersByTime(200)
    })

    // Should only save once with final value
    expect(mockOnSave).toHaveBeenCalledTimes(1)
    expect(mockOnSave).toHaveBeenCalledWith({ name: 'John', email: '' })
  })

  it('should handle validation before saving', async () => {
    const formData = { name: '', email: 'invalid-email' }
    renderHook(() =>
      useFormAutoSave('test-form', formData, {
        onSave: mockOnSave,
        validateBeforeSave: mockValidate,
        debounceMs: 100
      })
    )

    // Set validation to fail
    mockValidate.mockReturnValue(false)

    await act(async () => {
      vi.advanceTimersByTime(150)
    })

    expect(mockValidate).toHaveBeenCalledWith(formData)
    expect(mockOnSave).not.toHaveBeenCalled()
  })

  it('should handle save errors with retry logic', async () => {
    const formData = { name: 'John', email: 'john@example.com' }
    const saveError = new Error('Network error')
    mockOnSave.mockRejectedValueOnce(saveError)

    const { result } = renderHook(() =>
      useFormAutoSave('test-form', formData, {
        onSave: mockOnSave,
        onError: mockOnError,
        debounceMs: 100
      })
    )

    await act(async () => {
      vi.advanceTimersByTime(150)
    })

    // Wait for error handling
    await act(async () => {
      await vi.runOnlyPendingTimersAsync()
    })

    expect(mockOnError).toHaveBeenCalledWith(saveError)
    expect(result.current.error).toBe('Network error')
    expect(result.current.retryCount).toBe(1)

    // Should retry after exponential backoff (2 seconds)
    mockOnSave.mockResolvedValueOnce(undefined)

    await act(async () => {
      vi.advanceTimersByTime(2000)
      await vi.runOnlyPendingTimersAsync()
    })

    expect(mockOnSave).toHaveBeenCalledTimes(2)
    expect(result.current.error).toBe(null)
    expect(result.current.retryCount).toBe(0)
  })

  it('should restore saved data on mount', () => {
    const savedData = { name: 'John Doe', email: 'john@example.com' }
    
    // Mock existing saved state
    localStorageMock.setItem(
      'form-auto-save-states',
      JSON.stringify({
        'restore-form': {
          formId: 'restore-form',
          data: savedData,
          isDirty: true,
          lastSaved: new Date().toISOString(),
          isSaving: false,
          error: null,
          retryCount: 0
        }
      })
    )

    const initialData = { name: '', email: '' }
    renderHook(() =>
      useFormAutoSave('restore-form', initialData, {
        onSave: mockOnSave,
        onRestore: mockOnRestore
      })
    )

    expect(mockOnRestore).toHaveBeenCalledWith(savedData)
  })

  it('should clear saved data when requested', async () => {
    const formData = { name: 'John', email: 'john@example.com' }
    const { result } = renderHook(() =>
      useFormAutoSave('clear-form', formData, {
        onSave: mockOnSave
      })
    )

    // Save some data first
    await act(async () => {
      vi.advanceTimersByTime(350)
      await vi.runOnlyPendingTimersAsync()
    })

    // Clear saved data
    act(() => {
      result.current.clearSavedData()
    })

    expect(result.current.isDirty).toBe(false)
    expect(result.current.hasUnsavedChanges).toBe(false)
  })

  it('should support manual save', async () => {
    const formData = { name: 'John', email: 'john@example.com' }
    const { result } = renderHook(() =>
      useFormAutoSave('manual-form', formData, {
        onSave: mockOnSave
      })
    )

    // Trigger manual save
    await act(async () => {
      await result.current.manualSave()
    })

    expect(mockOnSave).toHaveBeenCalledWith(formData)
  })

  it('should skip auto-save when disabled', async () => {
    const formData = { name: 'John', email: 'john@example.com' }
    renderHook(() =>
      useFormAutoSave('disabled-form', formData, {
        onSave: mockOnSave,
        enabled: false,
        debounceMs: 100
      })
    )

    await act(async () => {
      vi.advanceTimersByTime(150)
    })

    expect(mockOnSave).not.toHaveBeenCalled()
  })
})

describe('useAutoSaveStatus', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  it('should track global auto-save status', async () => {
    const { result: statusResult } = renderHook(() => useAutoSaveStatus())
    
    // Initially no active auto-saves
    expect(statusResult.current.hasUnsaved).toBe(false)
    expect(statusResult.current.isSaving).toBe(false)
    expect(statusResult.current.hasErrors).toBe(false)
    expect(statusResult.current.count).toBe(0)

    // Start an auto-save form
    const formData = { name: 'John', email: '' }
    const { rerender } = renderHook(() =>
      useFormAutoSave('status-form', formData, {
        onSave: vi.fn().mockResolvedValue(undefined),
        debounceMs: 100
      })
    )

    // Update data to trigger dirty state
    rerender()

    // Should reflect in global status
    expect(statusResult.current.hasUnsaved).toBe(true)
    expect(statusResult.current.count).toBe(1)
  })

  it('should handle multiple forms', async () => {
    const { result: statusResult } = renderHook(() => useAutoSaveStatus())

    // Create multiple forms
    const formData1 = { name: 'John', email: '' }
    const formData2 = { subject: 'Test', message: '' }

    renderHook(() =>
      useFormAutoSave('form-1', formData1, {
        onSave: vi.fn().mockResolvedValue(undefined)
      })
    )

    renderHook(() =>
      useFormAutoSave('form-2', formData2, {
        onSave: vi.fn().mockResolvedValue(undefined)
      })
    )

    // Should track both forms
    expect(statusResult.current.count).toBe(2)
  })
})