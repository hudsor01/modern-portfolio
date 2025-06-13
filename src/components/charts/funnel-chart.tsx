'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface FunnelData {
  stage: string
  value: number
  conversion?: number
}

// Import the new type (adjust path if you place it elsewhere)
import type { FunnelValueFormatType } from '@/types/chart'; // Assuming types/ is aliased to @/types/
import { formatValue } from '@/lib/chart-utils'; // Import centralized formatter

interface FunnelChartProps {
  data: FunnelData[]
  title?: string
  color?: string
  showConversion?: boolean
  valueFormat?: FunnelValueFormatType // Changed from valueFormatter function
  className?: string
}

// getClientSideValueFormatter is removed as we'll use formatValue from chart-utils

export function FunnelChart({ 
  data, 
  title,
  color = 'hsl(var(--chart-1))',
  showConversion = true,
  valueFormat = 'default', // Use the new prop and its default
  className = ''
}: FunnelChartProps) {
  // Resolve the formatter function based on the prop
  const valueFormatter = (value: number) => formatValue(value, valueFormat);

  // Type for the third argument of the Recharts Tooltip formatter function.
  // This 'props' object (often called 'item' or 'entry') contains a 'payload'
  // property which is the original data object (FunnelData).
  interface FormatterProps {
    payload?: FunnelData;
    // Recharts passes other properties like value, name, color, dataKey etc.
    // We only define what we use to keep it simple and avoid 'any'.
  }
  const formatTooltip = (value: number, name: string, props: FormatterProps) => {
    if (name === 'value') {
      const conversion = props.payload?.conversion
      return [
        valueFormatter(value),
        'Count',
        ...(conversion ? [`${conversion}% conversion`] : [])
      ]
    }
    return [value, name]
  }

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart 
          data={data} 
          layout="horizontal"
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number"
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: 'var(--border)' }}
            axisLine={{ stroke: 'var(--border)' }}
            tickFormatter={valueFormatter}
          />
          <YAxis 
            type="category"
            dataKey="stage"
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: 'var(--border)' }}
            axisLine={{ stroke: 'var(--border)' }}
            width={120}
          />
          <Tooltip 
            formatter={formatTooltip}
            contentStyle={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--foreground)'
            }}
          />
          <Bar 
            dataKey="value" 
            fill={color}
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      {showConversion && (
        <div className="mt-4 space-y-2">
          {data.map((item) => (
            <div key={item.stage} className="flex justify-between text-sm">
              <span>{item.stage}</span>
              <span className="text-muted-foreground">
                {item.conversion ? `${item.conversion}% conversion` : ''}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
