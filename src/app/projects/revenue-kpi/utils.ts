export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function calculateGrowth(current: number | undefined, previous: number | undefined): number {
  if (!current || !previous || previous === 0) return 0
  return ((current - previous) / previous) * 100
}
