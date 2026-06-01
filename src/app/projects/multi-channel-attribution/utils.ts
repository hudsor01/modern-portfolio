// Formatters re-exported from the canonical @/lib/data-formatters so this
// project page shares one implementation. formatCurrency switches to 1-decimal
// Intl-compact at/above $1M; formatPercent = plain "NN.N%".
export {
  formatCurrencyCompactMillions as formatCurrency,
  formatPercentPlain as formatPercent,
} from '@/lib/data-formatters'
