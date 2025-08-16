/**
 * Centralized chart system exports
 * Single import point for all chart utilities
 */

export * from './chart-theme'
export * from './chart-components'

// Re-export commonly used chart types from recharts for convenience
export {
  LineChart,
  BarChart,
  AreaChart,
  Line,
  Bar,
  Area,
  Legend,
  type TooltipProps,
  type LineProps,
  type BarProps,
  type AreaProps,
} from 'recharts'