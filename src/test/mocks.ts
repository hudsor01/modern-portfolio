/**
 * Global module mocks for Bun tests
 * CRITICAL: This file must be preloaded in bunfig.toml BEFORE setup.tsx
 * to ensure mocks are registered before any imports
 */

import { mock } from 'bun:test'

// =============================================================================
// NEXT.JS SERVER-ONLY MODULES
// =============================================================================

const registerCoreMocks = () => {
  // Mock CSRF protection module with realistic behavior
  mock.module('@/lib/security/csrf-protection', () => ({
    generateCSRFToken: () => 'test-csrf-token',
    getCSRFTokenFromCookie: async () => 'test-csrf-token',
    validateCSRFToken: async (requestToken: string | undefined) => {
      // Return false if no token provided (matches real behavior)
      if (!requestToken) return false
      // Return true for test tokens
      return requestToken === 'test-csrf-token' || requestToken === 'valid-csrf-token'
    },
    setCSRFTokenCookie: async () => {},
    csrfProtectionMiddleware: async () => ({ valid: true, token: 'test-csrf-token' }),
    createNewCSRFToken: async () => 'test-csrf-token',
    getCSRFTokenFromRequest: () => 'test-csrf-token',
  }))

  // Mock next/headers (cookies, headers, draftMode)
  // CRITICAL: Must be mocked before any imports that use it
  mock.module('next/headers', () => ({
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

  // Mock server-only (throws when imported outside server context)
  mock.module('server-only', () => ({}))
}

registerCoreMocks()

;(globalThis as Record<string, unknown>).__registerCoreMocks = registerCoreMocks

const originalRestore = mock.restore.bind(mock)
const restoreWithCoreMocks = () => {
  originalRestore()
  registerCoreMocks()
}

try {
  mock.restore = restoreWithCoreMocks
} catch {
  // Some environments prevent reassigning mock.restore; fallback via helper.
}
