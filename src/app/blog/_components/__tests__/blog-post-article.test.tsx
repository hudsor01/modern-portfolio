// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react'
import { TIMING_CONSTANTS } from '@/lib/ui-thresholds'

const { errorMock } = vi.hoisted(() => ({ errorMock: vi.fn() }))
vi.mock('@/lib/logger', () => ({
  createContextLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: errorMock,
  }),
}))

import { BlogPostArticle } from '../blog-post-article'

const writeText = vi.fn<(text: string) => Promise<void>>()

function fence(code: string, language = 'ts') {
  return `\`\`\`${language}\n${code}\n\`\`\``
}

async function click(el: HTMLElement) {
  // copyToClipboard awaits writeText before setting state; flush that promise.
  await act(async () => {
    fireEvent.click(el)
  })
}

beforeEach(() => {
  cleanup()
  writeText.mockResolvedValue(undefined)
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  })
})

afterEach(() => {
  vi.useRealTimers()
})

describe('BlogPostArticle code blocks', () => {
  it('renders a fenced block with its language class and decoded source', () => {
    const { container } = render(
      <BlogPostArticle content={fence('if (a < b && c > d) {}')} contentType="MARKDOWN" />
    )
    const code = container.querySelector('pre > code')
    expect(code?.className).toBe('language-ts')
    expect(code?.textContent).toBe('if (a < b && c > d) {}')
  })

  it('copies the block source and announces the copied state', async () => {
    render(<BlogPostArticle content={fence('const x = 1')} contentType="MARKDOWN" />)
    await click(screen.getByRole('button', { name: 'Copy code' }))
    expect(writeText).toHaveBeenCalledWith('const x = 1')
    expect(screen.getByRole('button', { name: 'Copied' })).toBeTruthy()
  })

  // Regression: CodeBlock used to be declared inside BlogPostArticle, so each
  // copy click re-rendered the article with a brand-new component type and
  // React remounted every code block (focus on the button was lost).
  it('keeps the same DOM nodes across a copy click instead of remounting', async () => {
    const { container } = render(
      <BlogPostArticle content={fence('const x = 1')} contentType="MARKDOWN" />
    )
    const pre = container.querySelector('pre')
    const button = screen.getAllByRole('button')[0] as HTMLElement
    button.focus()

    await click(button)

    expect(container.querySelector('pre')).toBe(pre)
    expect(screen.getAllByRole('button')[0]).toBe(button)
    expect(document.activeElement).toBe(button)
  })

  // Regression: copied state was keyed by the code string, so every block
  // with identical source flipped to "copied" together.
  it('marks only the clicked block as copied when two blocks share source', async () => {
    const md = `${fence('npm install')}\n\ntext\n\n${fence('npm install')}`
    render(<BlogPostArticle content={md} contentType="MARKDOWN" />)
    await click(screen.getAllByRole('button')[0] as HTMLElement)

    // Re-query so this pins per-block state independently of node identity.
    const [first, second] = screen.getAllByRole('button') as [HTMLElement, HTMLElement]
    expect(first.getAttribute('aria-label')).toBe('Copied')
    expect(second.getAttribute('aria-label')).toBe('Copy code')
  })

  // Regression: the button was hover-only (opacity-0 until group-hover), so a
  // keyboard user tabbing to it focused an invisible control.
  it('shows the copy button on keyboard focus, not only on hover', () => {
    render(<BlogPostArticle content={fence('const x = 1')} contentType="MARKDOWN" />)
    const { classList } = screen.getByRole('button', { name: 'Copy code' })
    expect(classList).toContain('opacity-0')
    expect(classList).toContain('focus-visible:opacity-100')
  })

  it('swaps the visible icon with the copied state', async () => {
    render(<BlogPostArticle content={fence('const x = 1')} contentType="MARKDOWN" />)
    const button = screen.getByRole('button', { name: 'Copy code' })
    expect(button.querySelector('svg.lucide-copy')).not.toBeNull()

    await click(button)

    expect(button.querySelector('svg.lucide-check')).not.toBeNull()
    expect(button.querySelector('svg.lucide-copy')).toBeNull()
  })

  it('reverts to the copy state after the display window', async () => {
    vi.useFakeTimers()
    render(<BlogPostArticle content={fence('const x = 1')} contentType="MARKDOWN" />)
    await click(screen.getByRole('button', { name: 'Copy code' }))
    expect(screen.getByRole('button', { name: 'Copied' })).toBeTruthy()

    act(() => {
      vi.advanceTimersByTime(TIMING_CONSTANTS.CLIPBOARD_COPY_DISPLAY)
    })

    expect(screen.getByRole('button', { name: 'Copy code' })).toBeTruthy()
  })

  it('stays copied for the full window and restarts it on a second click', async () => {
    vi.useFakeTimers()
    const displayMs = TIMING_CONSTANTS.CLIPBOARD_COPY_DISPLAY
    render(<BlogPostArticle content={fence('const x = 1')} contentType="MARKDOWN" />)
    const button = screen.getByRole('button', { name: 'Copy code' })

    await click(button)
    act(() => {
      vi.advanceTimersByTime(displayMs - 1)
    })
    expect(button.getAttribute('aria-label')).toBe('Copied')

    // Without clearing the first timer, it would fire 1ms from now.
    await click(button)
    expect(vi.getTimerCount()).toBe(1)
    act(() => {
      vi.advanceTimersByTime(displayMs - 1)
    })
    expect(button.getAttribute('aria-label')).toBe('Copied')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(button.getAttribute('aria-label')).toBe('Copy code')
  })

  it('clears the pending reset timer on unmount', async () => {
    vi.useFakeTimers()
    const { unmount } = render(
      <BlogPostArticle content={fence('const x = 1')} contentType="MARKDOWN" />
    )
    await click(screen.getByRole('button', { name: 'Copy code' }))
    expect(vi.getTimerCount()).toBe(1)

    unmount()

    expect(vi.getTimerCount()).toBe(0)
  })

  it('logs and stays in the copy state when the clipboard write fails', async () => {
    writeText.mockRejectedValueOnce(new Error('denied'))
    render(<BlogPostArticle content={fence('const x = 1')} contentType="MARKDOWN" />)

    await click(screen.getByRole('button', { name: 'Copy code' }))

    expect(errorMock).toHaveBeenCalledWith('Failed to copy code', expect.any(Error))
    expect(screen.getByRole('button', { name: 'Copy code' })).toBeTruthy()
  })

  it('renders no copy button when allowCopy is false', () => {
    render(
      <BlogPostArticle content={fence('const x = 1')} contentType="MARKDOWN" allowCopy={false} />
    )
    expect(screen.queryByRole('button')).toBeNull()
  })
})

describe('BlogPostArticle leading title (B-3)', () => {
  it('drops a body heading that repeats the post title and keeps the rest', () => {
    const { container } = render(
      <BlogPostArticle
        content={'# My Post\n\nIntro text.\n\n## Real section'}
        contentType="MARKDOWN"
        title="My Post"
      />
    )
    const headings = Array.from(container.querySelectorAll('h2,h3')).map((h) => h.textContent)
    expect(headings).toEqual(['Real section'])
    expect(container.textContent).toContain('Intro text.')
  })

  it('renders every heading when no title is supplied', () => {
    const { container } = render(
      <BlogPostArticle content={'# My Post\n\nText'} contentType="MARKDOWN" />
    )
    expect(container.querySelector('h2')?.textContent).toBe('My Post')
  })
})
