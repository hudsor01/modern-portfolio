// @vitest-environment jsdom
import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import DealFunnel from '../DealFunnelPageContent'

beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
})

describe('DealFunnel first render', () => {
  it('shows metrics synchronously with no loading state', () => {
    render(<DealFunnel />)
    for (const label of ['Total Opportunities', 'Closed Deals', 'Deal Size', 'Days to Close']) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0)
    }
    expect(screen.queryByRole('status')).toBeNull()
    expect(screen.queryByLabelText('Loading')).toBeNull()
  })

  it('server-renders the content', () => {
    const html = renderToString(<DealFunnel />)
    expect(html).toContain('Total Opportunities')
    expect(html).not.toContain('aria-label="Loading"')
  })
})
