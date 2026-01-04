import { describe, expect, it } from 'bun:test'
import {
  getErrorVariant,
  createSkeletonConfig,
  EMPTY_STATE_MESSAGES,
  ERROR_MESSAGES,
  isDataEmpty,
  createLoadingDelay,
  withErrorHandling
} from '../loading-patterns'

// Mock React for testing (used by component implementation)
const _React = {
  ...require('react'),
  useContext: () => null,
  createContext: () => ({ Provider: () => null, Consumer: () => null }),
  useState: (initial: unknown) => [initial, () => {}],
  useCallback: (fn: unknown) => fn,
  useEffect: (fn: () => void) => fn(),
  useMemo: (fn: () => unknown) => fn(),
  forwardRef: (fn: unknown) => fn,
  createElement: (type: unknown, props: unknown, ...children: unknown[]) => ({ type, props, children }),
}
void _React // Silence unused warning

describe('Loading Patterns', () => {
  describe('getErrorVariant', () => {
    it('should return network variant for network errors', () => {
      const error = new Error('Network error occurred')
      expect(getErrorVariant(error)).toBe('network')
    })

    it('should return network variant for connection errors', () => {
      expect(getErrorVariant(new Error('Connection failed'))).toBe('network')
    })

    it('should return network variant for fetch errors', () => {
      expect(getErrorVariant(new Error('Fetch failed'))).toBe('network')
    })

    it('should return not-found variant for 404 errors', () => {
      expect(getErrorVariant(new Error('Resource not found 404'))).toBe('not-found')
    })

    it('should return not-found variant for not found errors', () => {
      expect(getErrorVariant(new Error('Item not found'))).toBe('not-found')
    })

    it('should return server variant for server errors', () => {
      expect(getErrorVariant(new Error('Internal server error'))).toBe('server')
    })

    it('should return server variant for 500 errors', () => {
      expect(getErrorVariant(new Error('Error 500 occurred'))).toBe('server')
    })

    it('should return default variant for other errors', () => {
      expect(getErrorVariant(new Error('Unknown error'))).toBe('default')
    })

    it('should handle string errors', () => {
      expect(getErrorVariant('Network error')).toBe('network')
    })
  })

  describe('createSkeletonConfig', () => {
    it('should create metrics skeleton config', () => {
      const config = createSkeletonConfig('metrics')
      expect(config.component).toBe('SkeletonGrid')
      expect(config.props.columns).toBe(3)
      expect(config.props.rows).toBe(1)
    })

    it('should create chart skeleton config', () => {
      const config = createSkeletonConfig('chart')
      expect(config.component).toBe('SkeletonChart')
      expect(config.props.height).toBe(300)
    })

    it('should create table skeleton config', () => {
      const config = createSkeletonConfig('table')
      expect(config.component).toBe('SkeletonGrid')
      expect(config.props.columns).toBe(1)
      expect(config.props.rows).toBe(5)
    })

    it('should create cards skeleton config', () => {
      const config = createSkeletonConfig('cards')
      expect(config.component).toBe('SkeletonGrid')
      expect(config.props.columns).toBe(2)
      expect(config.props.rows).toBe(2)
    })

    it('should create mixed skeleton config', () => {
      const config = createSkeletonConfig('mixed')
      expect(config.component).toBe('mixed')
      expect(config.props.showMetrics).toBe(true)
    })
  })

  describe('Empty State Messages', () => {
    it('should have projects empty state message', () => {
      expect(EMPTY_STATE_MESSAGES.projects).toEqual({
        title: 'No projects found',
        message: 'There are no projects to display at the moment.',
      })
    })

    it('should have metrics empty state message', () => {
      expect(EMPTY_STATE_MESSAGES.metrics).toEqual({
        title: 'No metrics available',
        message: 'Metrics data is not available for the selected time period.',
      })
    })

    it('should have charts empty state message', () => {
      expect(EMPTY_STATE_MESSAGES.charts).toEqual({
        title: 'No chart data',
        message: 'There is no data available to display in the chart.',
      })
    })

    it('should have search empty state message', () => {
      expect(EMPTY_STATE_MESSAGES.search).toEqual({
        title: 'No results found',
        message: 'Try adjusting your search criteria or filters.',
      })
    })

    it('should have data empty state message', () => {
      expect(EMPTY_STATE_MESSAGES.data).toEqual({
        title: 'No data available',
        message: 'Data is not available at the moment.',
      })
    })
  })

  describe('Error Messages', () => {
    it('should have network error message', () => {
      expect(ERROR_MESSAGES.network).toEqual({
        title: 'Connection Error',
        message: 'Unable to connect to the server. Please check your internet connection.',
      })
    })

    it('should have server error message', () => {
      expect(ERROR_MESSAGES.server).toEqual({
        title: 'Server Error',
        message: 'An internal server error occurred. Please try again later.',
      })
    })

    it('should have not found error message', () => {
      expect(ERROR_MESSAGES.notFound).toEqual({
        title: 'Not Found',
        message: 'The requested resource could not be found.',
      })
    })

    it('should have timeout error message', () => {
      expect(ERROR_MESSAGES.timeout).toEqual({
        title: 'Request Timeout',
        message: 'The request took too long to complete. Please try again.',
      })
    })

    it('should have default error message', () => {
      expect(ERROR_MESSAGES.default).toEqual({
        title: 'Something went wrong',
        message: 'An unexpected error occurred. Please try again.',
      })
    })
  })

  describe('isDataEmpty', () => {
    it('should return true for null', () => {
      expect(isDataEmpty(null)).toBe(true)
    })

    it('should return true for undefined', () => {
      expect(isDataEmpty(undefined)).toBe(true)
    })

    it('should return true for empty array', () => {
      expect(isDataEmpty([])).toBe(true)
    })

    it('should return false for non-empty array', () => {
      expect(isDataEmpty([1, 2, 3])).toBe(false)
    })

    it('should return true for empty object', () => {
      expect(isDataEmpty({})).toBe(true)
    })

    it('should return false for non-empty object', () => {
      expect(isDataEmpty({ key: 'value' })).toBe(false)
    })

    it('should return true for empty string', () => {
      expect(isDataEmpty('')).toBe(true)
    })

    it('should return true for whitespace string', () => {
      expect(isDataEmpty('   ')).toBe(true)
    })

    it('should return false for non-empty string', () => {
      expect(isDataEmpty('data')).toBe(false)
    })

    it('should return false for number', () => {
      expect(isDataEmpty(0)).toBe(false)
      expect(isDataEmpty(42)).toBe(false)
    })

    it('should return false for boolean', () => {
      expect(isDataEmpty(true)).toBe(false)
      expect(isDataEmpty(false)).toBe(false)
    })
  })

  describe('createLoadingDelay', () => {
    it('should create a delay with default time', async () => {
      const start = Date.now()
      await createLoadingDelay()
      const end = Date.now()
      
      // Default delay is 300ms, allow for some variation
      expect(end - start).toBeGreaterThanOrEqual(290)
    })

    it('should create a delay with custom time', async () => {
      const start = Date.now()
      await createLoadingDelay(500)
      const end = Date.now()
      
      // Custom delay is 500ms, allow for some variation
      expect(end - start).toBeGreaterThanOrEqual(490)
    })
  })

  describe('withErrorHandling', () => {
    // Store original console.error
    const originalConsoleError = console.error

    it('should return result for successful operation', async () => {
      const result = await withErrorHandling(() => Promise.resolve('success'))
      expect(result).toBe('success')
    })

    it('should return null for failed operation', async () => {
      // Suppress console.error for this test to avoid test output noise
      console.error = () => {}
      try {
        const result = await withErrorHandling(() => Promise.reject(new Error('Test error')))
        expect(result).toBeNull()
      } finally {
        console.error = originalConsoleError
      }
    })

    it('should handle non-Error rejections', async () => {
      // Suppress console.error for this test to avoid test output noise
      console.error = () => {}
      try {
        const result = await withErrorHandling(() => Promise.reject('string error'))
        expect(result).toBeNull()
      } finally {
        console.error = originalConsoleError
      }
    })
  })
})