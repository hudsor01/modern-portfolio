// @vitest-environment node
import { existsSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Grounds the tools' "runs in your browser, asks for no email" claim. Walks the
 * full transitive import closure of both tool pages (relative and `@/` specifiers,
 * either quote style, static, bare side-effect, re-export and dynamic `import()` /
 * `require()` forms) and fails if any reachable first-party file contains a network
 * or submission API. Bare package imports (react, next/*, lucide-react, ...) are
 * leaves: they are listed and checked against a deny-list of networking packages.
 *
 * Limits, stated plainly: this is a static text scan with comments and string/template
 * literal contents stripped before matching. It cannot see inside third-party packages,
 * and code that builds an API name at runtime (`globalThis['fe' + 'tch']`) would pass.
 * It guards against accidental regressions, not a determined evader.
 */

const ROOT = process.cwd()
const SRC = join(ROOT, 'src')
const ENTRY_PAGES = [
  'src/app/tools/pipeline-coverage-calculator/page.tsx',
  'src/app/tools/revops-maturity-scorecard/page.tsx',
]

// ---------------------------------------------------------------- scanning

/** Remove comments and the contents of string/template literals (keeps the quotes). */
function stripCommentsAndStrings(src: string, keepStrings = false): string {
  let out = ''
  let i = 0
  while (i < src.length) {
    const c = src[i] as string
    const n = src[i + 1]
    if (c === '/' && n === '/') {
      while (i < src.length && src[i] !== '\n') i++
    } else if (c === '/' && n === '*') {
      i += 2
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++
      i += 2
    } else if (c === '"' || c === "'" || c === '`') {
      const quote = c
      out += quote
      i++
      // ' and " literals cannot span lines; stopping at the newline keeps a stray
      // apostrophe in JSX text from swallowing the code that follows.
      while (i < src.length && src[i] !== quote && (quote === '`' || src[i] !== '\n')) {
        if (src[i] === '\\') {
          if (keepStrings) out += src[i] as string
          i++
        }
        if (keepStrings && i < src.length) out += src[i] as string
        i++
      }
      out += quote
      i++
    } else {
      out += c
      i++
    }
  }
  return out
}

interface Pattern {
  name: string
  /** Matched against source with comments and string contents removed. */
  code?: RegExp
  /** Matched against source with comments removed but strings kept. */
  withStrings?: RegExp
}

const BANNED: Pattern[] = [
  { name: 'fetch call', code: /\bfetch\s*\(/ },
  { name: 'fetch via global/bracket', code: /(?:window|globalThis|self)\s*(?:\.\s*fetch\b|\[)/ },
  { name: 'XMLHttpRequest', code: /\bXMLHttpRequest\b/ },
  { name: 'sendBeacon', code: /\bsendBeacon\b/, withStrings: /\[\s*['"`]sendBeacon['"`]\s*\]/ },
  { name: 'WebSocket', code: /\bWebSocket\b/ },
  { name: 'EventSource', code: /\bEventSource\b/ },
  { name: "'use server' directive", withStrings: /['"`]use server['"`]/ },
  { name: 'useActionState / useFormState', code: /\b(?:useActionState|useFormState)\b/ },
  { name: '<form> element', code: /<form\b/ },
  { name: 'action= / formAction= attribute', code: /\b(?:form[Aa]ction|action)\s*=\s*[{'"`]/ },
  {
    name: 'action= / formAction= attribute (string)',
    withStrings: /\b(?:form[Aa]ction|action)\s*=\s*[{'"`]/,
  },
  { name: 'new Image()', code: /\bnew\s+Image\s*\(/ },
  { name: '.src assignment', code: /\.\s*src\s*=(?!=)/ },
  { name: 'email input', withStrings: /type\s*=\s*['"`]email['"`]/ },
]

function findBanned(src: string): string[] {
  const noComments = stripCommentsAndStrings(src, true)
  const codeOnly = stripCommentsAndStrings(src, false)
  const hits: string[] = []
  for (const p of BANNED) {
    if (p.code?.test(codeOnly) || p.withStrings?.test(noComments)) hits.push(p.name)
  }
  return hits
}

const BANNED_PACKAGES = [
  'axios',
  'swr',
  'ky',
  'got',
  'node-fetch',
  'undici',
  'socket.io-client',
  'ws',
  'resend',
  '@tanstack/react-query',
  '@sentry/nextjs',
  '@vercel/analytics',
  'next/server',
]

// ----------------------------------------------------------------- imports

function importSpecifiers(src: string): string[] {
  const code = stripCommentsAndStrings(src, true)
  const specs = new Set<string>()
  const add = (s: string | undefined) => s && specs.add(s)
  for (const m of code.matchAll(/\b(?:import|export)\s[^'"`;]*?\bfrom\s*(['"`])([^'"`]+)\1/g))
    add(m[2])
  for (const m of code.matchAll(/\bimport\s*(['"`])([^'"`]+)\1/g)) add(m[2])
  for (const m of code.matchAll(/\b(?:import|require)\s*\(\s*(['"`])([^'"`]+)\1\s*\)/g)) add(m[2])
  return [...specs]
}

const ASSET = /\.(?:css|svg|png|jpe?g|webp|avif|gif|ico|woff2?|pdf|json)$/

function resolveFile(from: string, spec: string): string | null {
  const base = spec.startsWith('@/') ? join(SRC, spec.slice(2)) : resolve(dirname(from), spec)
  const candidates = [
    base,
    ...['.ts', '.tsx', '.d.ts', '.mts', '.js', '.jsx'].map((e) => base + e),
    ...['.ts', '.tsx', '.js'].map((e) => join(base, `index${e}`)),
  ]
  return candidates.find((c) => existsSync(c) && statSync(c).isFile()) ?? null
}

interface Closure {
  files: string[]
  packages: string[]
  unresolved: string[]
}

function closureOf(entries: string[]): Closure {
  const seen = new Set<string>()
  const packages = new Set<string>()
  const unresolved: string[] = []
  const queue = entries.map((e) => join(ROOT, e))
  while (queue.length > 0) {
    const file = queue.pop() as string
    if (seen.has(file)) continue
    seen.add(file)
    for (const spec of importSpecifiers(readFileSync(file, 'utf8'))) {
      if (spec.startsWith('.') || spec.startsWith('@/')) {
        if (ASSET.test(spec)) continue
        const target = resolveFile(file, spec)
        if (target) queue.push(target)
        else unresolved.push(`${file.replace(`${ROOT}/`, '')} -> ${spec}`)
      } else {
        packages.add(spec)
      }
    }
  }
  return {
    files: [...seen].map((f) => f.replace(`${ROOT}/`, '')).sort(),
    packages: [...packages].sort(),
    unresolved,
  }
}

// ------------------------------------------------------------------- tests

describe('no-email / in-browser claim grounding (transitive closure)', () => {
  const closure = closureOf(ENTRY_PAGES)

  it('resolves every first-party import and reaches both tools, their libs and the shell', () => {
    expect(closure.unresolved).toEqual([])
    for (const must of [
      'src/app/tools/pipeline-coverage-calculator/_components/pipeline-coverage-calculator.tsx',
      'src/app/tools/revops-maturity-scorecard/_components/revops-maturity-scorecard.tsx',
      'src/lib/pipeline-coverage.ts',
      'src/lib/revops-maturity.ts',
      'src/components/layout/navbar.tsx',
    ]) {
      expect(closure.files).toContain(must)
    }
  })

  it('no file in the closure contains a network, form-submission or email API', () => {
    const offenders = closure.files
      .map((f) => ({ f, hits: findBanned(readFileSync(join(ROOT, f), 'utf8')) }))
      .filter((x) => x.hits.length > 0)
    expect(offenders).toEqual([])
  })

  it('no third-party networking package is imported anywhere in the closure', () => {
    const offending = closure.packages.filter((p) =>
      BANNED_PACKAGES.some((b) => p === b || p.startsWith(`${b}/`))
    )
    expect(offending).toEqual([])
  })
})

describe('guard self-test: every pattern is caught', () => {
  const cases: Array<[string, string]> = [
    ['fetch call', "await fetch('/x')"],
    ['fetch call', 'const r = fetch (url)'],
    ['fetch via global/bracket', "window['fetch']('/x')"],
    ['fetch via global/bracket', "globalThis.fetch('/x')"],
    ['XMLHttpRequest', 'new XMLHttpRequest()'],
    ['sendBeacon', "navigator.sendBeacon('/x', d)"],
    ['sendBeacon', "navigator['sendBeacon']('/x', d)"],
    ['WebSocket', "new WebSocket('wss://x')"],
    ['EventSource', "new EventSource('/s')"],
    ["'use server' directive", "'use server'\nexport async function a() {}"],
    ["'use server' directive", '"use server"'],
    ['useActionState / useFormState', 'const [s, a] = useActionState(fn, null)'],
    ['useActionState / useFormState', 'useFormState(fn, null)'],
    ['<form> element', '<form onSubmit={x}>'],
    ['<form> element', '<form\n  method="post">'],
    ['action= / formAction= attribute', '<div action={doIt}>'],
    ['action= / formAction= attribute', '<button formAction={doIt}>'],
    ['action= / formAction= attribute (string)', '<form action="/api/send">'],
    ['new Image()', 'new Image()'],
    ['.src assignment', "img.src = 'https://t.example/p.gif'"],
    ['email input', '<input type="email" />'],
  ]
  it.each(cases)('%s is caught in: %s', (name, snippet) => {
    expect(findBanned(snippet)).toContain(name)
  })

  it('does not flag comments, ordinary copy or comparisons', () => {
    const clean = [
      '// we never fetch( anything here',
      '/* new WebSocket() would be wrong */',
      "const copy = 'Fetch your numbers, then reaction= time'",
      'const a = props.src === other.src',
      "const label = 'Open tool'",
    ].join('\n')
    expect(findBanned(clean)).toEqual([])
  })
})

describe('guard self-test: import scanner', () => {
  it('sees every import form, either quote style', () => {
    const src = `
      import a from 'single'
      import b from "double"
      import { c,
        d } from '@/multi/line'
      import type { T } from "./type-only"
      import 'side-effect'
      import "side-effect-double"
      export { e } from './reexport'
      export * from "./star"
      const x = await import('./dynamic')
      const y = await import("./dynamic-double")
      const z = require('./cjs')
      // import fake from './commented'
    `
    expect(importSpecifiers(src).sort()).toEqual(
      [
        '@/multi/line',
        './cjs',
        './dynamic',
        './dynamic-double',
        './reexport',
        './star',
        './type-only',
        'double',
        'side-effect',
        'side-effect-double',
        'single',
      ].sort()
    )
  })

  it('walks past the page into its dependencies', () => {
    const closure = closureOf(['src/app/tools/revops-maturity-scorecard/page.tsx'])
    expect(closure.files).toContain('src/lib/revops-maturity.ts')
    expect(closure.files.length).toBeGreaterThan(4)
  })

  it('a stray apostrophe in JSX text does not hide a later fetch', () => {
    expect(findBanned("<p>don't</p>\nfetch('/x')")).toContain('fetch call')
  })
})
