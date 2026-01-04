import '@testing-library/jest-dom/vitest'
import { afterEach, beforeAll, vi } from 'vitest'
import React from 'react'
import type { MockNextImageProps } from '@/types/mock-types'

// =============================================================================
// ESSENTIAL MODULE-LEVEL MOCKS ONLY
// Heavy mocks (Recharts, Framer Motion, TanStack Query) moved to individual tests
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

// Lightweight Framer Motion mock - just pass-through elements
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

// Lightweight Recharts mock - minimal stubs
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: React.PropsWithChildren) =>
    React.createElement('div', { 'data-testid': 'chart-container' }, children),
  BarChart: ({ children }: React.PropsWithChildren) => React.createElement('div', null, children),
  LineChart: ({ children }: React.PropsWithChildren) => React.createElement('div', null, children),
  PieChart: ({ children }: React.PropsWithChildren) => React.createElement('div', null, children),
  FunnelChart: ({ children }: React.PropsWithChildren) => React.createElement('div', null, children),
  Line: () => null,
  Bar: () => null,
  Pie: () => null,
  Cell: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}))

// Lightweight TanStack Query mock
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
  vi.clearAllMocks()
  vi.clearAllTimers()
  vi.useRealTimers()
})
