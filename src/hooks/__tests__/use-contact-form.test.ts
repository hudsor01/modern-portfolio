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

const { submitMock } = vi.hoisted(() => ({ submitMock: vi.fn() }))
vi.mock('@/app/contact/actions', () => ({
  submitContactForm: submitMock,
}))

import { useContactForm } from '@/hooks/use-contact-form'

const validData = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  message: 'Hello, I would like to discuss a project opportunity.',
}

beforeEach(() => {
  submitMock.mockReset()
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
})
