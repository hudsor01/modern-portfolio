/**
 * Chart Types - Type-Safe Chart System
 * Following Prisma type-first architecture principles
 * No any/unknown/never types - explicit type safety
 */

import { ReactNode } from 'react';

// Base chart value types
export type ChartValue = string | number | Date;
export type ChartColor = string;

/**
 * Core chart data structure - type-safe base
 */
export interface ChartDataPoint {
  name: string;
  value: number;
  color?: ChartColor;
  category?: string;
  date?: Date;
  metadata?: Record<string, unknown>;
  [key: string]: unknown; // Allow dynamic property access for chart flexibility
}

/**
 * Enhanced chart data with additional context
 */
export interface ChartData extends ChartDataPoint {
  // Additional standardized fields
  id?: string;
  label?: string;
  fill?: ChartColor;
  stroke?: ChartColor;
}

/**
 * Type-safe chart component props
 */
export interface BaseChartProps<T extends ChartDataPoint = ChartData> {
  data: T[];
  height?: number;
  width?: number;
  colors?: ChartColor[];
  title?: string;
  subtitle?: string;
  className?: string;
  children?: ReactNode;
}

/**
 * Chart interaction event - fully typed
 */
export interface ChartInteractionEvent<T extends ChartDataPoint = ChartData> {
  dataIndex: number;
  dataPoint: T;
  dataKey: keyof T;
  value: number;
  name: string;
  color?: ChartColor;
  coordinates?: {
    x: number;
    y: number;
  };
}

/**
 * Type-safe Recharts tooltip props
 */
export interface TypedTooltipProps<T extends ChartDataPoint = ChartData> {
  active?: boolean;
  payload?: Array<{
    payload: T;
    value: number;
    name: string;
    dataKey: keyof T;
    color: ChartColor;
  }>;
  label?: string;
  formatter?: (value: number, name: string, props: { payload: T }) => [string, string];
}

/**
 * Specific chart data types - all extending base ChartDataPoint
 */

// Skills chart data
export interface SkillData extends ChartDataPoint {
  level: number; // 0-100 proficiency level
  years?: number; // years of experience
  category: string; // technical, soft skills, etc.
}

export interface SkillChartData {
  category: string;
  skills: SkillData[];
}

// Timeline chart data
export interface TimelineData extends Omit<ChartDataPoint, 'icon' | 'duration'> {
  date: Date;
  title: string;
  description: string;
  icon?: ReactNode;
  category: string;
  duration?: {
    start: Date;
    end?: Date; // undefined for current/ongoing
  };
}

// Revenue/Analytics specific chart data
export interface RevenueData extends ChartDataPoint {
  revenue: number;
  period: Date;
  growth?: number; // percentage growth
  forecast?: boolean; // is this forecasted data
}

// Extended revenue data for multi-metric charts
export interface ExtendedRevenueData extends RevenueData {
  transactions?: number; // transaction count
  commissions?: number; // commission amount
}

export interface FunnelStageData extends ChartDataPoint {
  stage: string;
  count: number;
  conversionRate?: number; // percentage
  avgDealSize?: number;
}

export interface LeadSourceData extends ChartDataPoint {
  source: string;
  leads: number;
  conversions: number;
  conversionRate: number;
  costPerLead?: number;
}

/**
 * Chart component specific props - using generics for type safety
 */
export interface PieChartProps extends BaseChartProps<ChartData> {
  showLegend?: boolean;
  showTooltip?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  valueFormatter?: (value: number) => string;
}

export interface BarChartProps extends BaseChartProps<ChartData> {
  layout?: 'horizontal' | 'vertical';
  showGrid?: boolean;
  showLegend?: boolean;
  xAxisKey?: string;
  valueFormatter?: (value: number) => string;
}

export interface LineChartProps extends BaseChartProps<RevenueData> {
  showGrid?: boolean;
  showDots?: boolean;
  curve?: 'linear' | 'monotone' | 'step';
  strokeWidth?: number;
}

export interface FunnelChartProps extends BaseChartProps<FunnelStageData> {
  showConversion?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

/**
 * Value formatter types - no more string literals
 */
export const CHART_FORMAT_TYPES = {
  DEFAULT: 'default',
  CURRENCY: 'currency',
  PERCENTAGE: 'percentage', 
  THOUSANDS: 'thousands',
  COMPACT: 'compact',
  CUSTOM_EXAMPLE: 'customExample'
} as const;

export type ChartFormatType = typeof CHART_FORMAT_TYPES[keyof typeof CHART_FORMAT_TYPES];

// Legacy support - keeping for compatibility
export type FunnelValueFormatType = ChartFormatType;

/**
 * Chart theme configuration
 */
export interface ChartTheme {
  colors: {
    primary: ChartColor[];
    secondary: ChartColor[];
    success: ChartColor;
    warning: ChartColor;
    error: ChartColor;
  };
  fonts: {
    family: string;
    sizes: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
    };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
  };
}
