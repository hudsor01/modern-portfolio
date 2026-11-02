// @vitest-environment jsdom
import { cloneElement } from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { LeadSourceTooltip } from '../LeadSourcePieChart'

const organic = {
  name: 'Organic Search',
  value: 50,
  payload: { name: 'Organic Search', value: 50 },
}

beforeEach(() => {
  cleanup()
})

describe('LeadSourceTooltip', () => {
  // recharts renders an element `content` via cloneElement(content, props), so
  // `total` passed by the chart must survive the merge with the tooltip props.
  it('keeps the chart-supplied total when recharts merges in active/payload', () => {
    const element = cloneElement(<LeadSourceTooltip total={200} />, {
      active: true,
      payload: [organic],
    })
    render(element)
    expect(screen.getByText('Organic Search')).toBeTruthy()
    expect(screen.getByText('50')).toBeTruthy()
    expect(screen.getByText('25.0%')).toBeTruthy()
  })

  it('shows the performance line only when the datum has growth', () => {
    const withGrowth = { ...organic, payload: { ...organic.payload, growth: '+12%' } }
    const { rerender } = render(<LeadSourceTooltip total={200} active payload={[withGrowth]} />)
    expect(screen.getByText('+12%')).toBeTruthy()

    rerender(<LeadSourceTooltip total={200} active payload={[organic]} />)
    expect(screen.queryByText(/Performance/)).toBeNull()
  })

  it('renders nothing while inactive or without a payload', () => {
    const { container, rerender } = render(
      <LeadSourceTooltip total={200} active={false} payload={[organic]} />
    )
    expect(container.innerHTML).toBe('')

    rerender(<LeadSourceTooltip total={200} active payload={[]} />)
    expect(container.innerHTML).toBe('')
  })
})
