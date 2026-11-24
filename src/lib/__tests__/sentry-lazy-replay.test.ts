// @vitest-environment node
import { readdirSync, existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildEnhancedCSP } from '@/lib/csp-edge'
import {
  type IdleWindow,
  loadReplay,
  REPLAY_IDLE_TIMEOUT_MS,
  scheduleReplayLoad,
  shouldLoadReplay,
  whenIdle,
} from '@/lib/sentry-lazy-replay'

const sentry = vi.hoisted(() => ({
  addIntegration: vi.fn(),
  replayIntegration: vi.fn((options: unknown) => ({ name: 'Replay', options })),
}))
vi.mock('@sentry/nextjs', () => sentry)

const root = process.cwd()
const read = (rel: string) => readFileSync(join(root, rel), 'utf8')
/**
 * Source with comments removed (block, whole-line and trailing `//`), leaving string
 * and template literals intact, so a guard cannot be satisfied or tripped by prose in a
 * comment such as "// never call replayIntegration here".
 */
const strip = (src: string): string => {
  let out = ''
  let i = 0
  while (i < src.length) {
    const ch = src.charAt(i)
    const next = src.charAt(i + 1)
    if (ch === '"' || ch === "'" || ch === '`') {
      let j = i + 1
      while (j < src.length && src.charAt(j) !== ch) j += src.charAt(j) === '\\' ? 2 : 1
      out += src.slice(i, j + 1)
      i = j + 1
    } else if (ch === '/' && next === '*') {
      const end = src.indexOf('*/', i + 2)
      i = end === -1 ? src.length : end + 2
    } else if (ch === '/' && next === '/') {
      const end = src.indexOf('\n', i)
      i = end === -1 ? src.length : end
    } else {
      out += ch
      i += 1
    }
  }
  return out
}

function fakeWin(opts: {
  readyState: string
  idle?: (cb: () => void, o?: { timeout?: number }) => void
}) {
  const addEventListener = vi.fn()
  const requestIdleCallback = opts.idle ? vi.fn(opts.idle) : undefined
  const win = {
    document: { readyState: opts.readyState },
    addEventListener,
    setTimeout: globalThis.setTimeout,
    requestIdleCallback,
  } as unknown as IdleWindow
  return { win, addEventListener, requestIdleCallback }
}

beforeEach(() => {
  sentry.addIntegration.mockReset()
  sentry.replayIntegration.mockClear()
  sentry.replayIntegration.mockImplementation((options: unknown) => ({ name: 'Replay', options }))
})
afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('shouldLoadReplay', () => {
  const base = { dsn: 'https://k@o.ingest.us.sentry.io/1', nodeEnv: 'production' }
  it('false without a DSN', () => {
    expect(shouldLoadReplay({ ...base, dsn: undefined, sessionRate: 0, onErrorRate: 1 })).toBe(
      false
    )
    expect(shouldLoadReplay({ ...base, dsn: '', sessionRate: 0, onErrorRate: 1 })).toBe(false)
  })
  it('false in test', () => {
    expect(shouldLoadReplay({ ...base, nodeEnv: 'test', sessionRate: 0, onErrorRate: 1 })).toBe(
      false
    )
  })
  it('false when both rates are 0', () => {
    expect(shouldLoadReplay({ ...base, sessionRate: 0, onErrorRate: 0 })).toBe(false)
  })
  it('true for defaults and for session-only', () => {
    expect(shouldLoadReplay({ ...base, sessionRate: 0, onErrorRate: 1 })).toBe(true)
    expect(shouldLoadReplay({ ...base, sessionRate: 0.5, onErrorRate: 0 })).toBe(true)
  })
})

