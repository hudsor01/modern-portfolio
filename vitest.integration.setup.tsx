/**
 * Vitest Integration Test Setup
 * For React component tests with DOM environment
 *
 * @see https://vitest.dev/config/#setupfiles
 * @see https://testing-library.com/docs/react-testing-library/setup
 */

import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, vi } from 'vitest'
import React from 'react'
import type { MockNextImageProps } from '@/types/mock-types'

// =============================================================================
// VITEST COMPATIBILITY EXTENSIONS
// =============================================================================

// Extend vi with missing APIs from our Bun setup
const viExt = vi as Record<string, unknown>

// stubGlobal - for mocking global variables
viExt.stubGlobal = function stubGlobal(name: string, value: unknown) {
  vi.stubGlobal(name, value) // Vitest has this built-in
}

// unstubAllGlobals
viExt.unstubAllGlobals = function unstubAllGlobals() {
  vi.unstubAllGlobals() // Vitest has this built-in
}

// mocked - just returns the mock
viExt.mocked = function mocked(item: unknown) {
  return item
}

// doMock - alias for vi.mock
viExt.doMock = vi.mock

// hoisted - executes function and returns result
viExt.hoisted = function hoisted(fn: () => unknown) {
  return fn()
}

// =============================================================================
// ESSENTIAL MODULE MOCKS
// =============================================================================

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
  notFound: vi.fn(),
}))

// Mock Next.js image
vi.mock('next/image', () => ({
  default: React.forwardRef<HTMLImageElement, MockNextImageProps>(
    function MockNextImage(props, ref) {
      const { src, alt, ...rest } = props
      return React.createElement('img', {
        ...rest,
        src: typeof src === 'string' ? src : '',
        alt,
        ref,
        'data-testid': 'next-image',
      })
    }
  ),
}))

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'dark',
    setTheme: vi.fn(),
    resolvedTheme: 'dark',
  }),
  ThemeProvider: function MockThemeProvider({ children }: { children: React.ReactNode }) {
    return React.createElement('div', { 'data-testid': 'theme-provider' }, children)
  },
}))

// Lightweight Framer Motion mock
vi.mock('framer-motion', () => {
  const motion = {
    div: React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>((props, ref) =>
      React.createElement('div', { ...props, ref })
    ),
    section: React.forwardRef<HTMLElement, React.ComponentProps<'section'>>((props, ref) =>
      React.createElement('section', { ...props, ref })
    ),
    h1: React.forwardRef<HTMLHeadingElement, React.ComponentProps<'h1'>>((props, ref) =>
      React.createElement('h1', { ...props, ref })
    ),
    h2: React.forwardRef<HTMLHeadingElement, React.ComponentProps<'h2'>>((props, ref) =>
      React.createElement('h2', { ...props, ref })
    ),
    h3: React.forwardRef<HTMLHeadingElement, React.ComponentProps<'h3'>>((props, ref) =>
      React.createElement('h3', { ...props, ref })
    ),
    p: React.forwardRef<HTMLParagraphElement, React.ComponentProps<'p'>>((props, ref) =>
      React.createElement('p', { ...props, ref })
    ),
    span: React.forwardRef<HTMLSpanElement, React.ComponentProps<'span'>>((props, ref) =>
      React.createElement('span', { ...props, ref })
    ),
    button: React.forwardRef<HTMLButtonElement, React.ComponentProps<'button'>>((props, ref) =>
      React.createElement('button', { ...props, ref })
    ),
  }

  return {
    motion,
    m: motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    useAnimation: () => ({ start: vi.fn(), stop: vi.fn(), set: vi.fn() }),
    useInView: () => true,
  }
})

// Lightweight Recharts mock
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: React.PropsWithChildren) =>
    React.createElement('div', { 'data-testid': 'chart-container' }, children),
  BarChart: ({ children }: React.PropsWithChildren) => React.createElement('div', null, children),
  LineChart: ({ children }: React.PropsWithChildren) => React.createElement('div', null, children),
  AreaChart: ({ children }: React.PropsWithChildren) => React.createElement('div', null, children),
  PieChart: ({ children }: React.PropsWithChildren) => React.createElement('div', null, children),
  FunnelChart: ({ children }: React.PropsWithChildren) => React.createElement('div', null, children),
  ComposedChart: ({ children }: React.PropsWithChildren) => React.createElement('div', null, children),
  ScatterChart: ({ children }: React.PropsWithChildren) => React.createElement('div', null, children),
  RadarChart: ({ children }: React.PropsWithChildren) => React.createElement('div', null, children),
  RadialBarChart: ({ children }: React.PropsWithChildren) => React.createElement('div', null, children),
  Treemap: ({ children }: React.PropsWithChildren) => React.createElement('div', null, children),
  Line: () => null,
  Bar: () => null,
  Area: () => null,
  Pie: () => null,
  Cell: () => null,
  Scatter: () => null,
  Radar: () => null,
  RadialBar: () => null,
  Funnel: () => null,
  XAxis: () => null,
  YAxis: () => null,
  ZAxis: () => null,
  CartesianGrid: () => null,
  PolarGrid: () => null,
  PolarAngleAxis: () => null,
  PolarRadiusAxis: () => null,
  Tooltip: () => null,
  Legend: () => null,
  Brush: () => null,
  ReferenceLine: () => null,
  ReferenceArea: () => null,
  ReferenceDot: () => null,
  LabelList: () => null,
  Label: () => null,
  ErrorBar: () => null,
  Sector: () => null,
  Curve: () => null,
  Rectangle: () => null,
  Cross: () => null,
  Symbols: () => null,
  Customized: () => null,
}))

