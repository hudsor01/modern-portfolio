// @vitest-environment jsdom
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { Button } from '../button'
import { Badge } from '../badge'

describe('white text on copper fills', () => {
  afterEach(cleanup)

  it.each(['outline', 'ghost'] as const)('Button %s hover uses white text', (variant) => {
    render(<Button variant={variant}>Go</Button>)
    const cls = screen.getByRole('button').className
    expect(cls).toContain('hover:text-white')
    expect(cls).not.toContain('hover:text-accent-foreground')
  })

  it('Badge outline anchor hover uses white text', () => {
    render(
      <Badge variant="outline" asChild>
        <a href="/x">tag</a>
      </Badge>
    )
    const cls = screen.getByText('tag').className
    expect(cls).toContain('[a&]:hover:text-white')
    expect(cls).not.toContain('text-accent-foreground')
  })

  it('SelectItem focus fill uses white text', () => {
    const src = readFileSync(join(__dirname, '..', 'select.tsx'), 'utf8')
    expect(src).toContain('focus:bg-accent focus:text-white')
    expect(src).not.toContain('focus:text-accent-foreground')
  })
})
