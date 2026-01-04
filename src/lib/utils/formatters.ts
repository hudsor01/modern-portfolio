/**
 * @deprecated Use data-formatters.ts for consistent formatting across all project pages
 * This file is maintained for backward compatibility but will be removed in future versions
 *
 * Shared formatting utilities to eliminate code duplication
 * Used across all chart components and data displays
 */

// Re-export from the comprehensive data formatters for backward compatibility
export {
  formatCurrency,
  formatPercentage,
  formatCompactNumber,
  formatDate,
  formatNumber,
} from './data-formatters'
