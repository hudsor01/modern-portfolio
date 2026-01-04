/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { Window } from 'happy-dom'

// Register happy-dom globals
GlobalRegistrator.register()

// Create a fresh window for tests that need document reset
export function createFreshWindow() {
  return new Window({ url: 'http://localhost:3000' })
}

// Ensure document has required properties
if (typeof document !== 'undefined') {
  // Ensure document.body exists
  if (!document.body) {
    document.body = document.createElement('body')
  }

  // Ensure document.head exists
  if (!document.head) {
    const head = document.createElement('head')
    document.documentElement.insertBefore(head, document.body)
  }
}
