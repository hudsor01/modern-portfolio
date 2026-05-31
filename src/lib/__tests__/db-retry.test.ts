import { describe, it, expect, vi } from 'vitest'
import { withDbRetry } from '@/lib/db-retry'

// delaysMs: [] keeps the tests fast + deterministic while still exercising the
// retry COUNT and propagation behavior.
const NO_DELAY: number[] = []

describe('withDbRetry', () => {
  it('returns immediately on first success (no retry)', async () => {
    const fn = vi.fn().mockResolvedValue('ok')
    await expect(withDbRetry(fn, 3, NO_DELAY)).resolves.toBe('ok')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('succeeds after transient failures, returning the eventual value', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('neon blip 1'))
      .mockRejectedValueOnce(new Error('neon blip 2'))
      .mockResolvedValue('recovered')
    await expect(withDbRetry(fn, 3, NO_DELAY)).resolves.toBe('recovered')
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('re-throws the last error after exhausting all attempts (sustained outage still 500s)', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('neon down'))
    await expect(withDbRetry(fn, 3, NO_DELAY)).rejects.toThrow('neon down')
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('respects a custom attempt count', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('x'))
    await expect(withDbRetry(fn, 1, NO_DELAY)).rejects.toThrow('x')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('waits between attempts when delays are configured', async () => {
    vi.useFakeTimers()
    try {
      const fn = vi.fn().mockRejectedValueOnce(new Error('blip')).mockResolvedValue('ok')
      const p = withDbRetry(fn, 3, [50])
      // First attempt rejects synchronously-ish; advance the backoff timer.
      await vi.advanceTimersByTimeAsync(50)
      await expect(p).resolves.toBe('ok')
      expect(fn).toHaveBeenCalledTimes(2)
    } finally {
      vi.useRealTimers()
    }
  })
})
