// @vitest-environment node
import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'
import { config, proxy } from '@/proxy'

const ORIGIN = 'https://richardwhudsonjr.com'
const run = (path: string) => proxy(new NextRequest(`${ORIGIN}${path}`))

describe('proxy lowercase redirect', () => {
  it('308s /About to /about, keeps the query, sends no CSP', () => {
    const res = run('/About?x=Y')
    expect(res.status).toBe(308)
    expect(res.headers.get('location')).toBe(`${ORIGIN}/about?x=Y`)
    expect(res.headers.get('content-security-policy')).toBeNull()
  })

  it('308s /Blog/Some-Post to its lowercase form', () => {
    const res = run('/Blog/Some-Post')
    expect(res.status).toBe(308)
    expect(res.headers.get('location')).toBe(`${ORIGIN}/blog/some-post`)
  })

  it('never redirects off-site for a protocol-relative path', () => {
    const res = run('//Evil.com/Path?q=A')
    expect(res.status).toBe(308)
    expect(new URL(res.headers.get('location') as string).origin).toBe(ORIGIN)
  })

  it('passes lowercase paths through with a CSP', () => {
    const res = run('/about')
    expect(res.headers.get('location')).toBeNull()
    expect(res.headers.get('content-security-policy')).toBeTruthy()
  })

  it.each(['/API/Blog', '/Richard_Hudson_Revenue_Operations.pdf'])('passes %s through', (path) => {
    expect(run(path).headers.get('location')).toBeNull()
  })

  it('keeps the original matcher', () => {
    expect(config.matcher).toEqual([
      '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf)$).*)',
    ])
  })
})
