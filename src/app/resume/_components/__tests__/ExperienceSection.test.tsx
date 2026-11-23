import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { experience } from '../../data/constants'
import { ExperienceSection } from '../ExperienceSection'

function cards(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>('div.rounded-2xl.border'))
}

describe('ExperienceSection', () => {
  it('renders title, company, location and period inside one card per role', () => {
    const { container } = render(<ExperienceSection />)
    const all = cards(container)
    expect(all).toHaveLength(experience.length)
    all.forEach((card, i) => {
      const job = experience[i]!
      expect(card.querySelector('h3')?.textContent).toBe(job.title)
      expect(card.textContent).toContain(job.company)
      expect(card.textContent).toContain(job.location)
      expect(card.textContent).toContain(job.period)
    })
    for (const h3 of container.querySelectorAll('h3')) {
      expect(h3.closest('div.rounded-2xl.border')).not.toBeNull()
    }
  })

  it('renders the current role compact with a Current pill and no body', () => {
    const { container } = render(<ExperienceSection />)
    const card = cards(container).find((c) => c.textContent?.includes('HomeVestors'))!
    expect(card.className).toContain('p-6')
    expect(card.className).not.toContain('p-8')
    const pill = Array.from(card.querySelectorAll('span')).find(
      (s) => s.textContent?.trim() === 'Current'
    )!
    for (const c of [
      'rounded-full',
      'text-secondary',
      'bg-secondary/10',
      'text-xs',
      'font-semibold',
      'uppercase',
    ]) {
      expect(pill.className).toContain(c)
    }
    expect(card.querySelector('ul')).toBeNull()
    expect(card.querySelector('li')).toBeNull()
    expect(card.querySelector('span.rounded-md')).toBeNull()
  })

  it('renders full roles with a bullet list and semibold tags', () => {
    const { container } = render(<ExperienceSection />)
    const card = cards(container).find((c) => c.textContent?.includes('Thryv'))!
    const ul = card.querySelector('ul.list-disc')!
    expect(ul.querySelectorAll('li')).toHaveLength(experience[1]!.description.length)
    expect(container.textContent).not.toContain('•')
    const tag = card.querySelector('span.rounded-md')!
    expect(tag.className).toContain('text-xs')
    expect(tag.className).toContain('font-semibold')
    expect(tag.className).not.toContain('font-medium')
  })

  it('uses a p company, aria-hidden icons and space-y-8', () => {
    const { container } = render(<ExperienceSection />)
    expect(container.querySelector('h4')).toBeNull()
    const card = cards(container)[1]!
    expect(card.querySelector('p.font-semibold.text-foreground')).not.toBeNull()
    const svgs = card.querySelectorAll('svg[aria-hidden="true"]')
    expect(svgs.length).toBe(2)
    expect(container.querySelector('.space-y-8')).not.toBeNull()
  })
})
