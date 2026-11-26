// @ts-check
/**
 * The one redirect table builder. It is plain .mjs with no imports because
 * next.config.js is plain ESM and cannot import TypeScript, while the proxy,
 * the sitemap and the tests all need the same table. Data lives in JSON
 * (src/data/redirects.json, blog-slug-renames.json, blog-retired-slugs.json).
 *
 * Invalid tables throw, so a bad entry fails the build instead of shipping a
 * loop, a chain or an open redirect.
 */

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
    if (!source.startsWith('/')) throw new Error(`Redirect source must start with '/': ${source}`)
    if (source.length > 1 && source.endsWith('/')) {
      throw new Error(`Redirect source must not end with '/': ${source}`)
    }
    if (source !== source.toLowerCase()) {
      throw new Error(`Redirect source must be lowercase: ${source}`)
    }
    if (sources.has(source)) throw new Error(`Duplicate redirect source: ${source}`)
    sources.add(source)
  }

  for (const { source, destination } of entries) {
    if (!destination.startsWith('/') && !destination.startsWith('https://')) {
      throw new Error(`Redirect destination must be a '/' path or https URL: ${source}`)
    }
    if (sources.has(destination)) {
      throw new Error(`Redirect chain or loop: ${source} -> ${destination} is itself a source`)
    }
  }

  return Object.freeze(entries.map((entry) => Object.freeze(entry)))
}
