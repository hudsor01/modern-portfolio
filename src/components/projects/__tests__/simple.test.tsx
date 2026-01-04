/**
 * @vitest-environment jsdom
 */
import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('Simple DOM Test', () => {
  test('basic DOM test', () => {
    expect(document).toBeDefined()
    expect(window).toBeDefined()
  })

  test('basic render test', () => {
    render(<div data-testid="test">Hello World</div>)
    expect(screen.getByTestId('test')).toBeInTheDocument()
  })
})
