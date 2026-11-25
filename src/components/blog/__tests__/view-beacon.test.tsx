// @vitest-environment jsdom
import { render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ViewBeacon } from '../view-beacon'

afterEach(() => {
  vi.restoreAllMocks()
  Object.defineProperty(navigator, 'webdriver', { value: false, configurable: true })
})

describe('ViewBeacon', () => {
  it('sends one beacon for the post', () => {
    Object.defineProperty(navigator, 'webdriver', { value: false, configurable: true })
    const beacon = vi.fn(() => true)
    Object.defineProperty(navigator, 'sendBeacon', { value: beacon, configurable: true })
    render(<ViewBeacon slug="lead-scoring" />)
    expect(beacon).toHaveBeenCalledTimes(1)
    expect(beacon).toHaveBeenCalledWith('/api/blog/lead-scoring/view')
  })

  it('never counts automated browsers (e2e runs)', () => {
    Object.defineProperty(navigator, 'webdriver', { value: true, configurable: true })
    const beacon = vi.fn(() => true)
    Object.defineProperty(navigator, 'sendBeacon', { value: beacon, configurable: true })
    render(<ViewBeacon slug="lead-scoring" />)
    expect(beacon).not.toHaveBeenCalled()
  })
})
