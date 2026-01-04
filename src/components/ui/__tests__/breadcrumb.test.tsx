import { describe, expect, it } from 'bun:test'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis
} from '../breadcrumb'

// Mock React for testing (used by component implementation)
const _React = {
  ...require('react'),
  forwardRef: (fn: unknown) => fn,
  isValidElement: (el: unknown) => typeof el === 'object' && el !== null,
  cloneElement: (el: Record<string, unknown>, props: Record<string, unknown>) => ({ ...el, props: { ...(el.props as Record<string, unknown>), ...props } }),
}
void _React // Silence unused warning

describe('Breadcrumb Components', () => {
  describe('Breadcrumb', () => {
    it('should be a function', () => {
      expect(typeof Breadcrumb).toBe('function')
    })
  })

  describe('BreadcrumbList', () => {
    it('should be a function', () => {
      expect(typeof BreadcrumbList).toBe('function')
    })
  })

  describe('BreadcrumbItem', () => {
    it('should be a function', () => {
      expect(typeof BreadcrumbItem).toBe('function')
    })
  })

  describe('BreadcrumbLink', () => {
    it('should be a forwardRef component', () => {
      // forwardRef creates an object with $$typeof property, not a plain function
      expect(BreadcrumbLink).toBeDefined()
      expect(typeof BreadcrumbLink).toBe('object')
    })

    it('should have correct display name', () => {
      expect(BreadcrumbLink.displayName).toBe('BreadcrumbLink')
    })
  })

  describe('BreadcrumbPage', () => {
    it('should be a function', () => {
      expect(typeof BreadcrumbPage).toBe('function')
    })
  })

  describe('BreadcrumbSeparator', () => {
    it('should be a function', () => {
      expect(typeof BreadcrumbSeparator).toBe('function')
    })
  })

  describe('BreadcrumbEllipsis', () => {
    it('should be a function', () => {
      expect(typeof BreadcrumbEllipsis).toBe('function')
    })
  })

  // Test that components render without errors
  describe('Rendering', () => {
    it('should render Breadcrumb without errors', () => {
      const element = Breadcrumb({ children: 'test' })
      expect(element).toBeDefined()
    })

    it('should render BreadcrumbList without errors', () => {
      const element = BreadcrumbList({ children: 'test' })
      expect(element).toBeDefined()
    })

    it('should render BreadcrumbItem without errors', () => {
      const element = BreadcrumbItem({ children: 'test' })
      expect(element).toBeDefined()
    })

    it('should have BreadcrumbLink defined as a forwardRef', () => {
      // forwardRef components are objects, not directly callable
      expect(BreadcrumbLink).toBeDefined()
      expect(BreadcrumbLink.displayName).toBe('BreadcrumbLink')
    })

    it('should render BreadcrumbPage without errors', () => {
      const element = BreadcrumbPage({ children: 'test' })
      expect(element).toBeDefined()
    })

    it('should render BreadcrumbSeparator without errors', () => {
      const element = BreadcrumbSeparator({ children: 'test' })
      expect(element).toBeDefined()
    })

    it('should render BreadcrumbEllipsis without errors', () => {
      const element = BreadcrumbEllipsis({ children: 'test' })
      expect(element).toBeDefined()
    })
  })
})