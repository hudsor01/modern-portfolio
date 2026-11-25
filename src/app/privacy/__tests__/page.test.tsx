// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

vi.mock('@/components/layout/navbar', () => ({ Navbar: () => null }))
vi.mock('@/components/seo/json-ld/breadcrumb-json-ld', () => ({ BreadcrumbListJsonLd: () => null }))

import PrivacyPage, { metadata } from '../page'
import { PRIVACY_POLICY_LAST_UPDATED } from '../policy-date'

function decode(s: string): string {
  return s
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/<[^>]+>/g, '')
}

const html = renderToStaticMarkup(<PrivacyPage />)
const text = decode(html.replace(/<\/(p|li|h2)>/g, ' '))
const headings = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)].map((m) => decode(m[1] ?? ''))

describe('/privacy page', () => {
  it('has the required h2 sections in order', () => {
    expect(headings).toEqual([
      'The contact form',
      'Legal basis',
      'Visit statistics',
      'Error monitoring',
      'Cookies',
      'Hosting',
      'Processors',
      'How long data is kept',
      'Your choices',
      'Changes',
    ])
  })

  it.each([
    '6(1)(f)',
    'legitimate interest',
    '24 months',
    'within 30 days',
    'I delete contact emails from my inbox within 24 months',
    'Resend',
    'Neon',
    'Vercel',
    'Sentry',
  ])('states "%s"', (fact) => {
    expect(text).toContain(fact)
  })

  it.each([
    'does not save submissions to a database',
    'not kept anywhere',
    'sets no automatic deletion period',
    'until I delete them',
    'Contact emails are deleted from my inbox',
  ])('does not contain the false line "%s"', (line) => {
    expect(text).not.toContain(line)
  })

  it('has a bumped ISO policy date', () => {
    expect(PRIVACY_POLICY_LAST_UPDATED).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    // 2026-11-24: anonymous action events (src/components/analytics/*) disclosed.
    expect(PRIVACY_POLICY_LAST_UPDATED >= '2026-11-24').toBe(true)
  })

  it('discloses the anonymous action events and that typed input is never recorded', () => {
    expect(text).toContain('It also records a few anonymous actions')
    expect(text).toContain('Nothing you type into a tool or the form is recorded.')
    expect(text).toContain('never the address')
    expect(text).toContain('opening a page that doesn’t exist')
    expect(text).toContain('Opening an article adds one to that count')
  })

  it('has a short description that mentions storage', () => {
    const description = String(metadata.description)
    expect(description.length).toBeLessThanOrEqual(160)
    expect(description).toContain('stored')
  })

  it('puts every running-text link on the shared text-link utility', () => {
    const anchors = [...html.matchAll(/<a\b[^>]*>/g)].map((m) => m[0])
    const external = anchors.filter((a) => a.includes('target="_blank"'))
    const mailto = anchors.filter((a) => a.includes('href="mailto:'))
    expect(external.length).toBeGreaterThan(0)
    expect(mailto.length).toBeGreaterThan(0)
    const back = anchors.filter((a) => a.includes('href="/contact"'))
    expect(back).toHaveLength(1)
    for (const a of [...external, ...mailto, ...back]) {
      expect(a).toMatch(/class="text-link"/)
      expect(a).not.toContain('underline-offset-4')
      expect(a).not.toContain('hover:text-primary/80')
    }
  })
})
