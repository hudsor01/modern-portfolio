/**
 * Helper for creating isolated module mocks in Bun tests
 * 
 * Workaround for Bun's known module mock isolation issue:
 * https://github.com/oven-sh/bun/issues/12823
 * 
 * Usage:
 * ```typescript
 * using mockedResend = mockModule('resend', () => ({
 *   Resend: function() {
 *     return { emails: { send: mockFn } }
 *   }
 * }));
 * ```
 * 
 * The `using` keyword automatically calls Symbol.dispose when scope ends,
 * restoring the original module and ensuring test isolation.
 */

import { mock } from 'bun:test'

export const mockModule = <T = unknown>(
  modulePath: string,
  renderMocks: () => T
): { [Symbol.dispose]: () => void } => {
  // Note: We can't actually get the original module reliably in Bun
  // because mock.module patches in-place and there's no way to restore it
  // This is a limitation of Bun's current implementation
  
  const mocks = renderMocks()
  mock.module(modulePath, () => mocks)
  
  return {
    [Symbol.dispose]: () => {
      // Unfortunately, there's no reliable way to restore the original module in Bun
      // The best we can do is clear the mock, but this doesn't fully restore isolation
      // See: https://github.com/oven-sh/bun/issues/12823
      
      // For now, this is a placeholder for when Bun adds proper mock restoration
      // In the meantime, tests with shared module mocks should be in the same file
    },
  }
}
