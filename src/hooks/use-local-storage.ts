'use client'

import { useCallback, useMemo, useSyncExternalStore } from 'react'
import { z } from 'zod'
import { handleUtilityError } from '@/lib/error-handling'

/**
 * Create a storage adapter for useSyncExternalStore
 */
function createStorageAdapter<T>(
  storage: Storage | null,
  key: string,
  initialValue: T,
  schema?: z.ZodSchema<T>
) {
  // Track listeners for storage changes
  const listeners = new Set<() => void>()

  // Notify all listeners of changes
  const emitChange = () => {
    listeners.forEach((listener) => listener())
  }

  // Subscribe to storage changes
  const subscribe = (callback: () => void): (() => void) => {
    listeners.add(callback)

    // Listen for storage events from other tabs
    listeners.add(callback)

    // Listen for storage events from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        emitChange()
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange)
    }

    return () => {
      listeners.delete(callback)
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange)
      }
    }
  }

  // Cache the snapshot to avoid infinite loops
  let cachedSnapshot: T | undefined
  let lastItem: string | null | undefined

  // Get current value from storage
  const getSnapshot = (): T => {
    if (!storage) return initialValue

    try {
      const item = storage.getItem(key)

      // Return cached snapshot if storage hasn't changed
      if (item === lastItem && cachedSnapshot !== undefined) {
        return cachedSnapshot
      }

      lastItem = item

      if (item === null) {
        cachedSnapshot = initialValue
        return initialValue
      }

      const parsed = JSON.parse(item)
      cachedSnapshot = schema ? schema.parse(parsed) : parsed
      return cachedSnapshot as T
    } catch (error) {
      const fallback = handleUtilityError(
        error,
        { operation: 'getStorageSnapshot', component: 'LocalStorage', metadata: { key } },
        'return-default',
        initialValue
      )!
      cachedSnapshot = fallback
      return fallback
    }
  }

  // Server snapshot always returns initial value
  const getServerSnapshot = (): T => initialValue

  // Set value to storage
  const setValue = (value: T | ((prev: T) => T)): void => {
    if (!storage) return

    try {
      const currentValue = getSnapshot()
      const newValue = value instanceof Function ? value(currentValue) : value
      storage.setItem(key, JSON.stringify(newValue))
      // Clear cache so next getSnapshot reads fresh value
      lastItem = undefined
      cachedSnapshot = undefined
      emitChange()
    } catch (error) {
      handleUtilityError(
        error,
        { operation: 'setStorageValue', component: 'LocalStorage', metadata: { key } },
        'return-default'
      )
    }
  }

  return { subscribe, getSnapshot, getServerSnapshot, setValue }
}

/**
 * useLocalStorage Hook
 *
 * A custom hook for persisting state in localStorage with proper SSR handling.
 * Uses useSyncExternalStore to avoid hydration mismatches.
 *
 * @param key - The localStorage key
 * @param initialValue - The initial value if no value exists in localStorage
 * @param schema - Optional Zod schema for runtime validation
 * @returns A stateful value and a function to update it
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  schema?: z.ZodSchema<T>
): [T, (value: T | ((val: T) => T)) => void] {
  const storage = typeof window !== 'undefined' ? window.localStorage : null

  // Memoize the adapter to prevent recreation on every render
  const adapter = useMemo(
    () => createStorageAdapter(storage, key, initialValue, schema),
    [storage, key, initialValue, schema]
  )

  const value = useSyncExternalStore(
    adapter.subscribe,
    adapter.getSnapshot,
    adapter.getServerSnapshot
  )

  const setValue = useCallback(
    (newValue: T | ((val: T) => T)) => {
      adapter.setValue(newValue)
    },
    [adapter]
  )

  return [value, setValue]
}

/**
 * useSessionStorage Hook
 *
 * Similar to useLocalStorage but uses sessionStorage instead.
 *
 * @param key - The sessionStorage key
 * @param initialValue - The initial value if no value exists in sessionStorage
 * @param schema - Optional Zod schema for runtime validation
 * @returns A stateful value and a function to update it
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T,
  schema?: z.ZodSchema<T>
): [T, (value: T | ((val: T) => T)) => void] {
  const storage = typeof window !== 'undefined' ? window.sessionStorage : null

  // Memoize the adapter to prevent recreation on every render
  const adapter = useMemo(
    () => createStorageAdapter(storage, key, initialValue, schema),
    [storage, key, initialValue, schema]
  )

  const value = useSyncExternalStore(
    adapter.subscribe,
    adapter.getSnapshot,
    adapter.getServerSnapshot
  )

  const setValue = useCallback(
    (newValue: T | ((val: T) => T)) => {
      adapter.setValue(newValue)
    },
    [adapter]
  )

  return [value, setValue]
}
