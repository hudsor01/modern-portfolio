'use client'

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

import { cn } from '@/lib/utils'
import type { ChartData } from '@/types/chart'

type ChartType = 'bar' | 'line' | 'doughnut'

interface ChartOptions {
  xAxisLabel?: string;
  yAxisLabel?: string;
  [key: string]: unknown;
}

interface ProjectChartProps {
  type: ChartType
  data: ChartData[]
  options?: ChartOptions
  className?: string
  title?: string
  animationDuration?: number
  dataKey?: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF']

export function ProjectChart({
  type,
  data,
  options,
  className,
  title,
  animationDuration = 0.5,
  dataKey = 'value',
}: ProjectChartProps) {
  const animationProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: animationDuration },
  }

  // Handle labels for Bar and Line charts
  const getBarLineChartData = () => {
    if (options && options.yAxisLabel && options.xAxisLabel && data.length) {
      const yLabel: string = options.yAxisLabel;
      const xLabel: string = options.xAxisLabel;
      return data.map((item) => ({
        ...item,
        [yLabel]: item[yLabel],
        [xLabel]: item[xLabel],
      }));
    }
    return data;
  };
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={getBarLineChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={options?.xAxisLabel || 'name'} />
              <YAxis
                label={{
                  value: options?.yAxisLabel,
                  angle: -90,
                  position: 'insideLeft',
                }}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey={options?.yAxisLabel || dataKey} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={getBarLineChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={options?.xAxisLabel || 'name'} />
              <YAxis
                label={{
                  value: options?.yAxisLabel,
                  angle: -90,
                  position: 'insideLeft',
                }}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={options?.yAxisLabel || dataKey}
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )
      case 'doughnut':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                dataKey={dataKey}
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )
      default:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={getBarLineChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={options?.xAxisLabel || 'name'} />
              <YAxis
                label={{
                  value: options?.yAxisLabel,
                  angle: -90,
                  position: 'insideLeft',
                }}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey={options?.yAxisLabel || dataKey} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )
    }
  }

  return (
    <div
      className={cn('bg-card w-full rounded-lg p-4 shadow-xs', className)}
      {...animationProps}
    >
      {title && <h3 className="mb-4 typography-large">{title}</h3>}
      {renderChart()}
    </div>
  )
}
