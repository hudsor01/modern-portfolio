// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('@/lib/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
  },
}))

const { submitMock, submitActionMock, trackMock, useActionStateMock, actual } = vi.hoisted(() => ({
  submitMock: vi.fn(),
  submitActionMock: vi.fn(),
  trackMock: vi.fn(),
  useActionStateMock: vi.fn(),
  actual: { useActionState: undefined as unknown as typeof import('react').useActionState },
}))
vi.mock('@/app/contact/actions', () => ({
  submitContactForm: submitMock,
  submitContactFormAction: submitActionMock,
}))
vi.mock('@vercel/analytics', () => ({ track: trackMock }))
vi.mock('react', async (importOriginal) => {
  const original = await importOriginal<typeof import('react')>()
  actual.useActionState = original.useActionState
  return { ...original, useActionState: useActionStateMock }
})

import { useContactForm } from '@/hooks/use-contact-form'
import type { ContactActionState } from '@/types/forms'

const dispatchMock = vi.fn()

function driveActionState(state: ContactActionState, pending = false) {
  useActionStateMock.mockImplementation(() => [state, dispatchMock, pending])
}

const errorState: ContactActionState = {
  status: 'error',
  error: 'Please check your form and try again.',
  validationErrors: { phone: ['Please enter a valid phone number'] },
  values: {
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: 'abc',
    message: 'Hello, I would like to talk.',
  },
}

const validData = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  message: 'Hello, I would like to discuss a project opportunity.',
}

beforeEach(() => {
  submitMock.mockReset()
  trackMock.mockReset()
  dispatchMock.mockReset()
  useActionStateMock.mockReset()
  useActionStateMock.mockImplementation(((...args: Parameters<typeof actual.useActionState>) =>
    actual.useActionState(...args)) as never)
})

