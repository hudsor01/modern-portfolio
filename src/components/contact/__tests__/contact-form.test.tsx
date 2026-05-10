// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ContactForm } from '../contact-form'
import type { UseContactFormReturn } from '@/types/forms'

// jsdom doesn't ship ResizeObserver — Radix's Checkbox uses it.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
;(globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver =
  (globalThis as unknown as { ResizeObserver?: unknown }).ResizeObserver ?? ResizeObserverStub

// Minimal stand-in for TanStack Form's `form` object — only the surface the
// component actually touches (handleSubmit + Field render-prop).
function createFormStub() {
  const handleSubmit = vi.fn()
  const Field = ({
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
  }) =>
    children({
      name,
      state: { value: '', meta: { errors: [] } },
      handleChange: () => {},
      handleBlur: () => {},
    })
  return { handleSubmit, Field }
}

function renderForm(overrides: Partial<UseContactFormReturn> = {}) {
  const form = createFormStub()
  const setShowPrivacy = vi.fn()
  const setAgreedToTerms = vi.fn()
  const props: UseContactFormReturn = {
    form,
    formData: { name: '', email: '', message: '' },
    errors: {},
    handleInputChange: vi.fn(),
    handleSubmit: vi.fn(),
    submitStatus: 'idle',
    showPrivacy: false,
    agreedToTerms: false,
    termsError: null,
    progress: 0,
    isSubmitting: false,
    setShowPrivacy,
    setAgreedToTerms,
    resetForm: vi.fn(),
    error: null,
    ...overrides,
  } as UseContactFormReturn
  const utils = render(<ContactForm form={props} />)
  return { ...utils, form, setShowPrivacy, setAgreedToTerms }
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
      showPrivacy: false,
      agreedToTerms: false,
      termsError: null,
      progress: 0,
      isSubmitting: false,
      setShowPrivacy: vi.fn(),
      setAgreedToTerms: vi.fn(),
      resetForm: vi.fn(),
      error: null,
    } as unknown as UseContactFormReturn
    const html = renderToStaticMarkup(<ContactForm form={props} />)
    expect(html).toContain('<noscript>')
    expect(html).toContain('mailto:richard@richardwhudsonjr.com')
    expect(html).toContain('richard@richardwhudsonjr.com')
  })

  it('renders all required field labels', () => {
    renderForm()
    expect(screen.getByText('Name *')).toBeTruthy()
    expect(screen.getByText('Email *')).toBeTruthy()
    expect(screen.getByText('Message *')).toBeTruthy()
    expect(screen.getByText('Company / Organization')).toBeTruthy()
    expect(screen.getByText('Phone number')).toBeTruthy()
  })

  it('disables submit button when terms not agreed', () => {
    renderForm({ agreedToTerms: false })
    const btn = screen.getByRole('button', { name: /send message/i })
    expect((btn as HTMLButtonElement).disabled).toBe(true)
  })

  it('enables submit button when terms are agreed and not submitting', () => {
    renderForm({ agreedToTerms: true, isSubmitting: false })
    const btn = screen.getByRole('button', { name: /send message/i })
    expect((btn as HTMLButtonElement).disabled).toBe(false)
  })

  it('disables submit button while submitting even with terms agreed', () => {
    renderForm({ agreedToTerms: true, isSubmitting: true })
    // The accessible name changes to the loading state
    const btn = screen.getByRole('button', { name: /sending message/i })
    expect((btn as HTMLButtonElement).disabled).toBe(true)
  })

  it('invokes form.handleSubmit on form submit', () => {
    const { form, container } = renderForm({ agreedToTerms: true })
    const formEl = container.querySelector('form')
    expect(formEl).toBeTruthy()
    fireEvent.submit(formEl!)
    expect(form.handleSubmit).toHaveBeenCalledTimes(1)
  })

  it('toggles privacy via the inline button', () => {
    const { setShowPrivacy } = renderForm({ showPrivacy: false })
    const toggle = screen.getByRole('button', { name: /show privacy policy/i })
    fireEvent.click(toggle)
    expect(setShowPrivacy).toHaveBeenCalled()
  })

  it('shows privacy policy text when showPrivacy is true', () => {
    renderForm({ showPrivacy: true })
    expect(screen.getByText(/used solely to respond to your inquiry/i)).toBeTruthy()
  })

  it('renders success status banner when submitStatus === "success"', () => {
    renderForm({ submitStatus: 'success' })
    expect(screen.getByRole('alert').textContent).toMatch(/sent successfully/i)
  })

  it('renders error status banner when submitStatus === "error"', () => {
    renderForm({ submitStatus: 'error' })
    expect(screen.getByRole('alert').textContent).toMatch(/failed to send/i)
  })

  it('checkbox click invokes setAgreedToTerms', () => {
    const { setAgreedToTerms } = renderForm()
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    expect(setAgreedToTerms).toHaveBeenCalled()
  })
})
