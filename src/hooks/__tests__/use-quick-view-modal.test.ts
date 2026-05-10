// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useQuickViewModal } from '@/hooks/use-quick-view-modal'

describe('useQuickViewModal', () => {
  it('starts closed with no selected item', () => {
    const { result } = renderHook(() => useQuickViewModal<{ id: string }>())
    expect(result.current.isOpen).toBe(false)
    expect(result.current.selectedItem).toBeNull()
  })

  it('open(item) sets the item and opens the modal', () => {
    const { result } = renderHook(() => useQuickViewModal<{ id: string }>())
    act(() => {
      result.current.open({ id: 'x' })
    })
    expect(result.current.isOpen).toBe(true)
    expect(result.current.selectedItem).toEqual({ id: 'x' })
  })

  it('close() resets state', () => {
    const { result } = renderHook(() => useQuickViewModal<{ id: string }>())
    act(() => {
      result.current.open({ id: 'x' })
    })
    act(() => {
      result.current.close()
    })
    expect(result.current.isOpen).toBe(false)
    expect(result.current.selectedItem).toBeNull()
  })

  it('setOpen(false) clears the selected item', () => {
    const { result } = renderHook(() => useQuickViewModal<{ id: string }>())
    act(() => {
      result.current.open({ id: 'x' })
    })
    act(() => {
      result.current.setOpen(false)
    })
    expect(result.current.isOpen).toBe(false)
    expect(result.current.selectedItem).toBeNull()
  })

  it('setOpen(true) keeps the existing selected item', () => {
    const { result } = renderHook(() => useQuickViewModal<{ id: string }>())
    act(() => {
      result.current.open({ id: 'x' })
    })
    act(() => {
      result.current.setOpen(false)
    })
    act(() => {
      result.current.setOpen(true)
    })
    expect(result.current.isOpen).toBe(true)
    // selectedItem was already cleared by setOpen(false)
    expect(result.current.selectedItem).toBeNull()
  })
})
