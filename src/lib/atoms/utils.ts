/**
 * Jotai Atom Utilities
 * Helper functions and utilities for atomic state management
 */

import { atom, WritableAtom, Atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { 
  PersistentAtomOptions, 
  AtomState, 
  AsyncAtomState,
  AtomAction,
  AtomReducer,
  DeepPartial
} from './types'

// =======================
// STORAGE UTILITIES
// =======================

/**
 * Creates a safe storage interface that handles errors gracefully
 */
export function createSafeStorage(storage: Storage = localStorage): Storage {
  return {
    getItem: (key: string): string | null => {
      try {
        return storage.getItem(key)
      } catch (error) {
        console.warn(`Failed to get item from storage: ${key}`, error)
        return null
      }
    },
    setItem: (key: string, value: string): void => {
      try {
        storage.setItem(key, value)
      } catch (error) {
        console.warn(`Failed to set item in storage: ${key}`, error)
      }
    },
    removeItem: (key: string): void => {
      try {
        storage.removeItem(key)
      } catch (error) {
        console.warn(`Failed to remove item from storage: ${key}`, error)
      }
    },
    get length(): number {
      try {
        return storage.length
      } catch (error) {
        console.warn('Failed to get storage length', error)
        return 0
      }
    },
    key: (index: number): string | null => {
      try {
        return storage.key(index)
      } catch (error) {
        console.warn(`Failed to get storage key at index: ${index}`, error)
        return null
      }
    },
    clear: (): void => {
      try {
        storage.clear()
      } catch (error) {
        console.warn('Failed to clear storage', error)
      }
    }
  }
}

/**
 * Creates an atom with persistent storage support
 */
export function atomWithPersistence<T>(
  key: string,
  initialValue: T,
  options: Partial<PersistentAtomOptions<T>> = {}
): WritableAtom<T, [T], void> {
  const {
    storage = createSafeStorage(localStorage),
    version = 1,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    migrate
  } = options

  const storageAtom = atomWithStorage(
    key,
    initialValue,
    {
      getItem: (key: string, initialValue: T): T => {
        try {
          const item = storage.getItem(key)
          if (item === null) return initialValue

          const parsed = deserialize(item)
          
          // Handle version migration
          if (parsed && typeof parsed === 'object' && '__version' in parsed) {
            const storedVersion = parsed.__version as number
            if (storedVersion !== version && migrate) {
              return migrate(parsed, storedVersion)
            }
          }

          return parsed || initialValue
        } catch (error) {
          console.warn(`Failed to parse stored value for key: ${key}`, error)
          return initialValue
        }
      },
      setItem: (key: string, value: T): void => {
        try {
          const dataWithVersion = {
            ...value,
            __version: version
          }
          const serialized = serialize(dataWithVersion)
          storage.setItem(key, serialized)
        } catch (error) {
          console.warn(`Failed to store value for key: ${key}`, error)
        }
      },
      removeItem: (key: string): void => {
        try {
          storage.removeItem(key)
        } catch (error) {
          console.warn(`Failed to remove value for key: ${key}`, error)
        }
      }
    }
  )

  return storageAtom
}

/**
 * Creates an atom that only persists to sessionStorage
 */
export function atomWithSession<T>(
  key: string,
  initialValue: T,
  options: Partial<PersistentAtomOptions<T>> = {}
): WritableAtom<T, [T], void> {
  return atomWithPersistence(key, initialValue, {
    ...options,
    storage: createSafeStorage(sessionStorage)
  })
}

// =======================
// STATE MANAGEMENT UTILITIES
// =======================

/**
 * Creates an atom with loading and error states
 */
export function atomWithAsyncState<T>(
  initialValue: T
): WritableAtom<AtomState<T>, [Partial<AtomState<T>>], void> {
  const baseAtom = atom<AtomState<T>>({
    data: initialValue,
    loading: false,
    error: null,
    lastUpdated: undefined
  })

  return atom(
    (get) => get(baseAtom),
    (get, set, update: Partial<AtomState<T>>) => {
      const current = get(baseAtom)
      set(baseAtom, {
        ...current,
        ...update,
        lastUpdated: new Date()
      })
    }
  )
}

/**
 * Creates an atom with async loading and validation states
 */
export function atomWithValidation<T>(
  initialValue: T
): WritableAtom<AsyncAtomState<T>, [Partial<AsyncAtomState<T>>], void> {
  const baseAtom = atom<AsyncAtomState<T>>({
    data: initialValue,
    loading: false,
    error: null,
    isValidating: false,
    isStale: false,
    lastUpdated: undefined
  })

  return atom(
    (get) => get(baseAtom),
    (get, set, update: Partial<AsyncAtomState<T>>) => {
      const current = get(baseAtom)
      set(baseAtom, {
        ...current,
        ...update,
        lastUpdated: new Date()
      })
    }
  )
}

/**
 * Creates an atom that resets to initial value
 */
export function atomWithReset<T>(
  initialValue: T
): WritableAtom<T, [T | symbol], void> & { reset: symbol } {
  const RESET = Symbol('reset')
  
  const baseAtom = atom(
    initialValue,
    (_get, set, update: T | typeof RESET) => {
      if (update === RESET) {
        set(baseAtom, initialValue)
      } else {
        set(baseAtom, update)
      }
    }
  )

  const resetAtom = baseAtom as unknown as WritableAtom<T, [T | symbol], void> & { reset: symbol }
  resetAtom.reset = RESET
  return resetAtom
}

/**
 * Creates an atom with reducer pattern
 */
export function atomWithReducer<T, A extends AtomAction>(
  reducer: AtomReducer<T, A>,
  initialValue: T
): WritableAtom<T, [A], void> {
  const baseAtom = atom(initialValue)
  
  return atom(
    (get) => get(baseAtom),
    (_get, set, action: A) => {
      const currentState = _get(baseAtom)
      const newState = reducer(currentState, action)
      set(baseAtom, newState)
    }
  )
}

// =======================
// COMPUTED ATOMS
// =======================

/**
 * Creates a computed atom that depends on multiple atoms
 */
export function atomWithDependencies<T, Deps extends readonly Atom<unknown>[]>(
  dependencies: Deps,
  compute: (values: { [K in keyof Deps]: Deps[K] extends Atom<infer V> ? V : never }) => T
): Atom<T> {
  return atom((get) => {
    const values = dependencies.map(dep => get(dep)) as {
      [K in keyof Deps]: Deps[K] extends Atom<infer V> ? V : never
    }
    return compute(values)
  })
}

/**
 * Creates a debounced atom that updates after a delay
 */
export function atomWithDebounce<T>(
  baseAtom: WritableAtom<T, [T], void>,
  delay: number = 300
): WritableAtom<T, [T], void> {
  let timeoutId: NodeJS.Timeout | null = null

  return atom(
    (get) => get(baseAtom),
    (_get, set, value: T) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      
      timeoutId = setTimeout(() => {
        set(baseAtom, value)
        timeoutId = null
      }, delay)
    }
  )
}

