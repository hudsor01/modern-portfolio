import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, vi } from 'vitest'
import React from 'react'

// Global test setup
beforeAll(() => {
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

  // Mock Next.js image component
  vi.mock('next/image', () => ({
    default: React.forwardRef<HTMLImageElement, React.ComponentProps<'img'>>((props, ref) => 
      React.createElement('img', { ...props, ref, 'data-testid': 'next-image' })
    ),
  }))

  // Mock Framer Motion to avoid animation issues in tests
  const motionMock = {
    div: React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>((props, ref) =>
      React.createElement('div', { ...props, ref, 'data-testid': 'motion-div' })
    ),
    section: React.forwardRef<HTMLElement, React.ComponentProps<'section'>>((props, ref) =>
      React.createElement('section', { ...props, ref, 'data-testid': 'motion-section' })
    ),
    h1: React.forwardRef<HTMLHeadingElement, React.ComponentProps<'h1'>>((props, ref) =>
      React.createElement('h1', { ...props, ref, 'data-testid': 'motion-h1' })
    ),
    h2: React.forwardRef<HTMLHeadingElement, React.ComponentProps<'h2'>>((props, ref) =>
      React.createElement('h2', { ...props, ref, 'data-testid': 'motion-h2' })
    ),
    h3: React.forwardRef<HTMLHeadingElement, React.ComponentProps<'h3'>>((props, ref) =>
      React.createElement('h3', { ...props, ref, 'data-testid': 'motion-h3' })
    ),
    p: React.forwardRef<HTMLParagraphElement, React.ComponentProps<'p'>>((props, ref) =>
      React.createElement('p', { ...props, ref, 'data-testid': 'motion-p' })
    ),
    span: React.forwardRef<HTMLSpanElement, React.ComponentProps<'span'>>((props, ref) =>
      React.createElement('span', { ...props, ref, 'data-testid': 'motion-span' })
    ),
    button: React.forwardRef<HTMLButtonElement, React.ComponentProps<'button'>>((props, ref) =>
      React.createElement('button', { ...props, ref, 'data-testid': 'motion-button' })
    ),
  }

  vi.mock('framer-motion', () => ({
    motion: motionMock,
    m: motionMock, // Add 'm' export which is an alias for motion
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      React.createElement('div', { 'data-testid': 'animate-presence' }, children),
    useAnimation: () => ({
      start: vi.fn(),
      stop: vi.fn(),
      set: vi.fn(),
    }),
    useInView: () => true,
  }))

  // Mock Recharts components
  vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => 
      React.createElement('div', { 
        ...props, 
        'data-testid': 'responsive-container',
        style: { width: '100%', height: '400px' }
      }, children),
    BarChart: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => 
      React.createElement('div', { 
        ...props, 
        'data-testid': 'bar-chart' 
      }, children),
    LineChart: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => 
      React.createElement('div', { 
        ...props, 
        'data-testid': 'line-chart' 
      }, children),
    PieChart: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => 
      React.createElement('div', { 
        ...props, 
        'data-testid': 'pie-chart' 
      }, children),
    FunnelChart: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => 
      React.createElement('div', { 
        ...props, 
        'data-testid': 'funnel-chart' 
      }, children),
    Line: (props: Record<string, unknown>) => 
      React.createElement('div', { 
        ...props, 
        'data-testid': 'line' 
      }),
    Bar: (props: Record<string, unknown>) => 
      React.createElement('div', { 
        ...props, 
        'data-testid': 'bar' 
      }),
    Pie: (props: Record<string, unknown>) => 
      React.createElement('div', { 
        ...props, 
        'data-testid': 'pie' 
      }),
    Cell: (props: Record<string, unknown>) => 
      React.createElement('div', { 
        ...props, 
        'data-testid': 'cell' 
      }),
    XAxis: (props: Record<string, unknown>) => 
      React.createElement('div', { 
        ...props, 
        'data-testid': 'x-axis' 
      }),
    YAxis: (props: Record<string, unknown>) => 
      React.createElement('div', { 
        ...props, 
        'data-testid': 'y-axis' 
      }),
    CartesianGrid: (props: Record<string, unknown>) => 
      React.createElement('div', { 
        ...props, 
        'data-testid': 'cartesian-grid' 
      }),
    Tooltip: (props: Record<string, unknown>) => 
      React.createElement('div', { 
        ...props, 
        'data-testid': 'tooltip' 
      }),
    Legend: (props: Record<string, unknown>) => 
      React.createElement('div', { 
        ...props, 
        'data-testid': 'legend' 
      }),
  }))

  // Mock TanStack Query
  vi.mock('@tanstack/react-query', () => ({
    useQuery: vi.fn(() => ({
      data: null,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
    })),
    useMutation: vi.fn(() => ({
      mutate: vi.fn(),
      mutateAsync: vi.fn(),
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: false,
    })),
    QueryClient: vi.fn(() => ({
      setQueryData: vi.fn(),
      getQueryData: vi.fn(),
      invalidateQueries: vi.fn(),
      clear: vi.fn(),
    })),
    QueryClientProvider: ({ children }: { children: React.ReactNode }) => 
      React.createElement('div', { 'data-testid': 'query-client-provider' }, children),
    useQueryClient: vi.fn(() => ({
      setQueryData: vi.fn(),
      getQueryData: vi.fn(),
      invalidateQueries: vi.fn(),
      clear: vi.fn(),
    })),
  }))

  // Mock theme provider
  vi.mock('next-themes', () => ({
    useTheme: () => ({
      theme: 'dark',
      setTheme: vi.fn(),
      resolvedTheme: 'dark',
    }),
    ThemeProvider: ({ children }: { children: React.ReactNode }) => 
      React.createElement('div', { 'data-testid': 'theme-provider' }, children),
  }))

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

  // Mock console methods to avoid noise in tests
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

// Cleanup after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  vi.clearAllTimers()
  vi.useRealTimers() // Ensure real timers are restored
})