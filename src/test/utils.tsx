import React, { ReactElement } from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { vi } from '@/test/vitest-compat'
import type { TestRenderOptions } from '@/types/test-utils'
import {
  createTestDataFactory,
  createMockFunction,
  runPropertyTest,
  createMockResponse,
} from './test-factories'

// Mock Next.js router for testing
const mockRouter = {
  back: vi.fn(),
  forward: vi.fn(),
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
}

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}

const customRender = (ui: ReactElement, options?: TestRenderOptions) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }

// Custom render for components that need specific providers
export const renderWithQueryClient = (ui: ReactElement, queryClient?: QueryClient) => {
  const testQueryClient =
    queryClient ||
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: 0,
          gcTime: 0,
        },
        mutations: {
          retry: false,
        },
      },
    })

  return render(<QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>)
}

// Mock fetch utility
export const mockFetch = (
  mockImplementation?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
) => {
  const mockFn = vi.fn(mockImplementation || (() => createMockResponse({})))
  // Use vi.stubGlobal from our compatibility layer
  vi.stubGlobal('fetch', mockFn)
  return mockFn
}

// Wait for async operations to complete
export const waitForAsyncOperations = () => new Promise((resolve) => setTimeout(resolve, 0))

// Mock router utility
export const mockNextRouter = (overrides = {}) => {
  vi.mock('next/navigation', () => ({
    useRouter: () => ({ ...mockRouter, ...overrides }),
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => '/',
    notFound: vi.fn(),
  }))
}

// Re-export the factory functions
export { createTestDataFactory, createMockFunction, runPropertyTest, createMockResponse }

// Export userEvent for modern user interaction testing
export { userEvent }
