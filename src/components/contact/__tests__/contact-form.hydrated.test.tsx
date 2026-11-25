// @vitest-environment jsdom
/**
 * ContactForm driven by the real useContactForm hook and real TanStack Form, so
 * these tests exercise the hydrated submit path the page actually uses. The
 * server actions are mocked: nothing is sent or stored.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent, act, waitFor } from '@testing-library/react'

vi.mock('@/lib/logger', () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn(), fatal: vi.fn() },
}))

const { submitMock, submitActionMock, useActionStateMock, actual } = vi.hoisted(() => ({
  submitMock: vi.fn(),
  submitActionMock: vi.fn(),
  useActionStateMock: vi.fn(),
  actual: { useActionState: undefined as unknown as typeof import('react').useActionState },
}))
vi.mock('@/app/contact/actions', () => ({
  submitContactForm: submitMock,
  submitContactFormAction: submitActionMock,
}))
vi.mock('@vercel/analytics', () => ({ track: vi.fn() }))
vi.mock('react', async (importOriginal) => {
  const original = await importOriginal<typeof import('react')>()
  actual.useActionState = original.useActionState
  return { ...original, useActionState: useActionStateMock }
})

import { ContactForm } from '../contact-form'
import { useContactForm } from '@/hooks/use-contact-form'
import type { ContactActionState } from '@/types/forms'

function Harness() {
  const form = useContactForm()
  return <ContactForm form={form} />
}

function driveActionState(state: ContactActionState) {
  useActionStateMock.mockImplementation(() => [state, vi.fn(), false])
}

const progressiveError: ContactActionState = {
  status: 'error',
  error: 'Please check your form and try again.',
  validationErrors: {
    name: ['Server name message'],
    phone: ['Please enter a valid phone number'],
  },
  values: {
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: 'abc',
    message: 'Hello, I would like to talk.',
  },
}

function field(container: HTMLElement, id: string) {
  return container.querySelector(`#${id}`) as HTMLInputElement
}

async function fillValid(container: HTMLElement) {
  await act(async () => {
    fireEvent.change(field(container, 'name'), { target: { value: 'Jane Doe' } })
    fireEvent.change(field(container, 'email'), { target: { value: 'jane@example.com' } })
    fireEvent.change(field(container, 'message'), {
      target: { value: 'Hello, I would like to discuss a project.' },
    })
  })
}

async function submit(container: HTMLElement) {
  await act(async () => {
    fireEvent.submit(container.querySelector('form')!)
  })
}

beforeEach(() => {
  submitMock.mockReset()
  useActionStateMock.mockReset()
  useActionStateMock.mockImplementation(((...args: Parameters<typeof actual.useActionState>) =>
    actual.useActionState(...args)) as never)
})

describe('ContactForm with the real hook', () => {
  it('drops a progressive server field error once the user edits that field (WR-01)', async () => {
    driveActionState(progressiveError)
    const { container } = render(<Harness />)
    expect(container.textContent).toContain('Please enter a valid phone number')
    expect(field(container, 'phone').getAttribute('aria-invalid')).toBe('true')

    await act(async () => {
      fireEvent.change(field(container, 'phone'), { target: { value: '555-123-4567' } })
    })

    expect(container.textContent).not.toContain('Please enter a valid phone number')
    expect(field(container, 'phone').getAttribute('aria-invalid')).toBe('false')
    // A field the user has not touched still shows what the server said about it.
    expect(container.textContent).toContain('Server name message')
    expect(field(container, 'name').getAttribute('aria-invalid')).toBe('true')
  })

  it('shows the client error, not the stale server one, when the edit is still invalid', async () => {
    driveActionState(progressiveError)
    const { container } = render(<Harness />)

    await act(async () => {
      fireEvent.change(field(container, 'phone'), { target: { value: 'still bad' } })
    })

    expect(field(container, 'phone').getAttribute('aria-invalid')).toBe('true')
    expect(container.textContent).toContain('Please enter a valid phone number')
  })

  it('submits a honeypot set straight on the DOM, without input events (WR-02)', async () => {
    submitMock.mockResolvedValue({ success: true })
    const { container } = render(<Harness />)
    await fillValid(container)
    const trap = container.querySelector('input[name="honeypot"]') as HTMLInputElement
    // The puppeteer/$eval pattern: no React onChange fires.
    trap.value = 'http://spam.example'
    await submit(container)
    await waitFor(() => expect(submitMock).toHaveBeenCalledTimes(1))
    expect(submitMock.mock.calls[0]?.[0]).toMatchObject({ honeypot: 'http://spam.example' })
  })

  it('submits an empty honeypot for a human', async () => {
    submitMock.mockResolvedValue({ success: true })
    const { container } = render(<Harness />)
    await fillValid(container)
    await submit(container)
    await waitFor(() => expect(submitMock).toHaveBeenCalledTimes(1))
    expect(submitMock.mock.calls[0]?.[0]).toMatchObject({ honeypot: '', name: 'Jane Doe' })
    // The hook's handleSubmit prevented React's native form action.
    expect(submitActionMock).not.toHaveBeenCalled()
  })

  it('blocks an emoji-only name the native minLength lets through, with no request (WR-06)', async () => {
    const { container } = render(<Harness />)
    await fillValid(container)
    await act(async () => {
      fireEvent.change(field(container, 'name'), { target: { value: '😀' } })
    })
    // The native constraint is satisfied (2 UTF-16 units)...
    expect(field(container, 'name').value.length).toBeGreaterThanOrEqual(
      field(container, 'name').minLength
    )
    await submit(container)
    // ...but the hydrated validator is the server's schema, so nothing is sent.
    expect(submitMock).not.toHaveBeenCalled()
    expect(field(container, 'name').getAttribute('aria-invalid')).toBe('true')
    expect(container.textContent).toContain('Name must be at least')
  })

  it('a second submit while one is in flight sends nothing (WR-07)', async () => {
    let resolveSubmit: (value: { success: boolean }) => void = () => {}
    submitMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSubmit = resolve
        })
    )
    const { container } = render(<Harness />)
    await fillValid(container)
    const formEl = container.querySelector('form')!
    // Double click / programmatic requestSubmit: both events land before React
    // re-renders the button as disabled.
    await act(async () => {
      fireEvent.submit(formEl)
      fireEvent.submit(formEl)
    })
    await waitFor(() => expect(submitMock).toHaveBeenCalledTimes(1))
    // Still in flight, now with the button disabled: a further submit is ignored too.
    await submit(container)
    expect(submitMock).toHaveBeenCalledTimes(1)
    await act(async () => {
      resolveSubmit({ success: true })
    })
    expect(container.textContent).toContain('Message sent successfully')
    expect(submitMock).toHaveBeenCalledTimes(1)
  })

  it('submits again once the previous submission has settled', async () => {
    submitMock.mockResolvedValue({ success: false, error: 'rate limited' })
    const { container } = render(<Harness />)
    await fillValid(container)
    await submit(container)
    await waitFor(() => expect(submitMock).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(container.textContent).toContain('rate limited'))
    await submit(container)
    await waitFor(() => expect(submitMock).toHaveBeenCalledTimes(2))
  })
})
