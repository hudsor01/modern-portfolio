// @vitest-environment jsdom
/**
 * ContactForm driven by the real useContactForm hook and real TanStack Form, so
 * these tests exercise the hydrated submit path the page actually uses. The
 * server actions are mocked: nothing is sent or stored.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent, act } from '@testing-library/react'

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
})
