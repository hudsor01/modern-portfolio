// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { DollarSign } from 'lucide-react'
import { Badge } from '../badge'
import { MetricCard } from '../metric-card'
import { alertTypeStyles } from '@/app/projects/revenue-operations-center/data/constants'

/**
 * State variants must keep their own semantic border. Plan 14-06 flattened every
 * resting border to `border-border`, which made variant names such as `success`
 * and `error` lie about what they render.
 */
const restingBorder = (className: string) =>
  className
    .split(/\s+/)
    .find((c) => /^border-(?!(?:\d|x|y|t|b|l|r|s|e)\b)\S+$/.test(c) && !c.includes(':'))

afterEach(cleanup)

describe('state variant borders', () => {
  it('alert type styles each carry a distinct semantic border', () => {
    const borders = Object.values(alertTypeStyles).map(restingBorder)
    expect(new Set(borders).size).toBe(4)
    expect(borders).not.toContain('border-border')
    expect(alertTypeStyles.error).toContain('border-destructive')
    expect(alertTypeStyles.success).toContain('border-success')
    expect(alertTypeStyles.warning).toContain('border-warning')
  })

  it('MetricCard variants do not share a resting border', () => {
    const variants = ['primary', 'secondary', 'success', 'warning', 'info'] as const
    const classes = variants.map((variant) => {
      const { container } = render(
        <MetricCard icon={DollarSign} label="L" value="1" variant={variant} />
      )
      const root = container.firstElementChild as HTMLElement
      return root.className
    })
    const borders = classes.map(restingBorder)
    expect(borders).not.toContain('border-border')
    // primary and info share the primary hue at rest but differ on hover.
    expect(new Set(classes.map((c) => c.match(/hover:border-\S+/)?.[0])).size).toBe(5)
    expect(borders[2]).toBe('border-success/20')
    expect(borders[3]).toBe('border-warning/20')
  })

  it('Badge fill variants keep an authored transparent border, not a grey ring', () => {
    for (const variant of ['default', 'secondary', 'destructive'] as const) {
      const { container } = render(<Badge variant={variant}>x</Badge>)
      const cls = (container.firstElementChild as HTMLElement).className
      expect(cls).toContain('border-transparent')
      expect(cls).not.toContain('border-border')
    }
  })
})
