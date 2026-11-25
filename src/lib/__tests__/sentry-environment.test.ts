// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { resolveEnvironment } from '../../../sentry.shared'

describe('resolveEnvironment', () => {
  it('prefers the explicit override', () => {
    expect(resolveEnvironment('staging', 'production', 'production')).toBe('staging')
  })

  it("uses Vercel's environment on a deployment", () => {
    expect(resolveEnvironment(undefined, 'production', 'production')).toBe('production')
    expect(resolveEnvironment(undefined, 'preview', 'production')).toBe('preview')
  })

  it('labels a production build served off Vercel as local, never production', () => {
    expect(resolveEnvironment(undefined, undefined, 'production')).toBe('local')
    expect(resolveEnvironment('', '', 'production')).toBe('local')
  })

  it('keeps development for next dev and defaults when NODE_ENV is unset', () => {
    expect(resolveEnvironment(undefined, undefined, 'development')).toBe('development')
    expect(resolveEnvironment(undefined, undefined, '')).toBe('development')
  })
})
