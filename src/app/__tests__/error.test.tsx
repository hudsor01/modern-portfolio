import { cleanup, render } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

const captureException = vi.hoisted(() => vi.fn())
vi.mock('@sentry/nextjs', () => ({ captureException }))

import ErrorPage from '../error'
import GlobalError from '../global-error'

describe('error boundaries', () => {
  afterEach(async () => {
    cleanup()
    captureException.mockClear()
    // Let queued React scheduler tasks drain before the environment is torn down.
    await new Promise((resolve) => setTimeout(resolve, 0))
  })

  it('route error boundary renders one focusable main and one h1', () => {
    const reset = vi.fn()
    const error = new Error('x')
    const { container } = render(<ErrorPage error={error} reset={reset} />)

    const mains = container.querySelectorAll('main#main-content')
    expect(mains).toHaveLength(1)
    expect(mains[0]?.getAttribute('tabindex')).toBe('-1')

    const h1s = container.querySelectorAll('h1')
    expect(h1s).toHaveLength(1)
    expect(h1s[0]?.textContent).toBe('Something went wrong')
    expect(container.querySelectorAll('h2')).toHaveLength(0)

    expect(captureException).toHaveBeenCalledTimes(1)
    expect(captureException).toHaveBeenCalledWith(error)
  })

  it('global error boundary renders one focusable main and one h1', () => {
    const html = renderToStaticMarkup(<GlobalError error={new Error('x')} reset={vi.fn()} />)
    expect(html.match(/<main id="main-content" tabindex="-1"/g)).toHaveLength(1)
    expect(html.match(/<h1/g)).toHaveLength(1)
  })
})
