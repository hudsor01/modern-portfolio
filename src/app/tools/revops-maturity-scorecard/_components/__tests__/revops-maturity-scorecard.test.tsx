// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup, within } from '@testing-library/react'
import { PILLARS } from '@/lib/revops-maturity'
import { RevOpsMaturityScorecard } from '../revops-maturity-scorecard'

afterEach(async () => {
  cleanup()
  await new Promise((resolve) => setTimeout(resolve, 0))
})

const SCALE_NAMES = ['1 Not at all', '2 Rarely', '3 Somewhat', '4 Mostly', '5 Fully']

describe('RevOpsMaturityScorecard layout', () => {
  it('lays each legend out inside its fieldset (float-left) with a clearing content wrapper', () => {
    const { container } = render(<RevOpsMaturityScorecard />)
    const fieldsets = container.querySelectorAll('fieldset')
    expect(fieldsets.length).toBe(PILLARS.length)
    for (const fs of fieldsets) {
      const legend = fs.querySelector(':scope > legend')
      expect(legend?.className).toContain('float-left')
      expect(legend?.className).toContain('w-full')
      const content = legend?.nextElementSibling
      expect(content?.className).toContain('clear-both')
    }
  })

  it('gives every radio the full accessible name "<n> <label>"', () => {
    render(<RevOpsMaturityScorecard />)
    const radios = screen.getAllByRole('radio')
    expect(radios.length % 5).toBe(0)
    const names = radios.map((r) => r.getAttribute('aria-label'))
    for (let i = 0; i < radios.length; i++) {
      expect(names[i]).toBe(SCALE_NAMES[i % 5])
    }
    expect(screen.getAllByRole('radio', { name: '1 Not at all' }).length).toBe(radios.length / 5)
  })

  it('hides the word label below sm and shows it from sm up', () => {
    const { container } = render(<RevOpsMaturityScorecard />)
    const word = container.querySelector('label span.hidden')
    expect(word?.className).toContain('sm:block')
  })

  it('renders the scale key once per pillar, mobile only, from SCALE', () => {
    const { container } = render(<RevOpsMaturityScorecard />)
    const keys = Array.from(container.querySelectorAll('fieldset')).map((fs) =>
      within(fs as HTMLElement).getAllByText(SCALE_NAMES.join(' · '))
    )
    for (const k of keys) {
      expect(k.length).toBe(1)
      expect(k[0]?.className).toContain('sm:hidden')
      expect(k[0]?.className).toContain('text-xs')
    }
    expect(keys.length).toBe(PILLARS.length)
  })
})
