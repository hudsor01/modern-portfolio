// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup, within, fireEvent } from '@testing-library/react'
import { PILLARS, QUESTIONS } from '@/lib/revops-maturity'
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

describe('RevOpsMaturityScorecard selected option', () => {
  it('marks the selected option with a primary border; unselected options keep border-border', () => {
    render(<RevOpsMaturityScorecard />)
    const first = screen.getAllByRole('radio', { name: '5 Fully' })[0] as HTMLInputElement
    fireEvent.click(first)
    const selected = first.closest('label')
    expect(selected?.className).toContain('border-primary')
    expect(selected?.className).not.toContain('border-border')
    const sibling = screen.getAllByRole('radio', { name: '4 Mostly' })[0]?.closest('label')
    expect(sibling?.className).toContain('border-border')
    expect(sibling?.className).not.toMatch(/(^|\s)border-primary(\s|$)/)
  })
})

describe('RevOpsMaturityScorecard keyboard focus', () => {
  it('shows a ring on the label when its sr-only radio has focus-visible', () => {
    const { container } = render(<RevOpsMaturityScorecard />)
    const label = container.querySelector('fieldset label')
    expect(label?.className).toContain('has-[:focus-visible]:ring-2')
    expect(label?.className).toContain('has-[:focus-visible]:ring-ring')
    expect(label?.className).toContain('has-[:focus-visible]:ring-offset-2')
  })
})

const answerAll = (name: string) => {
  for (const r of screen.getAllByRole('radio', { name })) fireEvent.click(r)
}

const answerPillar = (container: HTMLElement, index: number, name: string) => {
  const fieldset = container.querySelectorAll('fieldset')[index] as HTMLElement
  for (const r of within(fieldset).getAllByRole('radio', { name })) fireEvent.click(r)
}

const PROMPT = 'Answer at least one question in each area to see your level.'

