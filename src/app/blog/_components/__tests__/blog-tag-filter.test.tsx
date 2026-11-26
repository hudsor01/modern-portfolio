// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { BlogTagFilter } from '../blog-tag-filter'

const tags = ['All', 'RevOps', 'Sales']
const pressed = (name: RegExp) => screen.getByRole('button', { name }).getAttribute('aria-pressed')

describe('BlogTagFilter', () => {
  afterEach(() => cleanup())

  it('marks only the selected tag as pressed', () => {
    render(<BlogTagFilter tags={tags} selectedTag="All" onTagChange={vi.fn()} />)
    expect(pressed(/^All\b/)).toBe('true')
    expect(pressed(/^RevOps\b/)).toBe('false')
    expect(pressed(/^Sales\b/)).toBe('false')
  })

  it('calls onTagChange once with the clicked tag', () => {
    const onTagChange = vi.fn()
    render(<BlogTagFilter tags={tags} selectedTag="All" onTagChange={onTagChange} />)
    fireEvent.click(screen.getByRole('button', { name: /^RevOps\b/ }))
    expect(onTagChange).toHaveBeenCalledTimes(1)
    expect(onTagChange).toHaveBeenCalledWith('RevOps')
  })

  it('flips aria-pressed when the selected tag changes', () => {
    const { rerender } = render(
      <BlogTagFilter tags={tags} selectedTag="All" onTagChange={vi.fn()} />
    )
    rerender(<BlogTagFilter tags={tags} selectedTag="RevOps" onTagChange={vi.fn()} />)
    expect(pressed(/^RevOps\b/)).toBe('true')
    expect(pressed(/^All\b/)).toBe('false')
  })

  it('renders type=button buttons and the tag count', () => {
    render(
      <BlogTagFilter tags={tags} selectedTag="All" tagCounts={{ All: 25 }} onTagChange={vi.fn()} />
    )
    for (const b of screen.getAllByRole('button')) expect(b.getAttribute('type')).toBe('button')
    // jsdom concatenates the flex-item spans without a space ("All25"), so no word boundary here
    expect(screen.getByRole('button', { name: /^All/ }).textContent).toBe('All25')
  })
})