// Mock next/dynamic
vi.mock('next/dynamic', () => ({
  default: (_importFn: unknown, options?: { ssr?: boolean; loading?: unknown }) => {
    const MockComponent = () => {
      let testId = 'dynamic-component'
      if (options?.ssr === false) {
        testId = 'dynamic-chart'
      }
      return React.createElement('div', { 'data-testid': testId }, 'Mock Dynamic Component')
    }
    return MockComponent
  },
}))

// Mock nuqs
vi.mock('nuqs', () => ({
  useQueryState: (_key: string, options?: { defaultValue?: unknown }) => {
    const [state, setState] = React.useState(options?.defaultValue ?? null)
    return [state, setState]
  },
  useQueryStates: (keys: Record<string, { defaultValue?: unknown }>) => {
    const initialState = Object.fromEntries(
      Object.entries(keys).map(([k, v]) => [k, v.defaultValue ?? null])
    )
    const [state, setState] = React.useState(initialState)
    return [state, setState]
  },
  parseAsString: { defaultValue: '' },
  parseAsInteger: { defaultValue: 0 },
  parseAsBoolean: { defaultValue: false },
  parseAsArrayOf: () => ({ defaultValue: [] }),
  parseAsJson: () => ({ defaultValue: null }),
}))

// Mock TanStack Query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => ({
    data: null,
    isPending: false,
    isLoading: false,
    error: null,
    isError: false,
    isSuccess: true,
  })),
  useMutation: vi.fn(() => ({
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    isPending: false,
    isLoading: false,
    error: null,
    isError: false,
    isSuccess: false,
    isIdle: true,
    reset: vi.fn(),
  })),
  QueryClient: vi.fn(() => ({
    setQueryData: vi.fn(),
    getQueryData: vi.fn(),
    invalidateQueries: vi.fn(),
    clear: vi.fn(),
  })),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
  useQueryClient: vi.fn(() => ({
    setQueryData: vi.fn(),
    getQueryData: vi.fn(),
    invalidateQueries: vi.fn(),
  })),
}))

// Mock server-only (for Next.js server components)
vi.mock('server-only', () => ({}))

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string | { name: string }) => {
      const cookieName = typeof name === 'string' ? name : name.name
      return cookieName === '__csrf_token' ? { name: cookieName, value: 'mock-token' } : undefined
    },
    set: () => {},
    delete: () => {},
    has: () => false,
    getAll: () => [],
    size: 0,
  }),
  headers: async () => ({
    get: () => null,
    has: () => false,
    entries: () => [][Symbol.iterator](),
    keys: () => [][Symbol.iterator](),
    values: () => [][Symbol.iterator](),
    forEach: () => {},
    append: () => {},
    delete: () => {},
    set: () => {},
    getSetCookie: () => [],
  }),
  draftMode: async () => ({
    isEnabled: false,
    enable: () => {},
    disable: () => {},
  }),
}))

// =============================================================================
// GLOBAL SETUP
// =============================================================================

beforeAll(() => {
  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })

  // Suppress console noise in tests
  const originalError = console.error
  const originalWarn = console.warn

  vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
    // Suppress React act() warnings
    const message = String(args[0])
    if (message.includes('act(') || message.includes('not wrapped in act')) {
      return
    }
    // Log other errors
    originalError.apply(console, args)
  })

  vi.spyOn(console, 'warn').mockImplementation((...args: unknown[]) => {
    // Suppress React warnings
    const message = String(args[0])
    if (message.includes('act(') || message.includes('not wrapped in act')) {
      return
    }
    originalWarn.apply(console, args)
  })
})

// =============================================================================
// CLEANUP
// =============================================================================

afterEach(() => {
  // Cleanup React Testing Library (unmounts components, clears DOM)
  cleanup()

  // Clear all mocks
  vi.clearAllMocks()

  // Restore real timers
  try {
    vi.useRealTimers()
  } catch {
    // Timers weren't faked, ignore
  }
})
