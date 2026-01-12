/**
 * Unit tests for useLocalStorage hook
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../use-local-storage'

describe('useLocalStorage', () => {
  afterEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should return default value when no stored value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'))
    expect(result.current[0]).toBe('default-value')
  })

  it('should return stored value when exists', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'))
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    expect(result.current[0]).toBe('stored-value')
  })

  it('should update stored value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    act(() => {
      result.current[1]('new-value')
    })
    expect(result.current[0]).toBe('new-value')
    expect(JSON.parse(localStorage.getItem('test-key')!)).toBe('new-value')
  })

  it('should handle object values', () => {
    const { result } = renderHook(() =>
      useLocalStorage<object>('test-key', { name: 'default' })
    )
    act(() => {
      result.current[1]({ name: 'updated' })
    })
    expect(result.current[0]).toEqual({ name: 'updated' })
  })

  it('should handle array values', () => {
    const { result } = renderHook(() => useLocalStorage<number[]>('test-key', []))
    act(() => {
      result.current[1]([1, 2, 3])
    })
    expect(result.current[0]).toEqual([1, 2, 3])
  })

  it('should store null value', () => {
    localStorage.setItem('test-key', JSON.stringify('value'))
    const { result } = renderHook(() => useLocalStorage<string | null>('test-key', 'default'))
    act(() => {
      result.current[1](null)
    })
    expect(result.current[0]).toBeNull()
    expect(localStorage.getItem('test-key')).toBe('null')
  })

  it('should return default when stored value is invalid', () => {
    localStorage.setItem('test-key', 'invalid-json')
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    expect(result.current[0]).toBe('default')
  })
})