/**
 * Vitest Compatibility Layer for Bun
 *
 * Provides extended vi methods that don't exist in Bun's native test runner.
 * Import from here instead of 'bun:test' when you need:
 * - vi.stubGlobal, vi.unstubAllGlobals
 * - vi.advanceTimersByTime, vi.runAllTimers, vi.runAllTimersAsync (no-ops)
 */

import { vi as bunVi } from 'bun:test'

// Store original values for unstubbing
const stubbedGlobals = new Map<string, unknown>()

// Extended vi interface
export interface ViExt {
  // Original bun:test vi methods
  fn: typeof bunVi.fn
  spyOn: typeof bunVi.spyOn
  mock: typeof bunVi.mock
  clearAllMocks: typeof bunVi.clearAllMocks
  restoreAllMocks: typeof bunVi.restoreAllMocks
  resetAllMocks: typeof bunVi.resetAllMocks
  useFakeTimers: typeof bunVi.useFakeTimers
  useRealTimers: typeof bunVi.useRealTimers
  isFakeTimers: typeof bunVi.isFakeTimers
  clearAllTimers: () => void

  // Extended Vitest-compatible methods
  stubGlobal: (name: string, value: unknown) => void
  unstubAllGlobals: () => void
  mocked: <T>(item: T) => T
  hoisted: <T>(fn: () => T) => T
  doMock: typeof bunVi.mock

  // Fake timer stubs (not supported in Bun - no-ops)
  advanceTimersByTime: (ms: number) => ViExt
  runAllTimers: () => ViExt
  runAllTimersAsync: () => Promise<ViExt>
  runOnlyPendingTimers: () => ViExt
  runOnlyPendingTimersAsync: () => Promise<ViExt>
  advanceTimersToNextTimer: () => ViExt
  advanceTimersToNextTimerAsync: () => Promise<ViExt>
  getTimerCount: () => number
}

/**
 * Extended vi object with Vitest-compatible methods
 */
export const vi: ViExt = {
  // Proxy original methods
  fn: bunVi.fn,
  spyOn: bunVi.spyOn,
  mock: bunVi.mock,
  clearAllMocks: bunVi.clearAllMocks,
  restoreAllMocks: bunVi.restoreAllMocks,
  resetAllMocks: bunVi.resetAllMocks,
  useFakeTimers: bunVi.useFakeTimers,
  useRealTimers: bunVi.useRealTimers,
  isFakeTimers: bunVi.isFakeTimers,
  clearAllTimers() {
    // No-op: Bun doesn't fully support timer clearing
  },

  // Extended methods
  stubGlobal(name: string, value: unknown) {
    if (!stubbedGlobals.has(name)) {
      stubbedGlobals.set(name, (globalThis as Record<string, unknown>)[name])
    }
    ;(globalThis as Record<string, unknown>)[name] = value
    if (typeof window !== 'undefined') {
      ;(window as unknown as Record<string, unknown>)[name] = value
    }
  },

  unstubAllGlobals() {
    stubbedGlobals.forEach((original, name) => {
      ;(globalThis as Record<string, unknown>)[name] = original
      if (typeof window !== 'undefined') {
        ;(window as unknown as Record<string, unknown>)[name] = original
      }
    })
    stubbedGlobals.clear()
  },

  mocked<T>(item: T): T {
    return item
  },

  hoisted<T>(fn: () => T): T {
    return fn()
  },

  doMock: bunVi.mock,

  // Fake timer stubs (Bun doesn't support timer mocking)
  advanceTimersByTime(_ms: number) {
    return vi
  },

  runAllTimers() {
    return vi
  },

  async runAllTimersAsync() {
    return vi
  },

  runOnlyPendingTimers() {
    return vi
  },

  async runOnlyPendingTimersAsync() {
    return vi
  },

  advanceTimersToNextTimer() {
    return vi
  },

  async advanceTimersToNextTimerAsync() {
    return vi
  },

  getTimerCount() {
    return 0
  },
}
