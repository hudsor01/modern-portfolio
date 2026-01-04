import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, vi } from 'vitest'
import React from 'react'
import type { MockNextImageProps } from '@/types/mock-types'

// =============================================================================
// MODULE-LEVEL MOCKS (Required to be at top level for Vitest hoisting)
// =============================================================================

// Mock Next.js router
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

// Mock Next.js image component with proper typing
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

// Mock Framer Motion to avoid animation issues in tests
const motionMock = {
  div: React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
    function MockMotionDiv(props, ref) {
      return React.createElement('div', { ...props, ref, 'data-testid': 'motion-div' })
    }
  ),
  section: React.forwardRef<HTMLElement, React.ComponentProps<'section'>>(
    function MockMotionSection(props, ref) {
      return React.createElement('section', { ...props, ref, 'data-testid': 'motion-section' })
    }
  ),
  h1: React.forwardRef<HTMLHeadingElement, React.ComponentProps<'h1'>>(
    function MockMotionH1(props, ref) {
      return React.createElement('h1', { ...props, ref, 'data-testid': 'motion-h1' })
    }
  ),
  h2: React.forwardRef<HTMLHeadingElement, React.ComponentProps<'h2'>>(
    function MockMotionH2(props, ref) {
      return React.createElement('h2', { ...props, ref, 'data-testid': 'motion-h2' })
    }
  ),
  h3: React.forwardRef<HTMLHeadingElement, React.ComponentProps<'h3'>>(
    function MockMotionH3(props, ref) {
      return React.createElement('h3', { ...props, ref, 'data-testid': 'motion-h3' })
    }
  ),
  p: React.forwardRef<HTMLParagraphElement, React.ComponentProps<'p'>>(
    function MockMotionP(props, ref) {
      return React.createElement('p', { ...props, ref, 'data-testid': 'motion-p' })
    }
  ),
  span: React.forwardRef<HTMLSpanElement, React.ComponentProps<'span'>>(
    function MockMotionSpan(props, ref) {
      return React.createElement('span', { ...props, ref, 'data-testid': 'motion-span' })
    }
  ),
  button: React.forwardRef<HTMLButtonElement, React.ComponentProps<'button'>>(
    function MockMotionButton(props, ref) {
      return React.createElement('button', { ...props, ref, 'data-testid': 'motion-button' })
    }
  ),
}

vi.mock('framer-motion', () => ({
  motion: motionMock,
  m: motionMock, // Add 'm' export which is an alias for motion
  AnimatePresence: function MockAnimatePresence({ children }: { children: React.ReactNode }) {
    return React.createElement('div', { 'data-testid': 'animate-presence' }, children)
  },
  useAnimation: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn(),
  }),
  useInView: () => true,
}))

// Mock Recharts components
vi.mock('recharts', () => ({
  ResponsiveContainer: function MockResponsiveContainer({
    children,
    ...props
  }: React.PropsWithChildren<Record<string, unknown>>) {
    return React.createElement(
      'div',
      {
        ...props,
        'data-testid': 'responsive-container',
        style: { width: '100%', height: '400px' },
      },
      children
    )
  },
  BarChart: function MockBarChart({
    children,
    ...props
  }: React.PropsWithChildren<Record<string, unknown>>) {
    return React.createElement('div', { ...props, 'data-testid': 'bar-chart' }, children)
  },
  LineChart: function MockLineChart({
    children,
    ...props
  }: React.PropsWithChildren<Record<string, unknown>>) {
    return React.createElement('div', { ...props, 'data-testid': 'line-chart' }, children)
  },
  PieChart: function MockPieChart({
    children,
    ...props
  }: React.PropsWithChildren<Record<string, unknown>>) {
    return React.createElement('div', { ...props, 'data-testid': 'pie-chart' }, children)
  },
  FunnelChart: function MockFunnelChart({
    children,
    ...props
  }: React.PropsWithChildren<Record<string, unknown>>) {
    return React.createElement('div', { ...props, 'data-testid': 'funnel-chart' }, children)
  },
  Line: function MockLine(props: Record<string, unknown>) {
    return React.createElement('div', { ...props, 'data-testid': 'line' })
  },
  Bar: function MockBar(props: Record<string, unknown>) {
    return React.createElement('div', { ...props, 'data-testid': 'bar' })
  },
  Pie: function MockPie(props: Record<string, unknown>) {
    return React.createElement('div', { ...props, 'data-testid': 'pie' })
  },
  Cell: function MockCell(props: Record<string, unknown>) {
    return React.createElement('div', { ...props, 'data-testid': 'cell' })
  },
  XAxis: function MockXAxis(props: Record<string, unknown>) {
    return React.createElement('div', { ...props, 'data-testid': 'x-axis' })
  },
  YAxis: function MockYAxis(props: Record<string, unknown>) {
    return React.createElement('div', { ...props, 'data-testid': 'y-axis' })
  },
  CartesianGrid: function MockCartesianGrid(props: Record<string, unknown>) {
    return React.createElement('div', { ...props, 'data-testid': 'cartesian-grid' })
  },
  Tooltip: function MockTooltip(props: Record<string, unknown>) {
    return React.createElement('div', { ...props, 'data-testid': 'tooltip' })
  },
  Legend: function MockLegend(props: Record<string, unknown>) {
    return React.createElement('div', { ...props, 'data-testid': 'legend' })
  },
}))

// Mock TanStack Query (v5 API - isPending replaces isLoading)
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => ({
    data: null,
    isPending: false, // TanStack Query v5 renamed isLoading to isPending
    isLoading: false, // Kept for backwards compatibility
    isFetching: false,
    error: null,
    isError: false,
    isSuccess: true,
    status: 'success',
    fetchStatus: 'idle',
  })),
  useMutation: vi.fn(() => ({
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    isPending: false, // TanStack Query v5 renamed isLoading to isPending
    isLoading: false, // Kept for backwards compatibility
    error: null,
    isError: false,
    isSuccess: false,
    isIdle: true,
    status: 'idle',
    reset: vi.fn(),
  })),
  QueryClient: vi.fn(() => ({
    setQueryData: vi.fn(),
    getQueryData: vi.fn(),
    invalidateQueries: vi.fn(),
    clear: vi.fn(),
    getQueryState: vi.fn(),
    prefetchQuery: vi.fn(),
  })),
  QueryClientProvider: function MockQueryClientProvider({
    children,
  }: {
    children: React.ReactNode
  }) {
    return React.createElement('div', { 'data-testid': 'query-client-provider' }, children)
  },
  useQueryClient: vi.fn(() => ({
    setQueryData: vi.fn(),
    getQueryData: vi.fn(),
    invalidateQueries: vi.fn(),
    clear: vi.fn(),
    getQueryState: vi.fn(),
    prefetchQuery: vi.fn(),
  })),
}))

// Mock theme provider
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

// =============================================================================
// GLOBAL SETUP (Window/DOM properties)
// =============================================================================

beforeAll(() => {
  // Mock Web APIs not available in JSDOM
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

  Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    })),
  })

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    })),
  })

  // Mock console methods to reduce noise in tests
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

// =============================================================================
// CLEANUP
// =============================================================================

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  vi.clearAllTimers()
  vi.useRealTimers() // Ensure real timers are restored
})
