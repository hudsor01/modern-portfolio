import type { ChartData } from '@/types/chart'

// Re-exporting ChartData for legacy component compatibility
export type PieChartData = ChartData;
export type LineChartData = ChartData;
export type BarChartData = ChartData;

export interface FunnelData {
  stage: string
  value: number
  conversion?: number
}

export interface HeatmapData {
  row: string
  col: string
  value: number
}

export interface ChartProps {
  title?: string
  className?: string
  valueFormatter?: (value: number) => string
  showTooltip?: boolean
  showLegend?: boolean
}
