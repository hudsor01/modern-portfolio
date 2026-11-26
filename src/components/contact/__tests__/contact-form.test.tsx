// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, createEvent, cleanup } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ContactForm } from '../contact-form'
import type { UseContactFormReturn } from '@/types/forms'
import { CONTACT_LIMITS, CONTACT_MINIMUMS } from '@/lib/schemas'

let stubValues: Record<string, string> = {}
let stubErrors: Record<string, unknown[]> = {}
let stubDirty: Record<string, boolean> = {}

function StubField({
  name,
  children,
}: {
  name: string
  children: (field: {
    name: string
    state: { value: string; meta: { errors: unknown[]; isDirty: boolean } }
    handleChange: (v: string) => void
    handleBlur: () => void
  }) => React.ReactNode
}) {
  return children({
    name,
    state: {
      value: stubValues[name] ?? '',
      meta: { errors: stubErrors[name] ?? [], isDirty: stubDirty[name] ?? false },
    },
    handleChange: () => {},
    handleBlur: () => {},
  })
}

// Minimal stand-in for TanStack Form's `form` object. The component renders only
// its Field render-prop; handleSubmit and setFieldValue are spies that must stay
// untouched, because the hook's guarded handleSubmit is the only submit path.
function createFormStub(
  values: Record<string, string> = {},
  errors: Record<string, unknown[]> = {}
) {
  stubValues = values
  stubErrors = errors
  stubDirty = {}
  const handleSubmit = vi.fn()
  const setFieldValue = vi.fn()
  return { handleSubmit, setFieldValue, Field: StubField }
}

