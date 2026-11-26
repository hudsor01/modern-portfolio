/**
 * The read count shown on each post ("0 reads", "1 read", "1,234 reads").
 * Wording matches the privacy policy: "how many times it has been read".
 */
export function formatReads(count: number): string {
  const n = Number.isFinite(count) && count > 0 ? Math.floor(count) : 0
  return `${n.toLocaleString('en-US')} ${n === 1 ? 'read' : 'reads'}`
}
