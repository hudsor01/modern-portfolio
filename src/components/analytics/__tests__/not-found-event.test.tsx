// @vitest-environment jsdom
import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const track = vi.fn()
vi.mock('@vercel/analytics', () => ({ track: (...args: unknown[]) => track(...args) }))

import { NotFoundEvent } from '../not-found-event'

describe('NotFoundEvent', () => {
  it('sends one Not Found event with the missing path and template kind', () => {
    window.history.pushState({}, '', '/projects/old-slug')
    render(<NotFoundEvent kind="project" />)
    expect(track).toHaveBeenCalledTimes(1)
    expect(track).toHaveBeenCalledWith('Not Found', {
      target: '/projects/old-slug',
      location: 'project',
    })
  })
})
