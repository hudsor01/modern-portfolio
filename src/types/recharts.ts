// Create a file with common chart component types
export interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: Record<string, unknown>;
    value?: number;
    name?: string;
    [key: string]: unknown;
  }>;
  label?: string;
  [key: string]: unknown;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  fill?: string;
  [key: string]: unknown;
}