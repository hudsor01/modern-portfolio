// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { SuccessStories } from '../success-stories'

describe('SuccessStories', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders the "Recent Success" heading', () => {
    render(<SuccessStories />)
    expect(screen.getByText('Recent Success')).toBeTruthy()
  })

  it('renders the 3 success bullets', () => {
    render(<SuccessStories />)
    expect(screen.getByText(/\$4\.8M\+ revenue generated/i)).toBeTruthy()
    expect(screen.getByText(/432% transaction growth/i)).toBeTruthy()
    expect(screen.getByText(/2,217% network expansion/i)).toBeTruthy()
  })

  it('renders the "Real results" subtitle', () => {
    render(<SuccessStories />)
    expect(screen.getByText(/real results from recent partnerships/i)).toBeTruthy()
  })
})
