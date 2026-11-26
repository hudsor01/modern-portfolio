// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/components/layout/navbar', () => ({ Navbar: () => null }))
vi.mock('../../resume-viewer', () => ({ ResumeViewer: () => null }))
vi.mock('@/hooks/use-in-view', () => ({ useInView: () => true }))

import ResumePageContent from '../resume-page-content'

function contentWrapper(container: HTMLElement): HTMLElement {
  const about = [...container.querySelectorAll('h2')].find((h) => h.textContent?.trim() === 'About')
  const wrapper = about?.closest('section')?.parentElement
  if (!wrapper) throw new Error('résumé content wrapper not found')
  return wrapper
}

describe('résumé PDF preview and print', () => {
  it('renders the résumé without a preview by default', () => {
    const { container } = render(<ResumePageContent />)
    const classes = contentWrapper(container).classList
    expect(classes.contains('hidden')).toBe(false)
    expect(classes.contains('print:block')).toBe(false)
    expect(container.querySelector('[data-resume-preview]')).toBeNull()
  })

  it('keeps the résumé printable while the preview is open', () => {
    const { container } = render(<ResumePageContent />)
    fireEvent.click(screen.getByRole('button', { name: 'Preview PDF' }))

    const classes = contentWrapper(container).classList
    expect(classes.contains('hidden')).toBe(true)
    expect(classes.contains('print:block')).toBe(true)
    const preview = container.querySelector('[data-resume-preview]')
    expect(preview?.classList.contains('print:hidden')).toBe(true)

    fireEvent.click(screen.getByRole('button', { name: 'Preview PDF' }))
    expect(contentWrapper(container).classList.contains('hidden')).toBe(false)
    expect(container.querySelector('[data-resume-preview]')).toBeNull()
  })
})
