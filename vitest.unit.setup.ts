/**
 * Vitest Unit Test Setup
 * For pure logic tests - no React, no DOM
 *
 * @see https://vitest.dev/config/#setupfiles
 */

import { vi } from 'vitest'

// Mock environment variables for unit tests
process.env.NODE_ENV = 'test'
process.env.NEXT_PUBLIC_SITE_URL = 'https://richardwhudsonjr.com'

// Suppress console in unit tests (optional)
// Uncomment if you want cleaner test output
// vi.spyOn(console, 'error').mockImplementation(() => {})
// vi.spyOn(console, 'warn').mockImplementation(() => {})
// vi.spyOn(console, 'log').mockImplementation(() => {})
