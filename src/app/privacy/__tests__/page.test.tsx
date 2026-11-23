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
  ])('does not contain the false line "%s"', (line) => {
    expect(text).not.toContain(line)
  })

  it('has a bumped ISO policy date', () => {
    expect(PRIVACY_POLICY_LAST_UPDATED).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(PRIVACY_POLICY_LAST_UPDATED > '2026-11-09').toBe(true)
  })

  it('has a short description that mentions storage', () => {
    const description = String(metadata.description)
    expect(description.length).toBeLessThanOrEqual(160)
    expect(description).toContain('stored')
  })
})
