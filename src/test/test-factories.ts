/**
 * Test factory utilities - separate from JSX to avoid generic syntax conflicts
 */

import { vi } from 'vitest'
import type { TestDataFactory, DeepPartial } from '@/types/test-utils'
import type { MockFetchResponse } from '@/types/mock-types'

// Test data factory utility
export const createTestDataFactory = <T>(defaultData: T): TestDataFactory<T> => {
  return (overrides?: DeepPartial<T>): T => {
    return { ...defaultData, ...overrides } as T
  }
}

// Generic mock function creator with proper typing
export const createMockFunction = <TReturn>(implementation?: () => TReturn) => {
  return implementation ? vi.fn(implementation) : vi.fn()
}

// Property-based test runner utility
export const runPropertyTest = <T>(
  generator: () => T,
  predicate: (value: T) => boolean,
  iterations = 100
): void => {
  for (let i = 0; i < iterations; i++) {
    const testValue = generator()
    if (!predicate(testValue)) {
      throw new Error(
        `Property test failed on iteration ${i + 1} with value: ${JSON.stringify(testValue)}`
      )
    }
  }
}

// Utility for creating mock fetch responses with proper typing
export const createMockResponse = <T = unknown>(
  data: T,
  status = 200
): Promise<MockFetchResponse<T> & Response> => {
  const mockResponse = {
    ok: status >= 200 && status < 300,
    status,
    statusText: status >= 200 && status < 300 ? 'OK' : 'Error',
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
    blob: () => Promise.resolve(new Blob([JSON.stringify(data)])),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    clone: function (): MockFetchResponse<T> {
      return this as MockFetchResponse<T>
    },
    headers: new Headers({
      'content-type': 'application/json',
    }),
    // Additional Response properties for compatibility
    redirected: false,
    type: 'basic' as ResponseType,
    url: '',
    body: null,
    bodyUsed: false,
    formData: () => Promise.resolve(new FormData()),
  } as unknown as MockFetchResponse<T> & Response

  return Promise.resolve(mockResponse)
}

// Utility for creating type-safe Prisma mock operations
export const createMockPrismaOperations = <T>() => ({
  findMany: vi.fn().mockResolvedValue([] as T[]),
  findUnique: vi.fn().mockResolvedValue(null as T | null),
  findFirst: vi.fn().mockResolvedValue(null as T | null),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  count: vi.fn().mockResolvedValue(0),
  updateMany: vi.fn().mockResolvedValue({ count: 0 }),
  deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
})
