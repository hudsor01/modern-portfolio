export function calculateGrowth(current: number | undefined, previous: number | undefined): number {
  if (!current || !previous || previous === 0) return 0
  return ((current - previous) / previous) * 100
}