describe('useContactForm', () => {
  it('initial state: idle / not submitting', () => {
    const { result } = renderHook(() => useContactForm())
    expect(result.current.submitStatus).toBe('idle')
    expect(result.current.isSubmitting).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('exposes errors map mapped from contactFormSchema', () => {
    const { result } = renderHook(() => useContactForm())
    // Default empty form fails validation
    expect(typeof result.current.errors).toBe('object')
    expect(result.current.errors.name).toBeTruthy()
    expect(result.current.errors.email).toBeTruthy()
    expect(result.current.errors.message).toBeTruthy()
  })

  it('progress reflects fields filled', () => {
    const { result } = renderHook(() => useContactForm())
    expect(result.current.progress).toBe(0)
  })

  it('progress is 33/67/100 for one/two/three required fields', () => {
    const { result, rerender } = renderHook(() => useContactForm())
    // The hook reads form.state.values at render time; rerender picks up each write.
    for (const [key, expected] of [
      ['name', 33],
      ['email', 67],
      ['message', 100],
    ] as const) {
      act(() => result.current.form.setFieldValue(key, validData[key]))
      rerender()
      expect(result.current.progress).toBe(expected)
    }
  })

  it('handleSubmit calls action with valid data and no consent step', async () => {
    submitMock.mockResolvedValue({ success: true })
    const { result } = renderHook(() => useContactForm())
    act(() => {
      for (const [key, value] of Object.entries(validData)) {
        result.current.form.setFieldValue(key as keyof typeof validData, value)
      }
    })
    await act(async () => {
      await result.current.handleSubmit()
    })
    expect(submitMock).toHaveBeenCalledTimes(1)
    expect(result.current.submitStatus).toBe('success')
    // Conversion event, with no form content.
    expect(trackMock).toHaveBeenCalledTimes(1)
    expect(trackMock).toHaveBeenCalledWith('Contact Submitted', { location: 'contact-form' })
  })

  it('handleSubmit sets error state on action failure', async () => {
    submitMock.mockResolvedValue({ success: false, error: 'rate limited' })
    const { result } = renderHook(() => useContactForm())
    act(() => {
      for (const [key, value] of Object.entries(validData)) {
        result.current.form.setFieldValue(key as keyof typeof validData, value)
      }
    })
    await act(async () => {
      await result.current.handleSubmit()
    })
    expect(result.current.submitStatus).toBe('error')
    expect(result.current.error?.message).toBe('rate limited')
    expect(trackMock).not.toHaveBeenCalled()
  })

  it('handleSubmit catches thrown errors', async () => {
    submitMock.mockRejectedValue(new Error('network down'))
    const { result } = renderHook(() => useContactForm())
    act(() => {
      for (const [key, value] of Object.entries(validData)) {
        result.current.form.setFieldValue(key as keyof typeof validData, value)
      }
    })
    await act(async () => {
      await result.current.handleSubmit()
    })
    expect(result.current.submitStatus).toBe('error')
    expect(result.current.error).toBeInstanceOf(Error)
  })

  it('handleInputChange writes through to the underlying form', () => {
    const { result } = renderHook(() => useContactForm())
    const fakeEvent = {
      target: { name: 'name', value: 'Alice' },
    } as unknown as React.ChangeEvent<HTMLInputElement>
    act(() => {
      result.current.handleInputChange(fakeEvent)
    })
    // formData is read from form.state.values at hook-call time. tanstack/form
    // updates state synchronously; the value lands on form.state.values.
    expect(result.current.form.state.values.name).toBe('Alice')
  })

  it('resetForm restores defaults', () => {
    const { result } = renderHook(() => useContactForm())
    act(() => {
      result.current.form.setFieldValue('name', 'Jane')
    })
    act(() => {
      result.current.resetForm()
    })
    expect(result.current.formData.name).toBe('')
    expect(result.current.submitStatus).toBe('idle')
    expect(result.current.error).toBeNull()
  })

  describe('progressive action state', () => {
    it('passes the imported server action and an idle state to useActionState', () => {
      driveActionState({ status: 'idle' })
      const { result } = renderHook(() => useContactForm())
      expect(useActionStateMock.mock.calls[0]?.[0]).toBe(submitActionMock)
      expect(useActionStateMock.mock.calls[0]?.[1]).toEqual({ status: 'idle' })
      expect(result.current.formAction).toBe(dispatchMock)
    })

    it('real useActionState: idle, no server field errors', () => {
      const { result } = renderHook(() => useContactForm())
      expect(result.current.submitStatus).toBe('idle')
      expect(result.current.error).toBeNull()
      expect(result.current.serverFieldErrors).toEqual({})
      expect(result.current.fromAction).toBe(false)
    })

    it.each([
      ['success', { status: 'success', success: true }],
      ['error', errorState],
    ] as const)('progressive %s is flagged fromAction', (_label, state) => {
      driveActionState(state)
      const { result } = renderHook(() => useContactForm())
      expect(result.current.fromAction).toBe(true)
    })

    it('a hydrated submit after a progressive result clears fromAction', async () => {
      driveActionState(errorState)
      submitMock.mockResolvedValue({ success: false, error: 'rate limited' })
      const { result } = renderHook(() => useContactForm())
      act(() => {
        for (const [key, value] of Object.entries(validData)) {
          result.current.form.setFieldValue(key as keyof typeof validData, value)
        }
        result.current.form.setFieldValue('phone', '')
      })
      await act(async () => {
        await result.current.handleSubmit()
      })
      expect(result.current.submitStatus).toBe('error')
      expect(result.current.fromAction).toBe(false)
    })

    it('resetForm clears fromAction', () => {
      driveActionState({ status: 'success', success: true })
      const { result } = renderHook(() => useContactForm())
      act(() => {
        result.current.resetForm()
      })
      expect(result.current.fromAction).toBe(false)
    })

    it('progressive success: status success and track fires once', () => {
      driveActionState({ status: 'success', success: true })
      const { result, rerender } = renderHook(() => useContactForm())
      expect(result.current.submitStatus).toBe('success')
      rerender()
      expect(trackMock).toHaveBeenCalledTimes(1)
      expect(trackMock).toHaveBeenCalledWith('Contact Submitted', { location: 'contact-form' })
    })

    it('progressive error: surfaces message, field errors and re-populates values', () => {
      driveActionState(errorState)
      const { result } = renderHook(() => useContactForm())
      expect(result.current.submitStatus).toBe('error')
      expect(result.current.error?.message).toBe('Please check your form and try again.')
      expect(result.current.serverFieldErrors).toEqual({
        phone: 'Please enter a valid phone number',
      })
      expect(result.current.formData.name).toBe('Jane Doe')
      expect(result.current.formData.phone).toBe('abc')
      expect(result.current.form.state.values.honeypot).toBe('')
      expect(trackMock).not.toHaveBeenCalled()
    })

    it('hydrated success after a progressive error leaves fields empty and dismisses the error', async () => {
      driveActionState(errorState)
      submitMock.mockResolvedValue({ success: true })
      const { result } = renderHook(() => useContactForm())
      act(() => {
        for (const [key, value] of Object.entries(validData)) {
          result.current.form.setFieldValue(key as keyof typeof validData, value)
        }
        result.current.form.setFieldValue('phone', '')
      })
      await act(async () => {
        await result.current.handleSubmit()
      })
      expect(result.current.submitStatus).toBe('success')
      expect(result.current.error).toBeNull()
      expect(result.current.serverFieldErrors).toEqual({})
      for (const key of ['name', 'email', 'phone', 'message'] as const) {
        expect(result.current.formData[key]).toBe('')
      }
    })

    it('resetForm after a progressive error clears everything', () => {
      driveActionState(errorState)
      const { result } = renderHook(() => useContactForm())
      act(() => {
        result.current.resetForm()
      })
      expect(result.current.submitStatus).toBe('idle')
      expect(result.current.error).toBeNull()
      expect(result.current.serverFieldErrors).toEqual({})
      expect(result.current.formData.name).toBe('')
      expect(result.current.formData.phone).toBe('')
    })

    it('pending action marks the form as submitting', () => {
      driveActionState({ status: 'idle' }, true)
      const { result } = renderHook(() => useContactForm())
      expect(result.current.isSubmitting).toBe(true)
    })
  })
})
