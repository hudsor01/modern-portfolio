import { describe, expect, it } from 'bun:test'
import { Separator } from '../separator'

// Mock React for testing (used by component implementation)
const _React = {
  ...require('react'),
}
void _React // Silence unused warning

describe('Separator', () => {
  it('should be a function', () => {
    expect(typeof Separator).toBe('function')
  })

  // Test that the component renders without errors
  it('should render without errors', () => {
    const element = Separator({})
    expect(element).toBeDefined()
  })

  // Test that component has expected properties
  it('should have expected properties', () => {
    // The actual component is a function that returns a React element
    // We can't easily test the implementation without a full React environment
    // But we can at least verify it exists and is callable
    expect(Separator).toBeInstanceOf(Function)
  })
})