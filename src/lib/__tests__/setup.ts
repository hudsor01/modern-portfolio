import { afterEach, vi } from 'vitest'

afterEach(async () => {
  vi.clearAllMocks()
  // Testing Library only auto-registers cleanup when Vitest globals are on (they are
  // not here), so unmount every rendered tree after each jsdom test. Without this, a
  // file's last tree stays mounted and React's scheduler can run queued work after
  // the jsdom environment is torn down ("ReferenceError: window is not defined" as an
  // unhandled error, reproduced under build load in blog-list.test.tsx).
  if (typeof document !== 'undefined') {
    const { cleanup } = await import('@testing-library/react')
    cleanup()
  }
})
