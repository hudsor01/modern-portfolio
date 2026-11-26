// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

vi.mock('@/components/layout/navbar', () => ({ Navbar: () => null }))

import ContactSentPage, { dynamic, metadata } from '../page'
import { canonicalUrl } from '@/lib/absolute-url'

const html = renderToStaticMarkup(<ContactSentPage />)

describe('/contact/sent page', () => {
  it('is static and noindex', () => {
    expect(dynamic).toBe('force-static')
    expect(metadata.robots).toEqual({ index: false, follow: true })
    expect(metadata.alternates?.canonical).toBe(canonicalUrl('/contact/sent'))
  })

  it('confirms the message in one h1 inside the focusable main landmark', () => {
    expect(html).toMatch(/<main id="main-content" tabindex="-1"/)
    expect([...html.matchAll(/<h1[^>]*>(.*?)<\/h1>/g)].map((m) => m[1])).toEqual(['Message sent'])
  })

  it('links back home and to /contact', () => {
    expect(html).toContain('href="/"')
    expect(html).toContain('href="/contact"')
  })
})
