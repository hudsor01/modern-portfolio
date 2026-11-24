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
 * Source with comments removed (block, whole-line and trailing `//`), leaving string,
 * template and regex literals intact, so a guard cannot be satisfied or tripped by prose
 * in a comment such as "// never call replayIntegration here".
 *
 * Deliberately conservative rather than a full tokenizer. A quote is a string opener
 * only in code context: an apostrophe glued to a word, `)` or `}` ("don't", `{n}'s`) is
 * JSX or prose text, and an unterminated quoted string ends at the line break. A `/` is
 * a regex literal only after an operator, an opening bracket or a keyword, never after
 * a word, `)`, `}` or `<` (so `a / b`, `</p>` and `<A b={c} />` are not regexes). `//`
 * right after `:` is a URL, not a comment. Strings and regexes are kept verbatim, so a
 * misjudged boundary can only affect comment detection, never delete code.
 */
const strip = (src: string): string => {
  let i = 0
  const scanQuoted = (quote: string): string => {
    let j = i + 1
    while (j < src.length && src.charAt(j) !== quote && src.charAt(j) !== '\n') {
      j += src.charAt(j) === '\\' ? 2 : 1
    }
    const end = src.charAt(j) === quote ? j + 1 : j
    const text = src.slice(i, end)
    i = end
    return text
  }
  const scanRegex = (): string | null => {
    let j = i + 1
    let inClass = false
    while (j < src.length && src.charAt(j) !== '\n') {
      const c = src.charAt(j)
      if (c === '\\') j += 2
      else if (c === '[') {
        inClass = true
        j += 1
      } else if (c === ']') {
        inClass = false
        j += 1
      } else if (c === '/' && !inClass) {
        j += 1
        while (/[a-z]/i.test(src.charAt(j))) j += 1
        const text = src.slice(i, j)
        i = j
        return text
      } else j += 1
    }
    return null
  }
  const canStartRegex = (out: string): boolean => {
    const before = out.trimEnd()
    if (before === '') return true
    return (
      /[(,=:[!&|?{;+\-*%~^]$/.test(before) || /\b(return|typeof|case|void|delete)$/.test(before)
    )
  }
  const scanTemplate = (): string => {
    let out = '`'
    i += 1
    while (i < src.length) {
      const c = src.charAt(i)
      if (c === '\\') {
        out += src.slice(i, i + 2)
        i += 2
      } else if (c === '`') {
        i += 1
        return `${out}\``
      } else if (c === '$' && src.charAt(i + 1) === '{') {
        i += 2
        out += `\${${scanCode(true)}`
      } else {
        out += c
        i += 1
      }
    }
    return out
  }
  // inBrace: stop after the `}` that closes a template `${`, returning it as part of the text.
  const scanCode = (inBrace: boolean): string => {
    let out = ''
    let depth = 0
    while (i < src.length) {
      const ch = src.charAt(i)
      const next = src.charAt(i + 1)
      const prev = src.charAt(i - 1)
      if ((ch === '"' || ch === "'") && !/[\w$)}]/.test(prev)) {
        out += scanQuoted(ch)
      } else if (ch === '`') {
        out += scanTemplate()
      } else if (ch === '/' && next === '*') {
        const end = src.indexOf('*/', i + 2)
        i = end === -1 ? src.length : end + 2
      } else if (ch === '/' && next === '/' && prev !== ':') {
        const end = src.indexOf('\n', i)
        i = end === -1 ? src.length : end
      } else if (ch === '/' && canStartRegex(out)) {
        const regex = scanRegex()
        if (regex === null) {
          out += ch
          i += 1
        } else out += regex
      } else {
        if (inBrace && ch === '{') depth += 1
        if (inBrace && ch === '}') {
          if (depth === 0) {
            i += 1
            return `${out}}`
          }
          depth -= 1
        }
        out += ch
        i += 1
      }
    }
    return out
  }
  return scanCode(false)
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

  it('treats an apostrophe in JSX text as text, so a later require is still seen', () => {
    const src = "const a = <p>don't stop</p>\nconst m = require('@sentry/x')\n"
    expect(strip(src)).toBe(src)
    expect(strip(src)).toMatch(/require\(\s*['"]@sentry\//)
  })

  it('does not let a JSX apostrophe turn a later comment into code (or code into a string)', () => {
    const src = "<p>don't</p>\n// require('@sentry/x')\nconst ok = 1\nrequire('@sentry/y')\n"
    const out = strip(src)
    expect(out).not.toContain("'@sentry/x'")
    expect(out).toContain("require('@sentry/y')")
    const plural = strip("<p>the dogs' bowls</p> /* require('@sentry/x') */ const k = 2")
    expect(plural).not.toContain('@sentry/x')
    expect(plural).toContain('const k = 2')
  })

  it('still opens a string after a keyword or operator, and strips a comment after it', () => {
    const out = strip("import a from 'x' // require('@sentry/x')\nconst s = cond ? 'a' : \"b\"")
    expect(out).toContain("from 'x'")
    expect(out).not.toContain('@sentry/x')
    expect(out).toContain('cond ? \'a\' : "b"')
  })

  it('ends an unterminated quote at the line break', () => {
    expect(strip("const a = 'oops\nconst b = 1 // gone")).toBe("const a = 'oops\nconst b = 1 ")
  })

  it('keeps regex literals whole, including quotes, // and classes inside them', () => {
    const quote = strip("const r = /'/g\n// require('@sentry/x')\nreal()")
    expect(quote).toContain("/'/g")
    expect(quote).not.toContain('@sentry/x')
    expect(quote).toContain('real()')
    expect(strip('const u = /https?:\\/\\/x/i // require("@sentry/x")')).toBe(
      'const u = /https?:\\/\\/x/i '
    )
    expect(strip("const c = /[/]'/ /* x */ + 1")).toBe("const c = /[/]'/  + 1")
  })

  it('does not mistake division, JSX closing tags or URLs for regex or comments', () => {
    expect(strip('const q = a / b // c\nconst z = x / y')).toBe('const q = a / b \nconst z = x / y')
    expect(strip('<A b={c} /> // d\n<p>x</p>')).toBe('<A b={c} /> \n<p>x</p>')
    expect(strip('See http://x.test // trailing')).toBe('See http://x.test ')
  })

  it('follows nested template literals and substitutions', () => {
    // `@{` stands for the substitution opener, which lint flags inside plain strings.
    const sub = (text: string) => text.replaceAll('@{', `${'$'}{`)
    const cases = [
      [
        "const t = `a @{ '`' + `b @{c}` } // kept` // dropped require('@sentry/x')",
        "const t = `a @{ '`' + `b @{c}` } // kept` ",
      ],
      ['const t = `@{ { a: 1 }.a }` /* x */ + 1', 'const t = `@{ { a: 1 }.a }`  + 1'],
    ] as const
    for (const [input, expected] of cases) expect(strip(sub(input))).toBe(sub(expected))
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
