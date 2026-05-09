import { describe, expect, it } from 'vitest'
import { render } from 'react-email'
import { ContactNotificationEmail } from '../contact-notification'
import { AutoReplyEmail } from '../auto-reply'
import type { ContactFormData } from '@/types/api'

const baseData: ContactFormData = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  message: 'Hello, I would like to discuss a project.',
}

describe('ContactNotificationEmail', () => {
  it('renders the submitter name, email and message', async () => {
    const html = await render(
      <ContactNotificationEmail data={baseData} submittedAt="2026-05-08T18:00:00Z" />
    )

    expect(html).toContain('New Portfolio Contact')
    expect(html).toContain('Jane Doe')
    expect(html).toContain('mailto:jane@example.com')
    expect(html).toContain('Hello, I would like to discuss a project.')
    expect(html).toContain('2026-05-08T18:00:00Z')
  })

  it('uses a <table>-based field layout for cross-client compatibility', async () => {
    const html = await render(
      <ContactNotificationEmail data={baseData} submittedAt="2026-05-08T18:00:00Z" />
    )

    expect(html).toContain('<table')
    expect(html).toMatch(/<td[^>]*>\s*Name:\s*<\/td>/)
    expect(html).toMatch(/<td[^>]*>\s*Email:\s*<\/td>/)
  })

  it('includes optional phone and subject only when provided', async () => {
    const withExtras: ContactFormData = {
      ...baseData,
      phone: '+1-555-0100',
      subject: 'Engagement inquiry',
    }
    const html = await render(
      <ContactNotificationEmail data={withExtras} submittedAt="2026-05-08T18:00:00Z" />
    )

    expect(html).toContain('+1-555-0100')
    expect(html).toContain('Engagement inquiry')
  })

  it('omits phone/subject rows when absent', async () => {
    const html = await render(
      <ContactNotificationEmail data={baseData} submittedAt="2026-05-08T18:00:00Z" />
    )

    expect(html).not.toMatch(/<td[^>]*>\s*Phone:\s*<\/td>/)
    expect(html).not.toMatch(/<td[^>]*>\s*Subject:\s*<\/td>/)
  })

  it('escapes user-supplied HTML to prevent injection', async () => {
    const malicious: ContactFormData = {
      name: '<script>alert(1)</script>',
      email: 'attacker@example.com',
      message: '<img src=x onerror=alert(1)>',
    }
    const html = await render(
      <ContactNotificationEmail data={malicious} submittedAt="2026-05-08T18:00:00Z" />
    )

    expect(html).not.toContain('<script>alert(1)</script>')
    expect(html).not.toContain('<img src=x onerror=alert(1)>')
    expect(html).toContain('&lt;script&gt;')
  })
})

describe('AutoReplyEmail', () => {
  it('greets the submitter by name and quotes their message', async () => {
    const html = await render(<AutoReplyEmail data={baseData} />)

    expect(html).toMatch(/Hi (<!--\s*-->)?Jane Doe/)
    expect(html).toContain('Hello, I would like to discuss a project.')
    expect(html).toContain('Richard Hudson')
    expect(html).toContain('automated response')
  })

  it('escapes user-supplied HTML in the quoted message', async () => {
    const malicious: ContactFormData = {
      name: 'Mallory',
      email: 'm@example.com',
      message: '<script>alert(1)</script>',
    }
    const html = await render(<AutoReplyEmail data={malicious} />)

    expect(html).not.toContain('<script>alert(1)</script>')
    expect(html).toContain('&lt;script&gt;')
  })
})
