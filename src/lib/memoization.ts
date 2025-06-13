/**
 * Simple memoization function for expensive calculations
 */
export function memoize<T extends (...args: unknown[]) => unknown>(
  fn: T,
  getKey: (...args: Parameters<T>) => string = (...args) => JSON.stringify(args)
): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = getKey(...args)

    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>
    }

    // Cast the result to ReturnType<T> to ensure type safety
    const result = fn(...args) as ReturnType<T>
    cache.set(key, result)
    return result
  }) as T
}

/**
 * Memoization for async functions
 */
export function memoizeAsync<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  getKey: (...args: Parameters<T>) => string = (...args) => JSON.stringify(args)
): T {
  const cache = new Map<string, Promise<Awaited<ReturnType<T>>>>()

  return (async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    const key = getKey(...args)

    if (cache.has(key)) {
      return cache.get(key) as Promise<Awaited<ReturnType<T>>>
    }

    const resultPromise: Promise<Awaited<ReturnType<T>>> = fn(...args) as Promise<Awaited<ReturnType<T>>>;
    cache.set(key, resultPromise);

    try {
      return await resultPromise
    } catch (error) {
      // Remove failed promises from cache
      cache.delete(key)
      throw error // Re-throw the error after cache cleanup
    }
  }) as T
}

/**
 * LRU (Least Recently Used) Cache implementation
 */
export class LRUCache<K, V> {
  private cache = new Map<K, V>()
  private readonly maxSize: number

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined

    // Get the value and refresh its position in the cache
    const value = this.cache.get(key)!
    this.cache.delete(key)
    this.cache.set(key, value)

    return value
  }

  set(key: K, value: V): void {
    // If key exists, refresh its position
    if (this.cache.has(key)) {
      this.cache.delete(key)
    }
    // If cache is full, remove the oldest item
    else if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value!
      this.cache.delete(oldestKey)
    }

    this.cache.set(key, value)
  }

  has(key: K): boolean {
    return this.cache.has(key)
  }

  delete(key: K): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  get size(): number {
    return this.cache.size
  }
}