describe('whenIdle', () => {
  it('uses requestIdleCallback with a 2000 ms timeout when already loaded', () => {
    let fire: () => void = () => {}
    const { win, requestIdleCallback } = fakeWin({
      readyState: 'complete',
      idle: (cb) => {
        fire = cb
      },
    })
    const cb = vi.fn()
    whenIdle(cb, win)
    expect(requestIdleCallback).toHaveBeenCalledTimes(1)
    expect(requestIdleCallback).toHaveBeenCalledWith(expect.any(Function), { timeout: 2000 })
    expect(cb).not.toHaveBeenCalled()
    fire()
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('waits for the load event while loading', () => {
    const { win, addEventListener, requestIdleCallback } = fakeWin({
      readyState: 'loading',
      idle: (cb) => cb(),
    })
    const cb = vi.fn()
    whenIdle(cb, win)
    expect(addEventListener).toHaveBeenCalledWith('load', expect.any(Function), { once: true })
    expect(requestIdleCallback).not.toHaveBeenCalled()
    addEventListener.mock.calls[0]?.[1]()
    expect(requestIdleCallback).toHaveBeenCalledTimes(1)
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('falls back to setTimeout 2000 ms without requestIdleCallback', () => {
    vi.useFakeTimers()
    const { win } = fakeWin({ readyState: 'complete' })
    ;(win as { setTimeout: unknown }).setTimeout = globalThis.setTimeout
    const cb = vi.fn()
    whenIdle(cb, win)
    vi.advanceTimersByTime(REPLAY_IDLE_TIMEOUT_MS - 1)
    expect(cb).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(cb).toHaveBeenCalledTimes(1)
  })
})

describe('loadReplay', () => {
  it('adds Replay with exactly the privacy options', async () => {
    await expect(loadReplay()).resolves.toBeUndefined()
    expect(sentry.replayIntegration).toHaveBeenCalledTimes(1)
    expect(sentry.replayIntegration).toHaveBeenCalledWith({
      maskAllText: true,
      maskAllInputs: true,
      blockAllMedia: true,
    })
    expect(sentry.addIntegration).toHaveBeenCalledTimes(1)
    expect(sentry.addIntegration).toHaveBeenCalledWith(
      sentry.replayIntegration.mock.results[0]?.value
    )
  })

  it('never throws when Replay fails to build', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    sentry.replayIntegration.mockImplementation(() => {
      throw new Error('nope')
    })
    await expect(loadReplay()).resolves.toBeUndefined()
    expect(warn).toHaveBeenCalledTimes(1)
    expect(String(warn.mock.calls[0]?.[0])).toContain('Sentry Replay')
    expect(sentry.addIntegration).not.toHaveBeenCalled()
  })
})

describe('scheduleReplayLoad', () => {
  it('adds the integration once idle', async () => {
    const { win } = fakeWin({ readyState: 'complete', idle: (cb) => cb() })
    scheduleReplayLoad(win)
    await vi.waitFor(() => expect(sentry.addIntegration).toHaveBeenCalledTimes(1))
  })
})

describe('strip (comment remover used by the source guards)', () => {
  it('removes block, whole-line and trailing comments', () => {
    const out = strip('a /* replayIntegration */ b\n// replayIntegration\nc // replayIntegration\n')
    expect(out).not.toContain('replayIntegration')
    expect(out).toContain('a')
    expect(out).toContain('c')
  })

  it('keeps code and string literals that merely contain comment markers', () => {
    const out = strip(
      'const u = \'https://x.test/a\'; const v = "// not a comment"; const w = `/* nor this */`'
    )
    expect(out).toContain("'https://x.test/a'")
    expect(out).toContain('"// not a comment"')
    expect(out).toContain('`/* nor this */`')
  })

  it('does not let a comment mentioning replayIntegration satisfy or trip a guard', () => {
    expect(
      strip("// import { replayIntegration } from '@sentry/nextjs'\nconst a = 1")
    ).not.toContain('replayIntegration')
    expect(strip("import { replayIntegration } from '@sentry/nextjs' // lazy")).toContain(
      'replayIntegration'
    )
  })
})

describe('source guards', () => {
  const client = strip(read('instrumentation-client.ts'))
  const loader = strip(read('src/lib/sentry-lazy-replay.ts'))

  it('instrumentation-client.ts is lazy and keeps its privacy/enabled gates', () => {
    expect(client).not.toContain('replayIntegration')
    expect(client).not.toContain('lazyLoadIntegration')
    for (const needle of [
      'scheduleReplayLoad(',
      'shouldLoadReplay(',
      'dataCollection: resolveDataCollection(',
      "enabled: Boolean(dsn) && process.env.NODE_ENV !== 'test'",
      'replaysSessionSampleRate,',
      'replaysOnErrorSampleRate,',
      'consoleLoggingIntegration',
      'export const onRouterTransitionStart',
    ]) {
      expect(client).toContain(needle)
    }
  })

  it('loader is a same-origin dynamic import only', () => {
    expect(loader).not.toMatch(/^import\s+(?!type\b)[^;]*from\s+['"]@sentry\//m)
    expect(loader).toContain("import('@sentry/nextjs')")
    for (const bad of ['lazyLoadIntegration', '@sentry/browser', '@sentry/replay']) {
      expect(loader).not.toContain(bad)
    }
  })

  it('no sentry.client.config and no require of @sentry packages', () => {
    expect(existsSync(join(root, 'sentry.client.config.ts'))).toBe(false)
    expect(existsSync(join(root, 'sentry.client.config.js'))).toBe(false)
    const files: string[] = [
      'instrumentation-client.ts',
      'instrumentation.ts',
      'sentry.shared.ts',
      'sentry.server.config.ts',
      'sentry.edge.config.ts',
    ]
    const walk = (dir: string) => {
      for (const e of readdirSync(join(root, dir), { withFileTypes: true })) {
        if (e.name === '__tests__') continue
        const rel = `${dir}/${e.name}`
        if (e.isDirectory()) walk(rel)
        else if (/\.tsx?$/.test(e.name)) files.push(rel)
      }
    }
    walk('src')
    for (const f of files) {
      expect(strip(read(f)), f).not.toMatch(/require\(\s*['"]@sentry\//)
    }
  })

  it('next.config.js sets no tunnelRoute or bundleSizeOptimizations', () => {
    const cfg = strip(read('next.config.js'))
    expect(cfg).not.toContain('tunnelRoute')
    expect(cfg).not.toContain('bundleSizeOptimizations')
  })

  it('CSP keeps the Sentry coupling', () => {
    const csp = buildEnhancedCSP()
    const connect = csp.split(';').find((d) => d.trim().startsWith('connect-src')) ?? ''
    expect(connect).toContain('https://*.ingest.us.sentry.io')
    expect(csp).toContain("worker-src 'self' blob:")
  })
})