/**
 * Creates a throttled atom that updates at most once per interval
 */
export function atomWithThrottle<T>(
  baseAtom: WritableAtom<T, [T], void>,
  interval: number = 100
): WritableAtom<T, [T], void> {
  let lastUpdate = 0
  let timeoutId: NodeJS.Timeout | null = null

  return atom(
    (get) => get(baseAtom),
    (_get, set, value: T) => {
      const now = Date.now()
      
      if (now - lastUpdate >= interval) {
        set(baseAtom, value)
        lastUpdate = now
      } else if (!timeoutId) {
        timeoutId = setTimeout(() => {
          set(baseAtom, value)
          lastUpdate = Date.now()
          timeoutId = null
        }, interval - (now - lastUpdate))
      }
    }
  )
}

// =======================
// UTILITY FUNCTIONS
// =======================

/**
 * Deep merge two objects
 */
export function deepMerge<T>(target: T, source: DeepPartial<T>): T {
  const result = { ...target }
  
  for (const key in source) {
    const sourceValue = source[key]
    const targetValue = result[key]
    
    if (sourceValue !== undefined) {
      if (typeof sourceValue === 'object' && sourceValue !== null &&
          typeof targetValue === 'object' && targetValue !== null &&
          !Array.isArray(sourceValue) && !Array.isArray(targetValue)) {
        (result as Record<string, unknown>)[key] = deepMerge(targetValue, sourceValue)
      } else {
        (result as Record<string, unknown>)[key] = sourceValue
      }
    }
  }
  
  return result
}

/**
 * Creates a unique ID
 */
export function createId(prefix: string = ''): string {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Validates if a value is not null or undefined
 */
export function isValidValue<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

/**
 * Creates a timestamp
 */
export function createTimestamp(): Date {
  return new Date()
}

/**
 * Checks if code is running on the client side
 */
export function isClient(): boolean {
  return typeof window !== 'undefined'
}

/**
 * Checks if code is running on the server side
 */
export function isServer(): boolean {
  return typeof window === 'undefined'
}

/**
 * Gets a value from localStorage safely
 */
export function getLocalStorageValue<T>(key: string, defaultValue: T): T {
  if (!isClient()) return defaultValue
  
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.warn(`Failed to get localStorage value for key: ${key}`, error)
    return defaultValue
  }
}

/**
 * Sets a value in localStorage safely
 */
export function setLocalStorageValue<T>(key: string, value: T): boolean {
  if (!isClient()) return false
  
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.warn(`Failed to set localStorage value for key: ${key}`, error)
    return false
  }
}

/**
 * Removes a value from localStorage safely
 */
export function removeLocalStorageValue(key: string): boolean {
  if (!isClient()) return false
  
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.warn(`Failed to remove localStorage value for key: ${key}`, error)
    return false
  }
}

/**
 * Creates an atom that syncs with URL search parameters
 */
export function atomWithURL<T>(
  key: string,
  initialValue: T,
  serialize: (value: T) => string = JSON.stringify,
  deserialize: (value: string) => T = JSON.parse
): WritableAtom<T, [T], void> {
  return atom(
    (_get) => {
      if (!isClient()) return initialValue
      
      try {
        const params = new URLSearchParams(window.location.search)
        const value = params.get(key)
        return value ? deserialize(value) : initialValue
      } catch (error) {
        console.warn(`Failed to get URL parameter: ${key}`, error)
        return initialValue
      }
    },
    (_get, _set, value: T) => {
      if (!isClient()) return
      
      try {
        const params = new URLSearchParams(window.location.search)
        
        if (value === initialValue || value === null || value === undefined) {
          params.delete(key)
        } else {
          params.set(key, serialize(value))
        }
        
        const newURL = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`
        window.history.replaceState({}, '', newURL)
      } catch (error) {
        console.warn(`Failed to set URL parameter: ${key}`, error)
      }
    }
  )
}

/**
 * Creates an atom that clears itself after a specified time
 */
export function atomWithExpiry<T>(
  initialValue: T,
  expiryMs: number = 30000
): WritableAtom<T | null, [T], void> {
  let timeoutId: NodeJS.Timeout | null = null
  
  const baseAtom = atom<T | null>(initialValue)
  
  return atom(
    (get) => get(baseAtom),
    (_get, set, value: T) => {
      set(baseAtom, value)
      
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      
      timeoutId = setTimeout(() => {
        set(baseAtom, null)
        timeoutId = null
      }, expiryMs)
    }
  )
}