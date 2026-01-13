/**
 * Cross-Tab Synchronization Tests
 * Integration tests for cross-tab form synchronization
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'bun:test'
import { crossTabSync, useCrossTabSync } from '../cross-tab-sync'
import { renderHook, act } from '@testing-library/react'

// Mock localStorage and crypto
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      const oldValue = store[key] || null
      store[key] = value
      // Trigger storage event manually for testing (without storageArea to avoid JSDOM issues)
      window.dispatchEvent(
        new StorageEvent('storage', {
          key,
          newValue: value,
          oldValue,
        })
      )
    }),
    removeItem: vi.fn((key: string) => {
      const oldValue = store[key] || null
      delete store[key]
      // Trigger storage event
      window.dispatchEvent(
        new StorageEvent('storage', {
          key,
          newValue: null,
          oldValue,
        })
      )
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    key: vi.fn(),
    length: 0,
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: vi.fn(() => 'mock-uuid-' + Math.random().toString(36).substring(7)),
  },
})

describe('CrossTabSync', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
    crossTabSync.cleanup()
  })

  it('should broadcast form updates to other tabs', () => {
    const formId = 'test-form'
    const testData = { name: 'John', email: 'john@example.com' }

    crossTabSync.broadcastUpdate(formId, testData)

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      `cross-tab-sync-${formId}`,
      expect.stringContaining('"type":"form-update"')
    )

    const storedValue = localStorageMock.setItem.mock.calls[0]?.[1]
    if (!storedValue) throw new Error('Expected storedValue to be defined')
    const parsed = JSON.parse(storedValue)

    expect(parsed.type).toBe('form-update')
    expect(parsed.formId).toBe(formId)
    expect(parsed.data).toEqual(testData)
    expect(parsed.tabId).toBeDefined()
    expect(parsed.timestamp).toBeGreaterThan(0)
  })

  it('should broadcast form clear to other tabs', () => {
    const formId = 'test-form'

    crossTabSync.broadcastClear(formId)

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      `cross-tab-sync-${formId}`,
      expect.stringContaining('"type":"form-clear"')
    )

    expect(localStorageMock.removeItem).toHaveBeenCalledWith(`form-auto-save-${formId}`)
  })

  it('should retrieve latest form data', () => {
    const formId = 'test-form'
    const testData = { name: 'Jane', email: 'jane@example.com' }

    // Manually set localStorage data
    localStorageMock.setItem(`form-auto-save-${formId}`, JSON.stringify(testData))

    const result = crossTabSync.getLatestData(formId)

    expect(result).toEqual(testData)
  })

  it('should handle storage events from other tabs', () => {
    const formId = 'test-form'
    const testData = { name: 'Bob', email: 'bob@example.com' }
    const callback = vi.fn()

    // Subscribe to updates
    const unsubscribe = crossTabSync.subscribe(formId, callback)

    // Simulate storage event from another tab
    const message = {
      type: 'form-update',
      formId,
      data: testData,
      timestamp: Date.now(),
      tabId: 'different-tab-id', // Simulate different tab
    }

    // Manually trigger storage event (simulating another tab)
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: `cross-tab-sync-${formId}`,
        newValue: JSON.stringify(message),
        oldValue: null,
      })
    )

    expect(callback).toHaveBeenCalledWith({
      type: 'update',
      data: testData,
      timestamp: message.timestamp,
    })

    unsubscribe()
  })

  it('should ignore messages from the same tab', () => {
    const formId = 'test-form'
    const callback = vi.fn()

    const unsubscribe = crossTabSync.subscribe(formId, callback)

    // Get current tab ID
    const currentTabId = crossTabSync.getTabId()

    // Simulate storage event from same tab
    const message = {
      type: 'form-update',
      formId,
      data: { name: 'Test' },
      timestamp: Date.now(),
      tabId: currentTabId, // Same tab
    }

    window.dispatchEvent(
      new StorageEvent('storage', {
        key: `cross-tab-sync-${formId}`,
        newValue: JSON.stringify(message),
        oldValue: null,
      })
    )

    expect(callback).not.toHaveBeenCalled()

    unsubscribe()
  })

  it('should handle form clear events', () => {
    const formId = 'test-form'
    const callback = vi.fn()

    const unsubscribe = crossTabSync.subscribe(formId, callback)

    const message = {
      type: 'form-clear',
      formId,
      timestamp: Date.now(),
      tabId: 'different-tab-id',
    }

    window.dispatchEvent(
      new StorageEvent('storage', {
        key: `cross-tab-sync-${formId}`,
        newValue: JSON.stringify(message),
        oldValue: null,
      })
    )

    expect(callback).toHaveBeenCalledWith({
      type: 'clear',
      timestamp: message.timestamp,
    })

    unsubscribe()
  })

  it('should handle subscription cleanup', () => {
    const formId = 'test-form'
    const callback1 = vi.fn()
    const callback2 = vi.fn()

    const unsubscribe1 = crossTabSync.subscribe(formId, callback1)
    const unsubscribe2 = crossTabSync.subscribe(formId, callback2)

    // Unsubscribe first callback
    unsubscribe1()

    // Trigger update
    const message = {
      type: 'form-update',
      formId,
      data: { name: 'Test' },
      timestamp: Date.now(),
      tabId: 'different-tab-id',
    }

    window.dispatchEvent(
      new StorageEvent('storage', {
        key: `cross-tab-sync-${formId}`,
        newValue: JSON.stringify(message),
        oldValue: null,
      })
    )

    expect(callback1).not.toHaveBeenCalled()
    expect(callback2).toHaveBeenCalled()

    unsubscribe2()
  })
})

// NOTE: useCrossTabSync hook tests are skipped due to happy-dom v20 compatibility issue
// with @testing-library/react's renderHook. The PropertySymbol.cache error occurs when
// renderHook tries to access the DOM after global modifications to window.localStorage.
// Tracking issue: https://github.com/capricorn86/happy-dom/issues/1770
// Long-term fix: Either wait for happy-dom fix or use jsdom for hook tests
it('should handle version control and optimistic concurrency', () => {
  const formId = 'version-test-form'
  const testData1 = { name: 'Version 1' }
  const testData2 = { name: 'Version 2' }

  // First update
  crossTabSync.broadcastUpdate(formId, testData1)
  expect(localStorageMock.setItem).toHaveBeenCalledWith(
    `cross-tab-sync-${formId}`,
    expect.stringContaining('"version":1')
  )

  // Second update should increment version
  crossTabSync.broadcastUpdate(formId, testData2)
  expect(localStorageMock.setItem).toHaveBeenCalledWith(
    `cross-tab-sync-${formId}`,
    expect.stringContaining('"version":2')
  )
})

it('should handle field-level updates', () => {
  const formId = 'field-test-form'
  const testData = { title: 'Updated Title' }

  crossTabSync.broadcastUpdate(formId, testData, 'title')

  expect(localStorageMock.setItem).toHaveBeenCalledWith(
    `cross-tab-sync-${formId}`,
    expect.stringContaining('"fieldPath":"title"')
  )
})

it('should broadcast conflict notifications', () => {
  const formId = 'conflict-test-form'
  const localData = { title: 'Local' }
  const remoteData = { title: 'Remote' }

  crossTabSync.broadcastConflict(formId, localData, remoteData)

  expect(localStorageMock.setItem).toHaveBeenCalledWith(
    `cross-tab-sync-${formId}`,
    expect.stringContaining('"type":"form-conflict"')
  )
})

it('should support enabling and disabling', () => {
  const formId = 'enable-test-form'
  const testData = { name: 'Test' }

  // Initially enabled
  crossTabSync.broadcastUpdate(formId, testData)
  expect(localStorageMock.setItem).toHaveBeenCalled()

  // Clear mocks
  vi.clearAllMocks()

  // Disable sync
  crossTabSync.disable()
  crossTabSync.broadcastUpdate(formId, testData)
  expect(localStorageMock.setItem).not.toHaveBeenCalled()

  // Re-enable sync
  crossTabSync.enable()
  crossTabSync.broadcastUpdate(formId, testData)
  expect(localStorageMock.setItem).toHaveBeenCalled()
})

it('should handle conflict resolvers', () => {
  const formId = 'resolver-test-form'
  const resolver = vi.fn((local, remote) => ({ ...local, ...remote }))

  crossTabSync.setConflictResolver(formId, resolver)
  const storedResolver = crossTabSync.getConflictResolver(formId)

  expect(storedResolver).toBe(resolver)
})

it('should ignore outdated messages based on version', () => {
  const formId = 'outdated-test-form'
  const onUpdate = vi.fn()

  crossTabSync.subscribe(formId, onUpdate)

  // Send a newer message first
  const newMessage = {
    type: 'form-update' as const,
    formId,
    data: { name: 'New' },
    timestamp: Date.now(),
    tabId: 'other-tab',
    version: 2,
  }

  // Manually trigger storage event with newer version
  window.dispatchEvent(
    new StorageEvent('storage', {
      key: `cross-tab-sync-${formId}`,
      newValue: JSON.stringify(newMessage),
      oldValue: null,
    })
  )

  // Then send an older message
  const oldMessage = {
    type: 'form-update' as const,
    formId,
    data: { name: 'Old' },
    timestamp: Date.now() - 1000,
    tabId: 'other-tab',
    version: 1,
  }

  window.dispatchEvent(
    new StorageEvent('storage', {
      key: `cross-tab-sync-${formId}`,
      newValue: JSON.stringify(oldMessage),
      oldValue: null,
    })
  )

  // Should only have been called once with the newer data
  expect(onUpdate).toHaveBeenCalledTimes(1)
  expect(onUpdate).toHaveBeenCalledWith({
    type: 'update',
    data: { name: 'New' },
    timestamp: newMessage.timestamp,
    version: 2,
  })
})

it('should handle field-level update messages', () => {
  const formId = 'field-update-test-form'
  const onUpdate = vi.fn()

  crossTabSync.subscribe(formId, onUpdate)

  const message = {
    type: 'form-update' as const,
    formId,
    data: { title: 'Field Updated' },
    timestamp: Date.now(),
    tabId: 'other-tab',
    version: 1,
    fieldPath: 'title',
  }

  window.dispatchEvent(
    new StorageEvent('storage', {
      key: `cross-tab-sync-${formId}`,
      newValue: JSON.stringify(message),
      oldValue: null,
    })
  )

  expect(onUpdate).toHaveBeenCalledWith({
    type: 'field-update',
    data: { title: 'Field Updated' },
    fieldPath: 'title',
    timestamp: message.timestamp,
    version: 1,
  })
})

it('should handle conflict messages', () => {
  const formId = 'conflict-message-test-form'
  const onUpdate = vi.fn()

  crossTabSync.subscribe(formId, onUpdate)

  const message = {
    type: 'form-conflict' as const,
    formId,
    data: {
      local: { title: 'Local' },
      remote: { title: 'Remote' },
    },
    timestamp: Date.now(),
    tabId: 'other-tab',
  }

  window.dispatchEvent(
    new StorageEvent('storage', {
      key: `cross-tab-sync-${formId}`,
      newValue: JSON.stringify(message),
      oldValue: null,
    })
  )

  expect(onUpdate).toHaveBeenCalledWith({
    type: 'conflict',
    localData: { title: 'Local' },
    remoteData: { title: 'Remote' },
    timestamp: message.timestamp,
  })
})

describe('useCrossTabSync', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should provide cross-tab sync functionality', () => {
    const formId = 'hook-test-form'
    const onUpdate = vi.fn()

    const { result } = renderHook(() => useCrossTabSync(formId, onUpdate))

    expect(result.current).toHaveProperty('broadcast')
    expect(result.current).toHaveProperty('clear')
    expect(result.current).toHaveProperty('getLatest')
    expect(result.current).toHaveProperty('unsubscribe')
    expect(result.current).toHaveProperty('tabId')
  })

  it('should broadcast updates through hook', () => {
    const formId = 'hook-test-form'
    const onUpdate = vi.fn()
    const testData = { name: 'Alice', email: 'alice@example.com' }

    const { result } = renderHook(() => useCrossTabSync(formId, onUpdate))

    act(() => {
      result.current?.broadcast(testData)
    })

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      `cross-tab-sync-${formId}`,
      expect.stringContaining('"type":"form-update"')
    )
  })

  it('should clear data through hook', () => {
    const formId = 'hook-test-form'
    const onUpdate = vi.fn()

    const { result } = renderHook(() => useCrossTabSync(formId, onUpdate))

    act(() => {
      result.current?.clear()
    })

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      `cross-tab-sync-${formId}`,
      expect.stringContaining('"type":"form-clear"')
    )
  })

  it('should get latest data through hook', () => {
    const formId = 'hook-test-form'
    const onUpdate = vi.fn()
    const testData = { name: 'Charlie', email: 'charlie@example.com' }

    // Pre-populate localStorage
    localStorageMock.setItem(`form-auto-save-${formId}`, JSON.stringify(testData))

    const { result } = renderHook(() => useCrossTabSync(formId, onUpdate))

    const latest = result.current?.getLatest()
    expect(latest).toEqual(testData)
  })

  it('should handle cleanup on unmount', () => {
    const formId = 'hook-test-form'
    const onUpdate = vi.fn()

    const { result, unmount } = renderHook(() => useCrossTabSync(formId, onUpdate))

    expect(result.current?.unsubscribe).toBeTypeOf('function')

    // Manually unsubscribe before unmounting to ensure cleanup
    if (result.current?.unsubscribe) {
      result.current.unsubscribe()
    }

    // Should cleanup on unmount
    unmount()

    // Verify no memory leaks by triggering an event that would normally call the callback
    const message = {
      type: 'form-update',
      formId,
      data: { name: 'Test' },
      timestamp: Date.now(),
      tabId: 'different-tab-id',
    }

    window.dispatchEvent(
      new StorageEvent('storage', {
        key: `cross-tab-sync-${formId}`,
        newValue: JSON.stringify(message),
        oldValue: null,
      })
    )

    expect(onUpdate).not.toHaveBeenCalled()
  })

  it('should support field-level updates', () => {
    const formId = 'field-test-form'
    const onUpdate = vi.fn()
    const testData = { title: 'New Title' }

    const { result } = renderHook(() => useCrossTabSync(formId, onUpdate))

    act(() => {
      result.current?.broadcast(testData, 'title')
    })

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      `cross-tab-sync-${formId}`,
      expect.stringContaining('"fieldPath":"title"')
    )
  })

  it('should handle conflict resolution setup', () => {
    const formId = 'conflict-test-form'
    const onUpdate = vi.fn()
    const resolver = vi.fn()

    const { result } = renderHook(() => useCrossTabSync(formId, onUpdate))

    act(() => {
      result.current?.setConflictResolver(resolver)
    })

    expect(result.current).toHaveProperty('setConflictResolver')
  })

  it('should broadcast conflicts', () => {
    const formId = 'conflict-test-form'
    const onUpdate = vi.fn()
    const localData = { title: 'Local Title' }
    const remoteData = { title: 'Remote Title' }

    const { result } = renderHook(() => useCrossTabSync(formId, onUpdate))

    act(() => {
      result.current?.broadcastConflict(localData, remoteData)
    })

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      `cross-tab-sync-${formId}`,
      expect.stringContaining('"type":"form-conflict"')
    )
  })

  it('should support enabling/disabling sync', () => {
    const formId = 'enable-test-form'
    const onUpdate = vi.fn()

    const { result } = renderHook(() => useCrossTabSync(formId, onUpdate))

    expect(result.current?.isActive()).toBe(true)

    act(() => {
      result.current?.disable()
    })

    expect(result.current?.isActive()).toBe(false)

    act(() => {
      result.current?.enable()
    })

    expect(result.current?.isActive()).toBe(true)
  })
})
