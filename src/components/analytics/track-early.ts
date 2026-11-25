import { track } from '@vercel/analytics'

type VaQueue = { va?: (...args: unknown[]) => void; vaq?: unknown[][] }

/**
 * `track()` that also works before <Analytics /> has initialised.
 *
 * `@vercel/analytics`' `track()` calls `window.va?.(…)`, so an event sent
 * before `inject()` runs (e.g. from a component's mount effect earlier in the
 * tree than <Analytics />) is silently dropped. This installs the same queue
 * stub Vercel documents for the HTML snippet; the script replays `window.vaq`
 * once it loads, and inject() keeps an existing `window.va`.
 */
export function trackEarly(name: string, data: Record<string, string>): void {
  if (typeof window === 'undefined') return
  const w = window as unknown as VaQueue
  w.va =
    w.va ||
    ((...args: unknown[]) => {
      w.vaq = w.vaq || []
      w.vaq.push(args)
    })
  track(name, data)
}
