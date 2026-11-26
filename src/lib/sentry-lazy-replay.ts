// Idle, same-origin loading of Sentry Session Replay.
//
// Replay (rrweb) is ~160 KB gzip and is not needed to paint the page, so it is
// added after the load event once the browser is idle (<= 2 s) instead of being
// part of the eager Sentry.init integrations. The code comes from a same-origin
// dynamic import chunk: the CSP `script-src` blocks Sentry's CDN loader, so the
// CDN-based lazy loading is not an option here. addIntegration after init reads
// the replay sample rates from the client options. Errors raised in the first
// idle window are reported without a replay (accepted trade-off, owner
// 2026-11-24).

// Defaults, set explicitly: this is a public site but forms carry names/emails,
// and a replay must never become a PII leak.
const REPLAY_PRIVACY_OPTIONS = {
  maskAllText: true,
  maskAllInputs: true,
  blockAllMedia: true,
} as const

export const REPLAY_IDLE_TIMEOUT_MS = 2000

export type IdleWindow = Pick<Window, 'document' | 'addEventListener' | 'setTimeout'> & {
  requestIdleCallback?: Window['requestIdleCallback']
}

export function shouldLoadReplay(input: {
  dsn: string | undefined
  nodeEnv: string | undefined
  sessionRate: number
  onErrorRate: number
}): boolean {
  return (
    Boolean(input.dsn) &&
    input.nodeEnv !== 'test' &&
    (input.sessionRate > 0 || input.onErrorRate > 0)
  )
}

export function whenIdle(callback: () => void, win: IdleWindow = window): void {
  const schedule = () => {
    if (win.requestIdleCallback) {
      win.requestIdleCallback(() => callback(), { timeout: REPLAY_IDLE_TIMEOUT_MS })
    } else {
      win.setTimeout(callback, REPLAY_IDLE_TIMEOUT_MS)
    }
  }
  if (win.document.readyState === 'complete') {
    schedule()
  } else {
    win.addEventListener('load', schedule, { once: true })
  }
}

export function loadReplay(): Promise<void> {
  return import('@sentry/nextjs')
    .then(({ addIntegration, replayIntegration }) => {
      addIntegration(replayIntegration(REPLAY_PRIVACY_OPTIONS))
    })
    .catch(() => {
      console.warn('Sentry Replay failed to load; errors are still reported without a replay')
    })
}

export function scheduleReplayLoad(win: IdleWindow = window): void {
  whenIdle(() => {
    void loadReplay()
  }, win)
}
