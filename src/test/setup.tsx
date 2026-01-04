// happy-dom is registered in happydom.ts (loaded first via bunfig.toml preload)
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, vi, mock } from 'bun:test'
import React from 'react'
import type { MockNextImageProps } from '@/types/mock-types'

// =============================================================================
// VITEST COMPATIBILITY LAYER
// Add missing Vitest APIs to Bun's vi object
// =============================================================================

const stubbedGlobals = new Map()

// Extend vi with missing Vitest APIs
const viExt = vi as Record<string, unknown>

// stubGlobal - stores original and sets mock on globalThis AND window
viExt.stubGlobal = function stubGlobal(name: string, value: unknown) {
  if (!stubbedGlobals.has(name)) {
    stubbedGlobals.set(name, (globalThis as Record<string, unknown>)[name])
  }
  (globalThis as Record<string, unknown>)[name] = value
  // Also set on window for DOM environments
  if (typeof window !== 'undefined') {
    (window as unknown as Record<string, unknown>)[name] = value
  }
}

// unstubAllGlobals - restores all stubbed globals on both globalThis and window
viExt.unstubAllGlobals = function unstubAllGlobals() {
  stubbedGlobals.forEach((original, name) => {
    (globalThis as Record<string, unknown>)[name] = original
    if (typeof window !== 'undefined') {
      (window as unknown as Record<string, unknown>)[name] = original
    }
  })
  stubbedGlobals.clear()
}

// mocked - just returns the mock (no-op in Bun)
viExt.mocked = function mocked(item: unknown) { return item }

// doMock - alias for vi.mock
viExt.doMock = vi.mock

// hoisted - just executes the function and returns result
viExt.hoisted = function hoisted(fn: () => unknown) { return fn() }

// =============================================================================
// FAKE TIMER STUBS (NOT SUPPORTED IN BUN - these are no-ops)
// Bun does NOT support timer mocking yet. These stubs prevent crashes.
// Tests using these will need to be refactored for real timers.
// =============================================================================

// advanceTimersByTime - stub (Bun doesn't support timer mocking)
viExt.advanceTimersByTime = function advanceTimersByTime(_ms: number) {
  // No-op: Bun doesn't support timer mocking
  return vi
}

// runAllTimers - stub (Bun doesn't support timer mocking)
viExt.runAllTimers = function runAllTimers() {
  // No-op: Bun doesn't support timer mocking
  return vi
}

// runAllTimersAsync - stub (Bun doesn't support timer mocking)
viExt.runAllTimersAsync = async function runAllTimersAsync() {
  // No-op: Bun doesn't support timer mocking
  return vi
}

// runOnlyPendingTimers - stub
viExt.runOnlyPendingTimers = function runOnlyPendingTimers() {
  return vi
}

// runOnlyPendingTimersAsync - stub
viExt.runOnlyPendingTimersAsync = async function runOnlyPendingTimersAsync() {
  return vi
}

// advanceTimersToNextTimer - stub
viExt.advanceTimersToNextTimer = function advanceTimersToNextTimer() {
  return vi
}

// advanceTimersToNextTimerAsync - stub
viExt.advanceTimersToNextTimerAsync = async function advanceTimersToNextTimerAsync() {
  return vi
}

// getTimerCount - stub
viExt.getTimerCount = function getTimerCount() {
  return 0
}

// =============================================================================
// ESSENTIAL MODULE-LEVEL MOCKS ONLY
// Using Bun's native mock.module() API (preferred over vi.mock)
// =============================================================================

// Mock server-only (throws when imported outside server context)
mock.module('server-only', () => ({}))

// Mock Next.js router
mock.module('next/navigation', () => ({
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

// Mock Next.js image component with proper typing
mock.module('next/image', () => ({
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

// Mock theme provider
mock.module('next-themes', () => ({
  useTheme: () => ({
    theme: 'dark',
    setTheme: vi.fn(),
    resolvedTheme: 'dark',
  }),
  ThemeProvider: function MockThemeProvider({ children }: { children: React.ReactNode }) {
    return React.createElement('div', { 'data-testid': 'theme-provider' }, children)
  },
}))

// Lightweight Framer Motion mock - just pass-through elements
mock.module('framer-motion', () => {
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

// Lightweight Recharts mock - minimal stubs
mock.module('recharts', () => ({
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

// Unified next/dynamic mock - handles all dynamic import patterns
mock.module('next/dynamic', () => ({
  default: (_importFn: unknown, options?: { ssr?: boolean; loading?: unknown }) => {
    // Return a simple mock component for all dynamic imports
    const MockComponent = () => {
      // Determine testid based on options
      let testId = 'dynamic-component'
      if (options?.ssr === false) {
        testId = 'dynamic-chart'
      }
      return React.createElement('div', { 'data-testid': testId }, 'Mock Dynamic Component')
    }
    return MockComponent
  },
}))

// Lightweight TanStack Query mock
mock.module('@tanstack/react-query', () => ({
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
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

// =============================================================================
// CLEANUP
// =============================================================================

afterEach(() => {
  // Cleanup React Testing Library (unmounts components, clears DOM)
  cleanup()

  // Clear all mocks
  vi.clearAllMocks()

  // Note: Don't manually clear document.body.innerHTML - this breaks happy-dom's cache
  // The cleanup() function from RTL handles DOM cleanup properly

  // Only clear timers if fake timers are active
  try {
    vi.useRealTimers()
  } catch {
    // Timers weren't faked, ignore
  }
})
