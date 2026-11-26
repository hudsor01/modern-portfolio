import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { buildEnhancedCSP } from '../csp-edge'

function knownGapsSection(): string {
  const md = readFileSync(join(process.cwd(), 'SECURITY.md'), 'utf8')
  const start = md.indexOf('## Known gaps / follow-ups')
  expect(start).toBeGreaterThanOrEqual(0)
  const rest = md.slice(start + 1)
  const next = rest.search(/\n## /)
  const section = next === -1 ? rest : rest.slice(0, next)
  // SECURITY.md hard-wraps lines; collapse whitespace so phrases match.
  return section.replace(/\s+/g, ' ')
}

describe('SEC-01: CSP unsafe-inline decision is recorded and matches the live policy', () => {
  const section = knownGapsSection()

  it('records the decision to keep unsafe-inline in script-src', () => {
    expect(section).toContain("**CSP `script-src` uses `'unsafe-inline'`**")
    expect(section).toContain('accepted')
  })

  it('records the measured inline-script count and the three script kinds', () => {
    expect(section).toContain('3 inline scripts')
    expect(section).toContain('chunk bootstrap')
    expect(section).toContain('`__next_f`')
    expect(section).toContain('RSC flight payload')
  })

  it('records the re-evaluation trigger', () => {
    expect(section).toMatch(/Revisit if Next\.js emits CSP hashes.*dynamic rendering/)
  })

  it('live production script-src keeps unsafe-inline with no nonce and no unsafe-eval', () => {
    const csp = buildEnhancedCSP({ isDev: false, emitUpgradeInsecureRequests: true })
    const scriptSrc = csp.split('; ').find((d) => d.startsWith('script-src '))
    expect(scriptSrc).toBeDefined()
    expect(scriptSrc).toContain("'unsafe-inline'")
    expect(scriptSrc).not.toContain("'nonce-")
    expect(scriptSrc).not.toContain("'unsafe-eval'")
    expect(csp).not.toContain("'nonce-")
  })
})
