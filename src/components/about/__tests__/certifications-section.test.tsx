// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { CertificationsSection } from '../certifications-section'

const fixture = [
  {
    name: 'SalesLoft Admin Certification',
    issuer: 'SalesLoft',
    badge: '🏆',
    description: 'Validates expertise in admin configuration.',
    skills: ['SalesLoft', 'Workflow', 'Cadences'],
  },
  {
    name: 'HubSpot RevOps',
    issuer: 'HubSpot',
    badge: '/images/hubspot-badge.svg',
    description: 'RevOps fundamentals and HubSpot CRM.',
    skills: ['HubSpot', 'CRM', 'Reporting'],
  },
]

describe('CertificationsSection', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders the section heading + subheading', () => {
    render(<CertificationsSection certifications={fixture} />)
    expect(screen.getByText('Certifications & Recognition')).toBeTruthy()
    expect(screen.getByText(/professional certifications validating expertise/i)).toBeTruthy()
  })

  it('renders each certification name + issuer', () => {
    render(<CertificationsSection certifications={fixture} />)
    expect(screen.getByText('SalesLoft Admin Certification')).toBeTruthy()
    expect(screen.getByText('HubSpot RevOps')).toBeTruthy()
    // Issuer + skill string-equal "SalesLoft" / "HubSpot" — getAllByText accepts duplicates.
    expect(screen.getAllByText('SalesLoft').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('HubSpot').length).toBeGreaterThanOrEqual(1)
  })

  it('renders descriptions and skill badges', () => {
    render(<CertificationsSection certifications={fixture} />)
    expect(screen.getByText(/validates expertise in admin configuration/i)).toBeTruthy()
    // Skills appear as badges
    expect(screen.getByText('Cadences')).toBeTruthy()
    expect(screen.getByText('Reporting')).toBeTruthy()
  })

  it('renders an emoji badge as a span when badge does not start with "/"', () => {
    const { container } = render(<CertificationsSection certifications={fixture} />)
    expect(container.textContent).toContain('🏆')
  })

  it('forwards a custom className to the section root', () => {
    const { container } = render(
      <CertificationsSection certifications={fixture} className="my-certs" />
    )
    expect((container.firstChild as HTMLElement).className).toContain('my-certs')
  })

  it('renders nothing in the grid when given empty certifications array', () => {
    const { container } = render(<CertificationsSection certifications={[]} />)
    const grid = container.querySelector('.grid')
    expect(grid?.children.length).toBe(0)
  })
})
