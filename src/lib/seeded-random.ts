/**
 * Deterministic PRNG (32-bit FNV-1a seed hash feeding mulberry32). Returns
 * values in [0, 1) like `Math.random`, but identical on every call sequence
 * for a given seed.
 *
 * For illustrative project figures only. Never use for ids, tokens, CSRF or
 * anything security-relevant (ASVS V6): the output is fully predictable.
 */
export function createSeededRandom(seed: string): () => number {
  let hash = 0x811c9dc5
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  let state = hash >>> 0

  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
