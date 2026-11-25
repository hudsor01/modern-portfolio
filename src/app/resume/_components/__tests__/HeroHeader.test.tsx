import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HeroHeader } from '../HeroHeader'

vi.mock('@/components/ui/availability-badge', () => ({ AvailabilityBadge: () => null }))

const base = {
  showPdf: false,
  isDownloading: false,
  onDownloadResume: vi.fn(),
  onToggleView: vi.fn(),
}

describe('HeroHeader', () => {
  afterEach(cleanup)

  it('renders Download PDF as the primary filled button outside any box', () => {
    const { container } = render(<HeroHeader {...base} />)
    const btn = screen.getByRole('button', { name: 'Download PDF' })
    expect(btn.className).toContain('bg-primary')
    expect(btn.className).toContain('text-primary-foreground')
    expect(btn.closest('.bg-muted\\/50')).toBeNull()
    expect(btn.closest('.bg-card')).toBeNull()
    expect(container.innerHTML).not.toContain('hover:scale-105')
    expect(container.innerHTML).not.toContain('border-dashed')
  })

  it('disables the download button while downloading', () => {
    render(<HeroHeader {...base} isDownloading />)
    const btn = screen.getByRole('button', { name: 'Downloading...' })
    expect((btn as HTMLButtonElement).disabled).toBe(true)
  })

  it('renders Preview PDF as an outline toggle', () => {
    const { rerender } = render(<HeroHeader {...base} />)
    const btn = screen.getByRole('button', { name: 'Preview PDF' })
    expect(btn.className).toContain('border')
    expect(btn.className).toContain('bg-background')
    expect(btn.getAttribute('aria-pressed')).toBe('false')
    rerender(<HeroHeader {...base} showPdf />)
    // Toggle pattern: the accessible name stays constant, only aria-pressed flips.
    expect(screen.queryByRole('button', { name: 'Hide preview' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Preview PDF' }).getAttribute('aria-pressed')).toBe(
      'true'
    )
  })

  it("links Let's Connect to /contact", () => {
    render(<HeroHeader {...base} />)
    expect(screen.getByRole('link', { name: "Let's Connect" }).getAttribute('href')).toBe(
      '/contact'
    )
  })

  it('keeps social links hardened with 44px targets', () => {
    render(<HeroHeader {...base} />)
    for (const label of ['Email', 'LinkedIn', 'GitHub', 'Website']) {
      const a = screen.getByLabelText(label)
      expect(a.className).toContain('min-w-[44px]')
      expect(a.className).toContain('min-h-[44px]')
      if (label !== 'Email') {
        expect(a.getAttribute('target')).toBe('_blank')
        expect(a.getAttribute('rel')).toBe('noopener noreferrer')
      }
    }
  })
})
