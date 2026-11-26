import { expect, test } from '@playwright/test'

interface Group {
  agents: string[]
  allow: string[]
  disallow: string[]
}

/** Parse robots.txt into groups: blank-line separated blocks of directives. */
function parseGroups(body: string): Group[] {
  const groups: Group[] = []
  for (const block of body.split(/\r?\n\s*\r?\n/)) {
    const group: Group = { agents: [], allow: [], disallow: [] }
    for (const line of block.split(/\r?\n/)) {
      const idx = line.indexOf(':')
      if (idx === -1) continue
      const key = line.slice(0, idx).trim().toLowerCase()
      const value = line.slice(idx + 1).trim()
      if (key === 'user-agent') group.agents.push(value)
      else if (key === 'allow') group.allow.push(value)
      else if (key === 'disallow') group.disallow.push(value)
    }
    if (group.agents.length > 0) groups.push(group)
  }
  return groups
}

test.describe('robots.txt', () => {
  test('serves per-group rules', async ({ request }) => {
    const response = await request.get('/robots.txt')
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('text/plain')

    const body = await response.text()
    const groups = parseGroups(body)
    const groupFor = (ua: string) => groups.find((g) => g.agents.includes(ua))

    for (const ua of [
      'Googlebot',
      'Bingbot',
      'Twitterbot',
      'LinkedInBot',
      'facebookexternalhit',
      '*',
    ]) {
      const group = groupFor(ua)
      expect(group, `group for ${ua}`).toBeDefined()
      for (const path of ['/api/', '/admin/']) {
        expect(group?.disallow, `${ua} disallow`).toContain(path)
      }
      // Named search/social crawlers may fetch /_next/ (rendering, Google
      // Images); only the default group is kept out of it.
      if (ua === '*') expect(group?.disallow, '* disallow').toContain('/_next/')
      else expect(group?.disallow, `${ua} disallow`).not.toContain('/_next/')
      for (const path of ['/', '/api/og', '/api/blog/rss']) {
        expect(group?.allow, `${ua} allow`).toContain(path)
      }
    }

    for (const ua of ['GPTBot', 'ClaudeBot', 'Google-Extended', 'AhrefsBot']) {
      const group = groupFor(ua)
      expect(group, `group for ${ua}`).toBeDefined()
      expect(group?.disallow, `${ua} disallow`).toContain('/')
      expect(group?.allow, `${ua} allow`).toEqual([])
    }

    expect(body).toContain('Sitemap: https://richardwhudsonjr.com/sitemap.xml')
  })
})
