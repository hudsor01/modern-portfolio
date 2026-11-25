import { test, expect, type Page, type Request } from '@playwright/test'

/**
 * Contact form without JavaScript (and before hydration).
 *
 * Proves the form is bound to the server action: a native submit is exactly one
 * multipart/form-data document POST to /contact carrying the `$ACTION_` fields,
 * with an empty query string, and never a GET that puts the visitor's PII in the URL.
 *
 * The guard fails closed: every non-GET/HEAD request, to any path on any origin,
 * is aborted at the network layer and recorded, so no email is sent and no
 * contact_submissions row is written even if the form's action ever resolves
 * somewhere other than /contact (a trailing slash, a basePath, `action="/"`, a
 * regression to /api/contact). The assertions then pin the one POST to /contact.
 * Any navigation carrying a query string is recorded as a leak, whatever its path.
 */

type ContactGuard = { posts: Request[]; leakedGets: string[] }

const isMutation = (request: Request) => request.method() !== 'GET' && request.method() !== 'HEAD'

async function guardContactDocument(page: Page): Promise<ContactGuard> {
  const state: ContactGuard = { posts: [], leakedGets: [] }
  // A predicate matching every URL: a glob can miss query-string variants.
  await page.route(
    () => true,
    async (route) => {
      const request = route.request()
      if (isMutation(request)) {
        state.posts.push(request)
        await route.abort()
        return
      }
      if (request.isNavigationRequest() && new URL(request.url()).search !== '') {
        state.leakedGets.push(request.url())
      }
      // fallback, not continue: routes registered before this one (the script
      // abort in the pre-hydration spec) still get to handle GETs.
      await route.fallback()
    }
  )
  return state
}

async function fillValid(page: Page) {
  await page.locator('#name').fill('E2E No-JS User')
  await page.locator('#email').fill('e2e-nojs@example.com')
  await page.locator('#message').fill('Automated no-JS submission test.\nPlease ignore.')
}

async function submitAndExpectDocumentPost(page: Page, state: ContactGuard) {
  await fillValid(page)
  await Promise.all([
    page.waitForEvent('requestfailed', isMutation),
    page.getByRole('button', { name: /send message/i }).click(),
  ])

  expect(state.posts).toHaveLength(1)
  const [post] = state.posts
  if (!post) throw new Error('expected one aborted POST to /contact')
  expect(new URL(post.url()).pathname).toBe('/contact')
  expect(post.method()).toBe('POST')
  expect(post.resourceType()).toBe('document')
  expect(new URL(post.url()).search).toBe('')
  expect(post.headers()['content-type']).toMatch(/^multipart\/form-data/)
  const body = post.postData() ?? ''
  expect(body).toContain('$ACTION_')
  expect(body).toContain('e2e-nojs@example.com')
  expect(state.leakedGets).toEqual([])
}

test.describe('/contact form without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('server-rendered form is bound to the server action and autofills sensibly', async ({
    page,
  }) => {
    await guardContactDocument(page)
    await page.goto('/contact', { waitUntil: 'domcontentloaded' })

    const form = page.locator('form[data-track-location="contact-form"]')
    expect(((await form.getAttribute('method')) ?? '').toLowerCase()).toBe('post')
    expect(await form.getAttribute('enctype')).toBe('multipart/form-data')
    const action = await form.getAttribute('action')
    if (action !== null) expect(new URL(action, 'http://localhost').search).toBe('')
    await expect(form.locator('input[type="hidden"][name^="$ACTION_"]').first()).toBeAttached()

    await expect(page.locator('#name')).toHaveAttribute('autocomplete', 'name')
    await expect(page.locator('#email')).toHaveAttribute('autocomplete', 'email')
    await expect(page.locator('#company')).toHaveAttribute('autocomplete', 'organization')
    await expect(page.locator('#phone')).toHaveAttribute('autocomplete', 'tel')
    await expect(page.locator('#message')).toHaveAttribute('maxlength', '1000')

    const honeypot = form.locator('input[name="honeypot"]')
    await expect(honeypot).toHaveAttribute('autocomplete', 'off')
    await expect(honeypot).toHaveAttribute('tabindex', '-1')
    expect(await honeypot.evaluate((el) => (el as HTMLInputElement).labels?.length ?? 0)).toBe(0)
    expect(await honeypot.evaluate((el) => el.closest('[aria-hidden="true"]') !== null)).toBe(true)
  })

  test('submits a multipart POST to the server action and never a GET carrying PII', async ({
    page,
  }) => {
    const state = await guardContactDocument(page)
    await page.goto('/contact', { waitUntil: 'domcontentloaded' })
    await submitAndExpectDocumentPost(page, state)
  })
})

test.describe('/contact form before hydration', () => {
  test('submits a multipart POST to the server action and never a GET carrying PII', async ({
    page,
  }) => {
    await page.route('**/_next/static/**', async (route) => {
      if (route.request().resourceType() === 'script') {
        await route.abort()
        return
      }
      await route.continue()
    })
    const state = await guardContactDocument(page)
    await page.goto('/contact', { waitUntil: 'domcontentloaded' })
    await submitAndExpectDocumentPost(page, state)
  })
})
