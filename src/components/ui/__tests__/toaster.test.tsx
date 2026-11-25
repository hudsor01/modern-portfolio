// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, cleanup, act, waitFor } from '@testing-library/react'
import { toast } from 'sonner'
import { Toaster } from '../toaster'

// Simulates an OS that reports a preference for every query it is asked about.
function stubMatchMedia(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  )
}

async function renderToast() {
  const { container } = render(<Toaster />)
  act(() => {
    toast('Light check')
  })
  await waitFor(() => {
    expect(document.querySelector('[data-sonner-toaster]')).not.toBeNull()
  })
  return container
}

describe('Toaster', () => {
  beforeEach(() => {
    cleanup()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders with the light theme', async () => {
    stubMatchMedia(false)
    await renderToast()
    expect(document.querySelector('[data-sonner-toaster]')?.getAttribute('data-sonner-theme')).toBe(
      'light'
    )
  })

  it('stays light when the OS reports a non-light preference', async () => {
    stubMatchMedia(true)
    await renderToast()
    expect(document.querySelector('[data-sonner-toaster]')?.getAttribute('data-sonner-theme')).toBe(
      'light'
    )
  })
})
