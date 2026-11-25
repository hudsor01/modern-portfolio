// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { z } from 'zod'

// Zod 4 probes `new Function('')` for JIT; under our CSP (no 'unsafe-eval') that is
// a reported violation on /contact. schemas.ts must turn the JIT off in the browser.
describe('schemas in the browser', () => {
  it('disables zod JIT so no eval probe runs under the CSP', async () => {
    await import('@/lib/schemas')
    expect(z.config().jitless).toBe(true)
  })
})
