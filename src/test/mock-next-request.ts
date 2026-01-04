/**
 * Mock NextRequest utility for API route tests
 * Creates a mock that satisfies NextRequest interface
 */

import type { NextRequest } from 'next/server'

export interface MockRequestOptions {
  method?: string
  body?: string | object
  headers?: Record<string, string>
}

/**
 * Creates a mock NextRequest for testing API routes
 */
export function createMockNextRequest(
  url: string,
  options: MockRequestOptions = {}
): NextRequest {
  const urlObj = new URL(url)
  const headersMap = new Map(Object.entries(options.headers || {}))
  const bodyString = typeof options.body === 'object'
    ? JSON.stringify(options.body)
    : options.body

  return {
    url,
    method: options.method || 'GET',
    headers: {
      get: (name: string) => headersMap.get(name) || headersMap.get(name.toLowerCase()) || null,
      has: (name: string) => headersMap.has(name) || headersMap.has(name.toLowerCase()),
      entries: () => headersMap.entries(),
      forEach: (cb: (value: string, key: string) => void) => headersMap.forEach(cb),
      keys: () => headersMap.keys(),
      values: () => headersMap.values(),
      append: () => {},
      delete: () => {},
      set: () => {},
      getSetCookie: () => [],
    },
    nextUrl: {
      searchParams: urlObj.searchParams,
      pathname: urlObj.pathname,
      href: url,
      origin: urlObj.origin,
      protocol: urlObj.protocol,
      host: urlObj.host,
      hostname: urlObj.hostname,
      port: urlObj.port,
      hash: urlObj.hash,
      search: urlObj.search,
    },
    cookies: {
      get: () => undefined,
      getAll: () => [],
      has: () => false,
      set: () => {},
      delete: () => {},
      clear: () => {},
      size: 0,
      [Symbol.iterator]: function* () {},
    },
    geo: undefined,
    ip: undefined,
    json: async () => bodyString ? JSON.parse(bodyString) : {},
    text: async () => bodyString || '',
    formData: async () => new FormData(),
    arrayBuffer: async () => new ArrayBuffer(0),
    blob: async () => new Blob(),
    clone: () => createMockNextRequest(url, options),
  } as unknown as NextRequest
}
