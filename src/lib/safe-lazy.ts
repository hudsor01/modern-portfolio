'use client'

import type { ComponentType } from 'react'
import { createContextLogger } from '@/lib/logger'

const logger = createContextLogger('SafeLazy')

type LazyImport<T> = Promise<{ default: ComponentType<T> }>

/**
 * Wraps a `next/dynamic` import with telemetry on chunk-load failure.
 *
 * Chunk failures (CDN miss, deploy race, network blip) are common in the wild
 * and otherwise invisible — `dynamic(() => import(...).catch(() => Fallback))`
 * silently swaps in the fallback with no Sentry signal. This helper preserves
 * that fallback UX while routing the failure through `logger.warn` so it
 * surfaces in Sentry as a captureMessage(warning) without raising
 * exception-grouping severity.
 */
export function safeLazy<T>(
  importFn: () => LazyImport<T>,
  label: string,
  Fallback: ComponentType<T>
): () => LazyImport<T> {
  return () =>
    importFn().catch((error: unknown) => {
      logger.warn('Chunk load failed', {
        label,
        error: error instanceof Error ? error.message : String(error),
      })
      return { default: Fallback }
    })
}
