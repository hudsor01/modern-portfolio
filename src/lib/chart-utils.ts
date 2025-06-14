/**
 * Type-safe chart utilities
 * Demonstrates the comprehensive type architecture strategy
 */

import type { 
  ChartDataPoint, 
  ChartData, 
  RevenueData, 
  FunnelStageData, 
  LeadSourceData,
  ChartFormatType,
  ChartColor
} from '@/types/chart';
import { CHART_FORMAT_TYPES } from '@/types/chart';

/**
 * Type-safe data formatters - no string literals
 */
export const formatters = {
  [CHART_FORMAT_TYPES.DEFAULT]: (value: number): string => value.toString(),
  [CHART_FORMAT_TYPES.CURRENCY]: (value: number): string => 
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: value >= 1000000 ? 1 : 0,
      maximumFractionDigits: value >= 1000000 ? 1 : 0,
    }).format(value),
  [CHART_FORMAT_TYPES.PERCENTAGE]: (value: number): string => 
    `${(value * 100).toFixed(1)}%`,
  [CHART_FORMAT_TYPES.THOUSANDS]: (value: number): string => 
    value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value.toString(),
  [CHART_FORMAT_TYPES.COMPACT]: (value: number): string => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  },
  [CHART_FORMAT_TYPES.CUSTOM_EXAMPLE]: (value: number): string => 
    `Val: ${value}`,
} as const satisfies Record<ChartFormatType, (value: number) => string>;

/**
 * Type-safe format value function
 */
export function formatValue(
  value: number,
  format: ChartFormatType = CHART_FORMAT_TYPES.DEFAULT
): string {
  return formatters[format](value);
}

/**
 * Chart data validators - ensure type safety at runtime
 */
export function isValidChartData<T extends ChartDataPoint>(data: unknown[]): data is T[] {
  return Array.isArray(data) && data.every(item => 
    typeof item === 'object' &&
    item !== null &&
    'name' in item &&
    'value' in item &&
    typeof (item as ChartDataPoint).name === 'string' &&
    typeof (item as ChartDataPoint).value === 'number'
  );
}

export function isRevenueData(data: unknown[]): data is RevenueData[] {
  return isValidChartData(data) && data.every(item =>
    'revenue' in item &&
    'period' in item &&
    typeof (item as RevenueData).revenue === 'number' &&
    (item as RevenueData).period instanceof Date
  );
}

export function isFunnelData(data: unknown[]): data is FunnelStageData[] {
  return isValidChartData(data) && data.every(item =>
    'stage' in item &&
    'count' in item &&
    typeof (item as FunnelStageData).stage === 'string' &&
    typeof (item as FunnelStageData).count === 'number'
  );
}

export function isLeadSourceData(data: unknown[]): data is LeadSourceData[] {
  return isValidChartData(data) && data.every(item =>
    'source' in item &&
    'leads' in item &&
    'conversions' in item &&
    'conversionRate' in item &&
    typeof (item as LeadSourceData).source === 'string' &&
    typeof (item as LeadSourceData).leads === 'number' &&
    typeof (item as LeadSourceData).conversions === 'number' &&
    typeof (item as LeadSourceData).conversionRate === 'number'
  );
}

/**
 * Type-safe color palette generator
 */
export function generateChartColors(count: number): ChartColor[] {
  const baseColors: ChartColor[] = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];
  
  // If we need more colors than base, generate variations
  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }
  
  const colors: ChartColor[] = [...baseColors];
  for (let i = baseColors.length; i < count; i++) {
    const baseIndex = i % baseColors.length;
    const opacity = 0.8 - ((i - baseColors.length) * 0.1);
    colors.push(`${baseColors[baseIndex]} / ${Math.max(opacity, 0.3)}`);
  }
  
  return colors;
}

/**
 * Type-safe data transformers
 */
export function transformToChartData<T extends Record<string, unknown>>(
  data: T[],
  nameKey: keyof T,
  valueKey: keyof T
): ChartData[] {
  return data.map((item, index) => ({
    name: String(item[nameKey]),
    value: Number(item[valueKey]) || 0,
    id: String(index),
    metadata: {
      source: 'Data transformation utility'
    }
  }));
}

export function transformToRevenueData<T extends Record<string, unknown>>(
  data: T[],
  nameKey: keyof T,
  revenueKey: keyof T,
  periodKey: keyof T,
  growthKey?: keyof T
): RevenueData[] {
  return data.map((item, index) => ({
    name: String(item[nameKey]),
    value: Number(item[revenueKey]) || 0,
    revenue: Number(item[revenueKey]) || 0,
    period: new Date(String(item[periodKey])),
    growth: growthKey ? Number(item[growthKey]) : undefined,
    id: String(index),
    metadata: {
      source: 'Revenue data transformation'
    }
  }));
}

/**
 * Chart theme utilities
 */
export const chartThemeConfig = {
  colors: {
    primary: [
      'hsl(var(--chart-1))',
      'hsl(var(--chart-2))',
      'hsl(var(--chart-3))',
      'hsl(var(--chart-4))',
      'hsl(var(--chart-5))',
    ],
    grid: 'hsl(var(--border))',
    axis: 'hsl(var(--muted-foreground))',
    background: 'hsl(var(--card))',
    foreground: 'hsl(var(--card-foreground))',
    border: 'hsl(var(--border))',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
  fonts: {
    family: 'var(--font-family)',
    sizes: {
      xs: '11px',
      sm: '12px',
      md: '14px',
      lg: '16px',
    },
  },
} as const;

/**
 * Type-safe chart configuration builder
 */
export function buildChartConfig<T extends ChartDataPoint>(
  data: T[],
  options?: {
    colors?: ChartColor[];
    formatType?: ChartFormatType;
    showGrid?: boolean;
    showLegend?: boolean;
  }
) {
  const colors = options?.colors || generateChartColors(data.length);
  const formatType = options?.formatType || CHART_FORMAT_TYPES.DEFAULT;
  
  return {
    data: data.map((item, index) => ({
      ...item,
      fill: colors[index % colors.length],
      color: colors[index % colors.length],
    })),
    colors,
    formatValue: (value: number) => formatValue(value, formatType),
    theme: chartThemeConfig,
    options: {
      showGrid: options?.showGrid ?? true,
      showLegend: options?.showLegend ?? true,
    },
  };
}

/**
 * Error handling for chart data
 */
export class ChartDataError extends Error {
  constructor(message: string, public readonly data?: unknown) {
    super(`Chart Data Error: ${message}`);
    this.name = 'ChartDataError';
  }
}

export function validateChartData<T extends ChartDataPoint>(
  data: unknown,
  validator: (data: unknown) => data is T[]
): T[] {
  if (!Array.isArray(data)) {
    throw new ChartDataError('Data must be an array', data);
  }
  
  if (!validator(data)) {
    throw new ChartDataError('Data does not match expected chart data structure', data);
  }
  
  return data;
}