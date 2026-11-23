// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ContactForm } from '../contact-form'
import type { UseContactFormReturn } from '@/types/forms'

function StubField({
  name,
  children,
}: {
  name: string
  children: (field: {
    name: string
    state: { value: string; meta: { errors: string[] } }
    handleChange: (v: string) => void
    handleBlur: () => void
  }) => React.ReactNode
}) {
  return children({
    name,
    state: { value: '', meta: { errors: [] } },
    handleChange: () => {},
    handleBlur: () => {},
  })
}

// Minimal stand-in for TanStack Form's `form` object — only the surface the
// component actually touches (handleSubmit + Field render-prop).
function createFormStub() {
  const handleSubmit = vi.fn()
  return { handleSubmit, Field: StubField }
}

function renderForm(overrides: Partial<UseContactFormReturn> = {}) {
  const form = createFormStub()
  const props: UseContactFormReturn = {
    form,
    formData: { name: '', email: '', message: '' },
    errors: {},
    handleInputChange: vi.fn(),
    handleSubmit: vi.fn(),
    submitStatus: 'idle',
    progress: 0,
    isSubmitting: false,
    resetForm: vi.fn(),
    error: null,
    ...overrides,
  } as UseContactFormReturn
  const utils = render(<ContactForm form={props} />)
  return { ...utils, form }
}

describe('ContactForm', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders the noscript fallback with mailto link (regression: audit fix #5)', () => {
    // jsdom strips <noscript> children at parse time (treats JS as enabled),
    // so we use react-dom/server's static markup to inspect the SSR output —
    // which is what the browser actually receives when JS is disabled.
    const form = createFormStub()
    const props = {
      form,
      formData: { name: '', email: '', message: '' },
      errors: {},
      handleInputChange: vi.fn(),
      handleSubmit: vi.fn(),
      submitStatus: 'idle',
      progress: 0,
      isSubmitting: false,
      resetForm: vi.fn(),
      error: null,
    } as unknown as UseContactFormReturn
    const html = renderToStaticMarkup(<ContactForm form={props} />)
    expect(html).toContain('<noscript>')
    expect(html).toContain('mailto:hudsor01@icloud.com')
    expect(html).toContain('hudsor01@icloud.com')
  })

  it('renders all required field labels', () => {
    renderForm()
    expect(screen.getByText('Name *')).toBeTruthy()
    expect(screen.getByText('Email *')).toBeTruthy()
    expect(screen.getByText('Message *')).toBeTruthy()
    expect(screen.getByText('Company / Organization')).toBeTruthy()
    expect(screen.getByText('Phone number')).toBeTruthy()
  })

  it('enables submit button when not submitting', () => {
    renderForm({ isSubmitting: false })
    const btn = screen.getByRole('button', { name: /send message/i })
    expect((btn as HTMLButtonElement).disabled).toBe(false)
  })

  it('disables submit button while submitting', () => {
    renderForm({ isSubmitting: true })
    const btn = screen.getByRole('button', { name: /sending message/i })
    expect((btn as HTMLButtonElement).disabled).toBe(true)
  })

  it('has no checkbox and no accept-privacy hint', () => {
    renderForm()
    expect(screen.queryByRole('checkbox')).toBeNull()
    expect(screen.queryByText(/please accept/i)).toBeNull()
  })

  it('invokes form.handleSubmit on form submit', () => {
    const { form, container } = renderForm()
    const formEl = container.querySelector('form')
    expect(formEl).toBeTruthy()
    fireEvent.submit(formEl!)
    expect(form.handleSubmit).toHaveBeenCalledTimes(1)
  })

  it('renders the privacy notice with a new-tab link to /privacy', () => {
    renderForm()
    expect(
      screen.getByText(
        /By sending, your name, email and message are used only to reply to you\. See the/
      )
    ).toBeTruthy()
    const link = screen.getByRole('link', { name: /^privacy policy \(opens in a new tab\)$/i })
    expect(link.getAttribute('href')).toBe('/privacy')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toContain('noopener')
    // Visible link text has no trailing space (no gap before the period) and never wraps.
    expect(link.textContent).toBe('Privacy Policy')
    expect(link.className).toContain('whitespace-nowrap')
    expect(link.parentElement?.textContent?.endsWith('See the Privacy Policy.')).toBe(true)
  })

  it('shows one error alert, with the specific reason, between the Send button and the notice', () => {
    renderForm({ submitStatus: 'error', error: new Error('Rate limit exceeded') })
    const alerts = screen.getAllByRole('alert')
    expect(alerts).toHaveLength(1)
    const msg = alerts[0]!
    expect(msg.textContent).toMatch(/failed to send message\. rate limit exceeded/i)
    const btn = screen.getByRole('button', { name: /send message/i })
    const notice = screen.getByRole('link', { name: /privacy policy/i }).closest('p')!
    expect(btn.compareDocumentPosition(msg) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(msg.compareDocumentPosition(notice) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('renders the success banner as a polite status, not an alert', () => {
    renderForm({ submitStatus: 'success' })
    expect(screen.getByRole('status').textContent).toMatch(/sent successfully/i)
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('falls back to a generic retry message when no specific reason exists', () => {
    renderForm({ submitStatus: 'error' })
    expect(screen.getAllByRole('alert')).toHaveLength(1)
    expect(screen.getByRole('alert').textContent).toMatch(
      /failed to send message\. please try again/i
    )
  })

  it('keeps the notice readable (normal weight, relaxed leading)', () => {
    renderForm()
    const notice = screen.getByRole('link', { name: /privacy policy/i }).closest('p')!
    expect(notice.className).toContain('leading-relaxed')
    expect(notice.className).toContain('font-normal')
  })
})