function renderForm(
  overrides: Partial<UseContactFormReturn> = {},
  values: Record<string, string> = {},
  errors: Record<string, unknown[]> = {}
) {
  const form = createFormStub(values, errors)
  const props: UseContactFormReturn = {
    form,
    formData: { name: '', email: '', message: '' },
    errors: {},
    handleSubmit: vi.fn(),
    submitStatus: 'idle',
    progress: 0,
    isSubmitting: false,
    resetForm: vi.fn(),
    error: null,
    formAction: vi.fn(),
    serverFieldErrors: {},
    fromAction: false,
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
      handleSubmit: vi.fn(),
      submitStatus: 'idle',
      progress: 0,
      isSubmitting: false,
      resetForm: vi.fn(),
      error: null,
      formAction: vi.fn(),
      serverFieldErrors: {},
    } as unknown as UseContactFormReturn
    const html = renderToStaticMarkup(<ContactForm form={props} />)
    expect(html).toContain('<noscript>')
    expect(html).toContain('mailto:hudsor01@icloud.com')
    expect(html).toContain('hudsor01@icloud.com')
    expect(html).toMatch(/<a href="mailto:hudsor01@icloud.com" class="text-link">/)
    expect(html).toContain('Prefer email? Write to')
    expect(html).not.toMatch(/requires javascript/i)
  })

  it('renders all required field labels', () => {
    renderForm()
    expect(screen.getByText('Name *')).toBeTruthy()
    expect(screen.getByText('Email *')).toBeTruthy()
    expect(screen.getByText('Message *')).toBeTruthy()
    expect(screen.getByText('Company / Organization')).toBeTruthy()
    expect(screen.getByText('Phone number')).toBeTruthy()
  })

  it('placeholders never repeat their label (B-9)', () => {
    const { container } = renderForm()
    for (const field of Array.from(
      container.querySelectorAll('input:not([name="honeypot"]), textarea')
    )) {
      const label = container.querySelector(`label[for="${field.id}"]`)?.textContent ?? ''
      const placeholder = field.getAttribute('placeholder') ?? ''
      const strip = (t: string) => t.replace(/[*\s]/g, '').toLowerCase()
      expect(placeholder).not.toBe('')
      expect(strip(placeholder)).not.toBe(strip(label))
      expect(placeholder).not.toContain('*')
    }
  })

  it('centres each single-line field icon on the input height (B-9)', () => {
    const { container } = renderForm()
    const inputs = Array.from(container.querySelectorAll('input:not([name="honeypot"])'))
    expect(inputs.length).toBe(4)
    for (const input of inputs) {
      // Input is h-9; the icon box must be the same h-9 and centre its content.
      const box = input.previousElementSibling as HTMLElement
      expect(box.className).toContain('h-9')
      expect(box.className).toContain('items-center')
      expect(box.className).not.toContain('top-3.5')
    }
  })

  it('stretches to the column and lets the message field absorb the slack (B-10)', () => {
    const { container } = renderForm()
    const card = container.firstElementChild as HTMLElement
    expect(card.className).toContain('h-full')
    expect(card.className).toContain('relative')
    expect(container.querySelector('textarea')?.className).toContain('flex-1')
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

  it("submits through the hook's guarded handleSubmit, never TanStack's directly", () => {
    const handleSubmit = vi.fn()
    const { form, container } = renderForm({ handleSubmit })
    const formEl = container.querySelector('form')
    expect(formEl).toBeTruthy()
    fireEvent.submit(formEl!)
    expect(handleSubmit).toHaveBeenCalledTimes(1)
    expect(handleSubmit.mock.calls[0]?.[0]?.target).toBe(formEl)
    expect(form.handleSubmit).not.toHaveBeenCalled()
    expect(form.setFieldValue).not.toHaveBeenCalled()
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

  it.each([['error', 'alert']] as const)(
    'a progressive %s banner takes focus on load, without JS',
    (status, role) => {
      const props = {
        form: createFormStub(),
        formData: {},
        errors: {},
        submitStatus: status,
        isSubmitting: false,
        error: null,
        formAction: vi.fn(),
        serverFieldErrors: {},
        fromAction: true,
      } as unknown as UseContactFormReturn
      // SSR markup is what a no-JS browser gets: the native autofocus attribute must be in it.
      const html = renderToStaticMarkup(<ContactForm form={props} />)
      const banner = html.match(new RegExp(`<div role="${role}"[^>]*>`))?.[0] ?? ''
      expect(banner).toContain('tabindex="-1"')
      expect(banner).toContain('autofocus=""')
      expect(banner).toContain('data-focus-target=""')
    }
  )

  it.each([
    ['success', 'status'],
    ['error', 'alert'],
  ] as const)('a hydrated %s banner never autofocuses', (status, role) => {
    const props = {
      form: createFormStub(),
      formData: {},
      errors: {},
      submitStatus: status,
      isSubmitting: false,
      error: null,
      formAction: vi.fn(),
      serverFieldErrors: {},
      fromAction: false,
    } as unknown as UseContactFormReturn
    const html = renderToStaticMarkup(<ContactForm form={props} />)
    const banner = html.match(new RegExp(`<div role="${role}"[^>]*>`))?.[0] ?? ''
    expect(banner).not.toBe('')
    expect(banner).not.toContain('autofocus')
    expect(banner).not.toContain('tabindex')
    expect(banner).not.toContain('data-focus-target')
  })

  it('falls back to a generic retry message when no specific reason exists', () => {
    renderForm({ submitStatus: 'error' })
    expect(screen.getAllByRole('alert')).toHaveLength(1)
    expect(screen.getByRole('alert').textContent).toMatch(
      /failed to send message\. please try again/i
    )
  })

  it('keeps the notice readable (privacy link present, no bold weight)', () => {
    renderForm()
    const link = screen.getByRole('link', { name: /privacy policy/i })
    const notice = link.closest('p')!
    expect(notice.contains(link)).toBe(true)
    expect(notice.className).not.toMatch(/font-(medium|semibold|bold)/)
  })

  it('puts the notice privacy link on text-link and keeps target/rel/aria-label', () => {
    renderForm()
    const link = screen.getByRole('link', { name: /privacy policy/i })
    expect(link.classList.contains('text-link')).toBe(true)
    expect(link.classList.contains('whitespace-nowrap')).toBe(true)
    expect(link.className).not.toContain('underline-offset-4')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener')
    expect(link.getAttribute('aria-label')).toBe('Privacy Policy (opens in a new tab)')
  })

  it('notice paragraph uses working utilities, not the unlayered typography-small', () => {
    renderForm()
    const notice = screen.getByRole('link', { name: /privacy policy/i }).closest('p')!
    expect(notice.className).not.toContain('typography-small')
    expect(notice.className).toContain('leading-relaxed')
  })

  it('carries native limits and autocomplete tokens from CONTACT_LIMITS', () => {
    const { container } = renderForm()
    const q = (sel: string) => container.querySelector(sel) as HTMLInputElement
    expect(q('#name').maxLength).toBe(CONTACT_LIMITS.name)
    expect(q('#name').minLength).toBe(CONTACT_MINIMUMS.name)
    expect(q('#name').autocomplete).toBe('name')
    expect(q('#email').maxLength).toBe(CONTACT_LIMITS.email)
    expect(q('#email').autocomplete).toBe('email')
    expect(q('#company').maxLength).toBe(CONTACT_LIMITS.company)
    expect(q('#company').autocomplete).toBe('organization')
    expect(q('#phone').maxLength).toBe(CONTACT_LIMITS.phone)
    expect(q('#phone').autocomplete).toBe('tel')
    expect(q('#message').maxLength).toBe(CONTACT_LIMITS.message)
    expect(q('#message').minLength).toBe(CONTACT_MINIMUMS.message)
  })

  it('phone pattern compiles under the v flag and filters input', () => {
    const { container } = renderForm()
    const p = container.querySelector('#phone')!.getAttribute('pattern')!
    const re = new RegExp(`^(?:${p})$`, 'v')
    expect(re.test('(555) 123-4567')).toBe(true)
    expect(re.test('+1 555 123 4567')).toBe(true)
    expect(re.test('abc')).toBe(false)
  })

  it('counts the message against CONTACT_LIMITS.message, CRLF as one', () => {
    const empty = renderForm()
    expect(empty.container.textContent).toContain(`0/${CONTACT_LIMITS.message}`)
    cleanup()
    const crlf = renderForm({}, { message: 'a\r\nb' })
    expect(crlf.container.textContent).toContain(`3/${CONTACT_LIMITS.message}`)
  })

  it('renders exactly one unfocusable, unlabelled honeypot inside an aria-hidden wrapper', () => {
    const { container } = renderForm()
    const traps = container.querySelectorAll('input[name="honeypot"]')
    expect(traps).toHaveLength(1)
    const trap = traps[0] as HTMLInputElement
    expect(trap.autocomplete).toBe('off')
    expect(trap.tabIndex).toBe(-1)
    expect(trap.id).toBe('')
    expect(trap.labels?.length ?? 0).toBe(0)
    expect(trap.hasAttribute('placeholder')).toBe(false)
    expect(trap.type).toBe('text')
    expect(trap.hasAttribute('hidden')).toBe(false)
    expect(trap.closest('[aria-hidden="true"]')).not.toBeNull()
  })

  it('SSR with a server reference renders a multipart POST form with the action id', () => {
    const formAction = Object.assign(vi.fn(), {
      $$FORM_ACTION: () => ({
        name: '$ACTION_ID_test',
        method: 'POST',
        encType: 'multipart/form-data',
        data: null,
      }),
    })
    const props = {
      form: createFormStub(),
      formData: {},
      errors: {},
      submitStatus: 'idle',
      isSubmitting: false,
      error: null,
      formAction,
      serverFieldErrors: {},
    } as unknown as UseContactFormReturn
    const html = renderToStaticMarkup(<ContactForm form={props} />)
    expect(html).toMatch(/<form[^>]*method="POST"/)
    expect(html).toMatch(/encType="multipart\/form-data"/)
    expect(html).toContain('name="$ACTION_ID_test"')
    expect(html).not.toMatch(/method="get"/i)
    expect(html).not.toContain('javascript:')
  })

  it('a hydrated submit the hook prevents never reaches formAction', () => {
    const formAction = vi.fn()
    const handleSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault())
    const { container } = renderForm({
      formAction,
      handleSubmit: handleSubmit as unknown as UseContactFormReturn['handleSubmit'],
    })
    const formEl = container.querySelector('form')!
    const event = createEvent.submit(formEl)
    fireEvent(formEl, event)
    expect(handleSubmit).toHaveBeenCalledTimes(1)
    expect(event.defaultPrevented).toBe(true)
    expect(formAction).not.toHaveBeenCalled()
  })

  it('shows a server field error when TanStack has none', () => {
    const { container } = renderForm({
      serverFieldErrors: { phone: 'Please enter a valid phone number' },
    })
    expect(container.textContent).toContain('Please enter a valid phone number')
    expect(container.querySelector('#phone')!.getAttribute('aria-invalid')).toBe('true')
  })

  it('hides a server field error once that field is dirty, keeping the others', () => {
    const form = createFormStub()
    stubDirty = { phone: true }
    const props = {
      form,
      formData: {},
      errors: {},
      submitStatus: 'error',
      isSubmitting: false,
      error: null,
      formAction: vi.fn(),
      serverFieldErrors: { phone: 'Server phone message', name: 'Server name message' },
    } as unknown as UseContactFormReturn
    const { container } = render(<ContactForm form={props} />)
    expect(container.textContent).not.toContain('Server phone message')
    expect(container.querySelector('#phone')!.getAttribute('aria-invalid')).toBe('false')
    expect(container.textContent).toContain('Server name message')
    expect(container.querySelector('#name')!.getAttribute('aria-invalid')).toBe('true')
  })

  it('client error wins over the server error and never renders [object Object]', () => {
    const { container } = renderForm(
      { serverFieldErrors: { phone: 'Server message' } },
      {},
      { phone: [{ message: 'Client message' }] }
    )
    expect(container.textContent).toContain('Client message')
    expect(container.textContent).not.toContain('Server message')
    expect(container.textContent).not.toContain('[object Object]')
  })

  it('shows a server validation message in the single alert', () => {
    renderForm({
      submitStatus: 'error',
      error: new Error('Please check your form and try again.'),
    })
    const alerts = screen.getAllByRole('alert')
    expect(alerts).toHaveLength(1)
    expect(alerts[0]!.textContent).toContain('Please check your form and try again.')
  })
})
