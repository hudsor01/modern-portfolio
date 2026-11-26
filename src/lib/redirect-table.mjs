// @ts-check
/**
 * The one redirect table builder. It is plain .mjs with no imports because
 * next.config.js is plain ESM and cannot import TypeScript, while the proxy,
 * the sitemap and the tests all need the same table. Data lives in JSON
 * (src/data/redirects.json, blog-slug-renames.json, blog-retired-slugs.json).
 *
 * An invalid table throws, so a bad entry fails the build. Enforced here:
 * - Sources are literal lowercase paths: `/`, then one or more segments of
 *   `a-z`, `0-9` and `-` (no root, no empty segment, no trailing slash). That
 *   rules out `:param`, `*` and `(` patterns, which next.config's
 *   path-to-regexp would turn into wildcards while the proxy map reads them
 *   literally, and dots, `%` and uppercase, which resolveSingleHop never
 *   case-folds, so a mixed-case request would miss the entry.
 * - Sources are unique.
 * - A path destination contains no `//`, `\`, `?`, `#`, whitespace or control
 *   character, so it can never become a protocol-relative (off-site) Location
 *   and the proxy can append the request query to it unchanged. It must also
 *   be canonical: lowercase and without a trailing slash (or exactly `/`).
 * - A path destination is not itself a source. With the canonical rule above
 *   this makes it a fixed point of resolveSingleHop (src/lib/redirect-resolve.ts),
 *   so no entry can chain or loop, including `/a -> /a/` and `/a -> /A`.
 * - Any other destination is an absolute https URL with a host and no query,
 *   fragment or whitespace. These come only from this table; no request value
 *   ever chooses a host.
 */

const SOURCE = /^\/[a-z0-9-]+(?:\/[a-z0-9-]+)*$/
/**
 * True for whitespace, a C0 control character or DEL anywhere in `value`.
 * @param {string} value
 */
function hasUnsafeChar(value) {
  if (/\s/.test(value)) return true
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i)
    if (code < 0x20 || code === 0x7f) return true
  }
  return false
}

/**
 * @param {string} source
 * @param {string} destination
 */
function checkPathDestination(source, destination) {
  if (destination.startsWith('//') || destination.includes('\\')) {
    throw new Error(`Redirect destination must not start with '//' or contain '\\': ${source}`)
  }
  if (/[?#]/.test(destination) || hasUnsafeChar(destination)) {
    throw new Error(`Redirect destination must be a plain path (no query or fragment): ${source}`)
  }
  const canonical = (destination.replace(/\/+$/, '') || '/').toLowerCase()
  if (canonical !== destination) {
    throw new Error(
      `Redirect destination must be lowercase with no trailing slash: ${source} -> ${destination}`
    )
  }
}

/**
 * @param {string} source
 * @param {string} destination
 */
function checkExternalDestination(source, destination) {
  if (/[?#]/.test(destination) || hasUnsafeChar(destination)) {
    throw new Error(`External redirect destination must have no query or fragment: ${source}`)
  }
  /** @type {URL} */
  let url
  try {
    url = new URL(destination)
  } catch {
    throw new Error(`External redirect destination is not a URL: ${source}`)
  }
  if (url.protocol !== 'https:' || url.hostname === '' || url.username || url.password) {
    throw new Error(`External redirect destination must be a plain https URL: ${source}`)
  }
}

/**
 * @typedef {{ source: string, destination: string }} Redirect
 * @param {{
 *   handWritten: ReadonlyArray<{ source: string, destination: string }>,
 *   renames: Readonly<Record<string, string>>,
 *   retired: Readonly<Record<string, string>>,
 * }} input
 * @returns {ReadonlyArray<Readonly<Redirect>>}
 */
export function buildRedirectTable({ handWritten, renames, retired }) {
  /** @type {Redirect[]} */
  const entries = [
    ...handWritten.map(({ source, destination }) => ({ source, destination })),
    ...Object.entries(renames).map(([from, to]) => ({
      source: `/blog/${from}`,
      destination: `/blog/${to}`,
    })),
    ...Object.entries(retired).map(([from, to]) => ({
      source: `/blog/${from}`,
      destination: `/blog/${to}`,
    })),
  ]

  const sources = new Set()
  for (const { source } of entries) {
    if (!SOURCE.test(source)) {
      throw new Error(
        `Redirect source must be a literal lowercase path of a-z, 0-9, '-' and '/' with no trailing slash: ${source}`
      )
    }
    if (sources.has(source)) throw new Error(`Duplicate redirect source: ${source}`)
    sources.add(source)
  }

  for (const { source, destination } of entries) {
    if (destination.startsWith('https://')) {
      checkExternalDestination(source, destination)
      continue
    }
    if (!destination.startsWith('/')) {
      throw new Error(`Redirect destination must be a '/' path or https URL: ${source}`)
    }
    checkPathDestination(source, destination)
    if (sources.has(destination)) {
      throw new Error(`Redirect chain or loop: ${source} -> ${destination} is itself a source`)
    }
  }

  return Object.freeze(entries.map((entry) => Object.freeze(entry)))
}
