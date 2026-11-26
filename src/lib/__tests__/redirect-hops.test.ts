// @vitest-environment node
/**
 * Hop simulator: the guard that proves W1 (one 308 per URL) without a deploy.
 *
 * Request flow per hop, in Next's documented order: next.config `redirects()`
 * first, then the proxy (src/proxy.ts -> resolveSingleHop). Next's built-in
 * trailing-slash redirect is off (`skipTrailingSlashRedirect: true`), so it is
 * not a step. Config redirects match a source with or without one trailing
 * slash; on Vercel they match it case-sensitively, under local `next start`
 * case-insensitively. The local e2e server therefore cannot show Vercel's
 * double hop, so both models are simulated here.
 */
import { describe, expect, it } from 'vitest'
import { CONTACT } from '@/lib/contact-info'
import { resolveSingleHop } from '@/lib/redirect-resolve'
import { REDIRECT_MAP, REDIRECTS } from '@/lib/redirects'

type Model = 'vercel' | 'local'
type Target =
  | { kind: 'internal'; pathname: string; search: string }
  | { kind: 'external'; href: string }

const MAX_STEPS = 3

function toTarget(destination: string, search: string): Target {
  return destination.startsWith('https://')
    ? { kind: 'external', href: `${destination}${search}` }
    : { kind: 'internal', pathname: destination, search }
}

function configStep(model: Model, pathname: string, search: string): Target | null {
  const candidate = model === 'local' ? pathname.toLowerCase() : pathname
  for (const { source, destination } of REDIRECTS) {
    if (candidate === source || candidate === `${source}/`) return toTarget(destination, search)
  }
  return null
}

function step(model: Model, pathname: string, search: string): Target | null {
  return configStep(model, pathname, search) ?? resolveSingleHop(pathname, search, REDIRECT_MAP)
}

const show = (target: Target) =>
  target.kind === 'external' ? target.href : `${target.pathname}${target.search}`

function follow(model: Model, pathname: string, search: string) {
  let current: Target = { kind: 'internal', pathname, search }
  const chain = [show(current)]
  let hops = 0
  while (current.kind === 'internal' && hops < MAX_STEPS) {
    const next = step(model, current.pathname, current.search)
    if (next === null) break
    current = next
    hops += 1
    chain.push(show(current))
  }
  return { final: current, hops, chain }
}

const titleCase = (path: string) =>
  path
    .split('/')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('/')

function variants(path: string): string[] {
  const cased = [path, path.toUpperCase(), titleCase(path)]
  const slashed = cased.flatMap((p) => (p === '/' ? [p] : [p, `${p}/`]))
  return [...new Set(slashed)]
}

const QUERIES = ['', '?page=0', '?ref=QA']
const PATHS = [...REDIRECTS.map(({ source }) => source), '/about', '/blog/some-post', '/blog', '/']
const MODELS: Model[] = ['vercel', 'local']

describe.each(MODELS)('redirect hops (%s model)', (model) => {
  it('answers every variant in at most one hop and stops at a fixed point', () => {
    const failures: string[] = []
    for (const path of PATHS) {
      for (const variant of variants(path)) {
        for (const query of QUERIES) {
          const { final, hops, chain } = follow(model, variant, query)
          const fixed =
            final.kind === 'external' ||
            (configStep(model, final.pathname, final.search) === null &&
              resolveSingleHop(final.pathname, final.search, REDIRECT_MAP) === null)
          if (hops > 1 || !fixed) failures.push(`${variant}${query}: ${chain.join(' -> ')}`)
        }
      }
    }
    expect(failures, failures.join('\n')).toEqual([])
  })

  it('sends every /blog ?page=0 variant to /blog without a page param', () => {
    for (const variant of variants('/blog')) {
      const { final, chain } = follow(model, variant, '?page=0')
      expect(show(final), chain.join(' -> ')).toBe('/blog')
    }
  })

  it.each([
    ['/Home', '', '/'],
    ['/HOME/', '', '/'],
    ['/home/', '', '/'],
    ['/About/', '?ref=QA', '/about?ref=QA'],
    ['/Blog/', '?page=abc&q=x', '/blog?q=x'],
    [
      '/blog/Revenue-Operations-Best-Practices-Complete-Guide/',
      '',
      '/blog/complete-guide-revenue-operations-strategy',
    ],
    ['/Github/', '?x=1', `${CONTACT.github.url}?x=1`],
    ['/github', '?x=1', `${CONTACT.github.url}?x=1`],
    ['/Linkedin/', '', CONTACT.linkedin.url],
  ])('%s%s ends at %s in one hop', (pathname, search, expected) => {
    const { final, hops, chain } = follow(model, pathname, search)
    expect(hops, chain.join(' -> ')).toBe(1)
    expect(show(final)).toBe(expected)
  })
})