describe('RevOpsMaturityScorecard answering', () => {
  it('starts unanswered with a zero count and no level', () => {
    const { container } = render(<RevOpsMaturityScorecard />)
    expect(screen.getAllByRole('radio').some((r) => (r as HTMLInputElement).checked)).toBe(false)
    expect(screen.getByText(`0 of ${QUESTIONS.length} answered`)).toBeTruthy()
    expect(screen.getByText(PROMPT)).toBeTruthy()
    expect(screen.queryByText('Your next move')).toBeNull()
    expect(container.textContent).not.toContain('Overall score')
    expect(container.textContent?.toLowerCase()).not.toContain('weakest')
    expect(screen.getAllByText('Not answered')).toHaveLength(PILLARS.length)
  })

  it('counts each answer but withholds the level until every pillar has one', () => {
    const { container } = render(<RevOpsMaturityScorecard />)
    fireEvent.click(screen.getAllByRole('radio', { name: '3 Somewhat' })[0] as HTMLElement)
    expect(screen.getByText(`1 of ${QUESTIONS.length} answered`)).toBeTruthy()
    expect(screen.getByText(PROMPT)).toBeTruthy()
    expect(container.textContent).not.toContain('Overall score')
  })

  it('shows the level once each of the four pillars has an answer', () => {
    const { container } = render(<RevOpsMaturityScorecard />)
    for (const fs of Array.from(container.querySelectorAll('fieldset'))) {
      fireEvent.click(
        within(fs as HTMLElement).getAllByRole('radio', { name: '4 Mostly' })[0] as HTMLElement
      )
    }
    expect(screen.getByText(`4 of ${QUESTIONS.length} answered`)).toBeTruthy()
    expect(screen.queryByText(PROMPT)).toBeNull()
    expect(container.textContent).toContain('Overall score 4.0 / 5')
    expect(container.textContent).toContain('Managed')
  })

  it('shows no weakest badge when every pillar ties', () => {
    const { container } = render(<RevOpsMaturityScorecard />)
    answerAll('3 Somewhat')
    expect(screen.getByText(`${QUESTIONS.length} of ${QUESTIONS.length} answered`)).toBeTruthy()
    expect(container.textContent?.toLowerCase()).not.toContain('weakest')
    const move = screen.getByText('Your next move').parentElement as HTMLElement
    expect(move.textContent).toContain('All four pillars score 3.0')
    expect(move.textContent).toContain('Raise them together')
    expect(move.textContent).not.toMatch(/lowest|tied/i)
  })

  it('gives no remedial advice when every pillar is at the top of the scale', () => {
    const { container } = render(<RevOpsMaturityScorecard />)
    answerAll('5 Fully')
    expect(container.textContent).toContain('Optimized')
    expect(container.textContent?.toLowerCase()).not.toContain('weakest')
    const move = screen.getByText('Your next move').parentElement as HTMLElement
    expect(move.textContent).toContain('top of the scale')
    expect(move.textContent).not.toMatch(/lowest|tied|document the process|clean the data/i)
  })

  it('gives no weakest badge or remedial advice when the lowest pillar is in the Optimized band', () => {
    const { container } = render(<RevOpsMaturityScorecard />)
    answerAll('5 Fully')
    fireEvent.click(screen.getAllByRole('radio', { name: '4 Mostly' })[0] as HTMLElement)
    expect(container.textContent).toContain('Optimized')
    expect(container.textContent).toContain('4.8') // Process 4.75
    expect(container.textContent?.toLowerCase()).not.toContain('weakest')
    const move = screen.getByText('Your next move').parentElement as HTMLElement
    expect(move.textContent).toContain('no weak pillar to fix')
    expect(move.textContent).not.toMatch(
      /lowest|tied|before you buy|document your sales stages|document the process/i
    )
  })

  it('badges exactly one pillar once a single pillar is uniquely lowest', () => {
    const { container } = render(<RevOpsMaturityScorecard />)
    answerAll('3 Somewhat')
    fireEvent.click(screen.getAllByRole('radio', { name: '1 Not at all' })[0] as HTMLElement)
    const badges = Array.from(container.querySelectorAll('span')).filter(
      (s) => s.textContent === 'weakest'
    )
    expect(badges).toHaveLength(1)
  })

  it('tie advice names only the tied pillars', () => {
    const { container } = render(<RevOpsMaturityScorecard />)
    answerPillar(container, 0, '5 Fully')
    for (const i of [1, 2, 3]) answerPillar(container, i, '1 Not at all')
    const move = screen.getByText('Your next move').parentElement as HTMLElement
    expect(move.textContent).toContain('Data, Technology and Alignment')
    expect(move.textContent).not.toMatch(/process/i)
  })

  it('Reset answers returns to unanswered', () => {
    render(<RevOpsMaturityScorecard />)
    answerAll('2 Rarely')
    fireEvent.click(screen.getByRole('button', { name: 'Reset answers' }))
    expect(screen.getByText(`0 of ${QUESTIONS.length} answered`)).toBeTruthy()
    expect(screen.getAllByRole('radio').some((r) => (r as HTMLInputElement).checked)).toBe(false)
    expect(screen.getByText(PROMPT)).toBeTruthy()
  })

  it('a near-Optimized weakest pillar gets refine advice, not the basics', () => {
    const { container } = render(<RevOpsMaturityScorecard />)
    answerAll('5 Fully')
    answerPillar(container, 0, '4 Mostly')
    const move = screen.getByText('Your next move').parentElement as HTMLElement
    expect(move.textContent).toContain(
      'Tighten stage exit criteria and audit them quarterly against won and lost deals'
    )
    expect(move.textContent).not.toMatch(/Document your sales stages|before you buy/)
  })

  it('announces only the level: the answered count and scores sit outside the live region', () => {
    const { container } = render(<RevOpsMaturityScorecard />)
    const region = screen.getByRole('region', { name: 'Your result' })
    const live = region.querySelectorAll('[aria-live]')
    expect(live).toHaveLength(1)
    expect(container.querySelectorAll('[aria-live]')).toHaveLength(1)
    expect(live[0]?.textContent).toBe(PROMPT)
    fireEvent.click(screen.getAllByRole('radio', { name: '3 Somewhat' })[0] as HTMLElement)
    expect(live[0]?.textContent).toBe(PROMPT)
    expect(live[0]?.textContent).not.toMatch(/answered/)
    answerAll('4 Mostly')
    expect(live[0]?.textContent).toBe('4Managed')
    expect(live[0]?.textContent).not.toMatch(/answered|Overall score/)
  })

  it('makes no percentile or B2B-teams claim', () => {
    const { container } = render(<RevOpsMaturityScorecard />)
    answerAll('3 Somewhat')
    expect(container.textContent).not.toMatch(/percentile|B2B teams/i)
  })
})
