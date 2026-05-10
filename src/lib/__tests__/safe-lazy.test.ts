// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'

const { warnMock } = vi.hoisted(() => ({ warnMock: vi.fn() }))
vi.mock('@/lib/logger', () => ({
  createContextLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: warnMock,
    error: vi.fn(),
  }),
}))

import { safeLazy } from '@/lib/safe-lazy'

const Fallback = () => null

describe('safeLazy', () => {
  beforeEach(() => {
    warnMock.mockClear()
  })

  it('returns the imported module on success (no warn)', async () => {
    const Real = () => null
    const importer = () => Promise.resolve({ default: Real })
    const wrapped = safeLazy(importer, 'good', Fallback)
    const result = await wrapped()
    expect(result.default).toBe(Real)
    expect(warnMock).not.toHaveBeenCalled()
  })

  it('returns the fallback module + logs a warning on rejection', async () => {
    const importer = () => Promise.reject(new Error('chunk missing'))
    const wrapped = safeLazy(importer, 'bad-label', Fallback)
    const result = await wrapped()
    expect(result.default).toBe(Fallback)
    expect(warnMock).toHaveBeenCalledTimes(1)
    expect(warnMock.mock.calls[0]?.[0]).toBe('Chunk load failed')
    expect(warnMock.mock.calls[0]?.[1]).toMatchObject({
      label: 'bad-label',
      error: 'chunk missing',
    })
  })

  it('coerces non-Error rejection to a string in the log payload', async () => {
    const importer = () => Promise.reject('not an error')
    const wrapped = safeLazy(importer, 'lbl', Fallback)
    await wrapped()
    expect(warnMock.mock.calls[0]?.[1]).toMatchObject({ error: 'not an error' })
  })
})
