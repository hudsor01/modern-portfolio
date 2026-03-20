import { logger } from '@/lib/logger'

export interface CacheStats {
  size: number
  keys: string[]
}

export class DataCacheService {
  private cache: Map<string, { data: unknown; timestamp: number; ttl: number }> = new Map()
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes
  private readonly MAX_ENTRIES = 500
  private readonly TARGET_EVICTION_RATIO = 0.9
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    // Run cleanup every 10 minutes to remove expired entries
    this.cleanupInterval = setInterval(
      () => {
        this.cleanup()
      },
      10 * 60 * 1000
    ) // 10 minutes
    this.cleanupInterval.unref?.()
  }

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })

    logger.debug('Data cached', { key, ttl, size: JSON.stringify(data).length })
    this.enforceSizeLimit()
  }

  get<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    const isExpired = Date.now() - cached.timestamp > cached.ttl
    if (isExpired) {
      this.cache.delete(key)
      logger.debug('Cache expired', { key })
      return null
    }

    logger.debug('Cache hit', { key })
    return cached.data as T
  }

  invalidate(key: string): void {
    this.cache.delete(key)
    logger.debug('Cache invalidated', { key })
  }

  clear(): void {
    this.cache.clear()
    logger.info('Cache cleared')
  }

  private cleanup(): void {
    const now = Date.now()
    const keysToDelete: string[] = []

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key)
      }
    }

    keysToDelete.forEach((key) => this.cache.delete(key))

    if (keysToDelete.length > 0) {
      logger.debug('Cache cleanup', {
        removedEntries: keysToDelete.length,
        remainingEntries: this.cache.size,
      })
    }

    this.enforceSizeLimit()
  }

  private enforceSizeLimit(): void {
    if (this.cache.size <= this.MAX_ENTRIES) return

    const targetSize = Math.floor(this.MAX_ENTRIES * this.TARGET_EVICTION_RATIO)
    const entries = Array.from(this.cache.entries()).sort((a, b) => a[1].timestamp - b[1].timestamp)
    const toRemove = Math.max(0, this.cache.size - targetSize)

    for (let i = 0; i < toRemove; i++) {
      const entry = entries[i]
      if (entry) this.cache.delete(entry[0])
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.cache.clear()
  }

  getStats(): CacheStats {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }
}
