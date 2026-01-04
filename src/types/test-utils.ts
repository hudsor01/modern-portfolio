/**
 * Test Utility Types - Type-Safe Testing Infrastructure
 * Following type-first architecture principles for testing
 */

import { ReactNode, AnchorHTMLAttributes, ImgHTMLAttributes } from 'react'
import { RenderOptions } from '@testing-library/react'

// Re-export mock types for convenience
export type {
  MockDatabaseClient,
  MockPrismaModelOperations,
  BlogPostMockData,
  AuthorMockData,
  CategoryMockData,
  TagMockData,
  ContactSubmissionMockData,
  ProjectMockData,
  MockNextRouter,
  MockNextImageProps as MockImageProps,
  MockNextLinkProps as MockLinkProps,
  MockUseQueryResult,
  MockUseMutationResult,
  MockQueryClient,
  MockMotion,
  MockAnimatePresenceProps,
  MockAnimationControls,
  MockFetchResponse,
  MockNextRequest,
  MockFactory,
  MockCompatible,
  PartialMock,
} from './mock-types'

export { isMockFunction, hasMockMethods } from './mock-types'

/**
 * Mock Next.js Link component props
 * Used for mocking next/link in tests
 */
export interface MockNextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: ReactNode
  prefetch?: boolean
  replace?: boolean
  scroll?: boolean
  shallow?: boolean
  passHref?: boolean
  locale?: string | false
  legacyBehavior?: boolean
}

/**
 * Mock Next.js Image component props
 * Used for mocking next/image in tests
 */
export interface MockNextImageProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'alt'
> {
  src: string
  alt: string
  width?: number | string
  height?: number | string
  fill?: boolean
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  unoptimized?: boolean
  onLoadingComplete?: (result: { naturalWidth: number; naturalHeight: number }) => void
}

/**
 * Mock navigation component props
 * Used for mocking navigation components in tests
 */
export interface MockBackButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  label: string
}

/**
 * Mock breadcrumb item type
 */
export interface MockBreadcrumbItem {
  label: string
  href?: string
}

/**
 * Mock navigation breadcrumbs props
 */
export interface MockNavigationBreadcrumbsProps {
  items?: MockBreadcrumbItem[]
  currentPage?: string
}

/**
 * Mock STAR chart data type
 */
export interface MockSTARChartData {
  phase: string
  impact: number
  efficiency: number
  value: number
}

/**
 * Mock STAR area chart props
 */
export interface MockSTARAreaChartProps {
  data: Record<string, MockSTARChartData>
  title?: string
}

/**
 * Chart event data type for property-based testing
 */
export interface ChartEventData {
  activeTooltipIndex?: number
  activeLabel?: string
  activePayload?: Array<{
    payload: Record<string, string | number>
    value?: number
    name?: string
    dataKey?: string
    color?: string
    type?: string
  }>
  chartX?: number
  chartY?: number
  activeCoordinate?: {
    x: number
    y: number
  }
}

/**
 * Mock component props interface
 */
export interface MockComponentProps<T = Record<string, unknown>> {
  props: T
  children?: ReactNode
}

/**
 * Test render options interface
 */
export interface TestRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  wrapper?: React.ComponentType<{ children: ReactNode }>
  initialProps?: Record<string, unknown>
  queryClient?: unknown // Avoid importing QueryClient to prevent circular deps
  theme?: 'light' | 'dark' | 'system'
  router?: {
    pathname?: string
    query?: Record<string, string>
    push?: (url: string) => void
    replace?: (url: string) => void
  }
}

/**
 * Generic utility types for testing
 */

/**
 * Deep partial type - makes all properties optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/**
 * Non-empty array type - ensures array has at least one element
 */
export type NonEmptyArray<T> = [T, ...T[]]

/**
 * Event handler type - generic event handler function
 */
export type EventHandler<T = Event> = (event: T) => void

/**
 * Mock function type - represents a mocked function
 * Note: Using 'any' for function parameters is necessary for mock function flexibility
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MockFunction<T extends (...args: any[]) => any> = T & {
  mockReturnValue: (value: ReturnType<T>) => MockFunction<T>
  mockResolvedValue: (value: ReturnType<T>) => MockFunction<T>
  mockRejectedValue: (error: Error | unknown) => MockFunction<T>
  mockImplementation: (fn: T) => MockFunction<T>
  mockClear: () => void
  mockReset: () => void
  mockRestore: () => void
}

/**
 * Test data factory type - for creating test data
 */
export type TestDataFactory<T> = (overrides?: DeepPartial<T>) => T

/**
 * Test assertion helper types
 */
export interface TestAssertion<T> {
  value: T
  toBe: (expected: T) => void
  toEqual: (expected: T) => void
  toContain: (expected: unknown) => void
  toHaveLength: (expected: number) => void
  toBeNull: () => void
  toBeUndefined: () => void
  toBeTruthy: () => void
  toBeFalsy: () => void
}

/**
 * Test context type - for sharing data between tests
 */
export interface TestContext<T = Record<string, unknown>> {
  data: T
  setup: () => Promise<void> | void
  teardown: () => Promise<void> | void
}

/**
 * Mock API response type
 */
export interface MockApiResponse<T = unknown> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
  ok: boolean
}

/**
 * Test environment configuration
 */
export interface TestEnvironmentConfig {
  jsdom?: {
    url?: string
    referrer?: string
    contentType?: string
    userAgent?: string
  }
  mocks?: {
    fetch?: boolean
    localStorage?: boolean
    sessionStorage?: boolean
    intersectionObserver?: boolean
    resizeObserver?: boolean
  }
  providers?: {
    queryClient?: boolean
    theme?: boolean
    router?: boolean
  }
}

/**
 * Property-based test configuration
 */
export interface PropertyTestConfig<T> {
  generator: () => T
  predicate: (value: T) => boolean
  iterations?: number
  seed?: number
  verbose?: boolean
}

/**
 * Test suite configuration
 */
export interface TestSuiteConfig {
  name: string
  setup?: () => Promise<void> | void
  teardown?: () => Promise<void> | void
  timeout?: number
  retries?: number
  parallel?: boolean
}

/**
 * Component test props - for testing React components
 */
export interface ComponentTestProps<P = Record<string, unknown>> {
  component: React.ComponentType<P>
  defaultProps: P
  testCases: Array<{
    name: string
    props?: DeepPartial<P>
    expectedBehavior: string
  }>
}

/**
 * Hook test configuration - for testing custom hooks
 */
export interface HookTestConfig<T, P = unknown[]> {
  hook: (...args: P extends unknown[] ? P : [P]) => T
  initialProps?: P extends unknown[] ? P : [P]
  expectedInitialValue?: T
}

/**
 * Integration test configuration
 */
export interface IntegrationTestConfig {
  name: string
  setup: () => Promise<void> | void
  execute: () => Promise<void> | void
  verify: () => Promise<void> | void
  cleanup: () => Promise<void> | void
}

/**
 * Performance test configuration
 */
export interface PerformanceTestConfig {
  name: string
  operation: () => Promise<void> | void
  maxExecutionTime: number
  iterations?: number
  warmupIterations?: number
}

/**
 * Accessibility test configuration
 */
export interface AccessibilityTestConfig {
  component: React.ComponentType<Record<string, unknown>>
  props?: Record<string, unknown>
  rules?: string[]
  skipRules?: string[]
}
