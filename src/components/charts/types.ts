import type { ChartData as GlobalChartData } from '@/types/project';

// Re-exporting GlobalChartData for consistency if these types are used elsewhere,
// or these can be removed if the individual chart components directly use GlobalChartData.
export type PieChartData = GlobalChartData;
export type LineChartData = GlobalChartData;
export type BarChartData = GlobalChartData;

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
