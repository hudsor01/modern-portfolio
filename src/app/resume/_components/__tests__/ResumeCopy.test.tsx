import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { YEARS_EXPERIENCE } from '@/lib/stats'
import { certifications } from '../../data/constants'
import { AboutSection } from '../AboutSection'
import { EducationCertifications } from '../EducationCertifications'
import { HeroHeader } from '../HeroHeader'

vi.mock('@/components/ui/availability-badge', () => ({ AvailabilityBadge: () => null }))
vi.mock('next/image', () => ({
  // biome-ignore lint/performance/noImgElement: test stub
  default: () => <img alt="" />,
}))

const hero = {
  showPdf: false,
  isDownloading: false,
  onDownloadResume: vi.fn(),
  onToggleView: vi.fn(),
}

describe('resume copy says each thing once (B-14)', () => {
  afterEach(cleanup)

  it('has one "Revenue Operations Professional" and no repeated summary paragraph', () => {
    const page = render(
      <>
        <HeroHeader {...hero} />
        <AboutSection />
      </>
    )
    const text = page.container.textContent ?? ''
    expect(text.split('Revenue Operations Professional').length - 1).toBe(1)
    expect(text).not.toContain('Experienced Revenue Operations Professional')
  })

  it('does not duplicate the Certifications list as chips', () => {
    const { container } = render(<AboutSection />)
    for (const cert of certifications) expect(container.textContent).not.toContain(cert)
    expect(container.textContent).not.toContain('Salesloft Certified Administrator')
  })

  it('names the Salesloft credentials exactly as /about and the JSON-LD do', () => {
    expect(certifications).toContain('Salesloft Admin Certification Level 1')
    expect(certifications).toContain('Salesloft Admin Certification Level 2')
    expect(certifications).not.toContain('Salesloft Certified Administrator')
  })

  it('states the canonical years once and never "nearly a decade"', () => {
    const { container } = render(<AboutSection />)
    const text = container.textContent ?? ''
    expect(text).toContain(`${YEARS_EXPERIENCE} Years Experience`)
    expect(text).not.toMatch(/nearly a decade/i)
  })
})

describe('resume hero pill (B-15)', () => {
  afterEach(cleanup)

  it('is a compact pill, not a heading-sized capsule', () => {
    const { container } = render(<HeroHeader {...hero} />)
    // A tagline paragraph with the h2 look; the page's sections are its H2s.
    expect(container.querySelector('h2')).toBeNull()
    const pill = container.querySelector('p.look-h2') as HTMLElement
    expect(pill.className).toContain('text-lg')
    expect(pill.querySelector('span')?.className).toContain('inline-flex')
    expect(pill.querySelector('span')?.className).not.toContain('px-6')
  })
})

describe('education and certifications (B-17)', () => {
  afterEach(cleanup)

  it('are single cards with left-aligned headings and no inner grey box', () => {
    const { container } = render(<EducationCertifications />)
    expect(container.querySelectorAll('section')).toHaveLength(2)
    expect(container.innerHTML).not.toContain('bg-muted/50')
    expect(container.innerHTML).not.toContain('h-[320px]')
    for (const h3 of Array.from(container.querySelectorAll('h3'))) {
      expect(h3.className).not.toContain('justify-center')
      expect(h3.parentElement?.className).not.toContain('text-center')
    }
  })
})
