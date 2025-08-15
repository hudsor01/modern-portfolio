'use client'

import { useState, useMemo, useCallback } from 'react'
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  Cell 
} from 'recharts'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { ChartData } from '@/types/project'

interface EnhancedBarChartProps {
  data: ChartData[]
  title?: string
  dataKey: string
  xAxisKey?: string
  colors?: string[]
  showGrid?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  showTrend?: boolean
  height?: number
  valueFormatter?: (value: number) => string
  className?: string
  animationDelay?: number
  onBarClick?: (data: ChartData, index: number) => void
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    name: string
    color: string
    dataKey: string
  }>
  label?: string
  valueFormatter?: (value: number) => string
}

const CustomTooltip = ({ active, payload, label, valueFormatter }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-xl p-4 shadow-xl"
    >
      <p className="text-white font-semibold mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-300 text-sm">
            {entry.name}: {valueFormatter ? valueFormatter(entry.value) : entry.value}
          </span>
        </div>
      ))}
    </motion.div>
  )
}

export function EnhancedBarChart({ 
  data, 
  title,
  dataKey,
  xAxisKey = 'name',
  colors = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'],
  showGrid = true,
  showLegend = false,
  showTooltip = true,
  showTrend = true,
  height = 400,
  valueFormatter = (value) => value.toString(),
  className = '',
  animationDelay = 0,
  onBarClick
}: EnhancedBarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  // Calculate trend
  const trend = useMemo(() => {
    if (!showTrend || data.length < 2) return null
    
    const values = data.map(item => Number(item[dataKey]) || 0)
    const first = values[0]
    const last = values[values.length - 1]
    
    if (first === undefined || last === undefined || first === 0) {
      return null
    }
    
    const change = ((last - first) / first) * 100
    
    return {
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
      percentage: Math.abs(change).toFixed(1)
    }
  }, [data, dataKey, showTrend])

  // Handle bar click
  const handleBarClick = useCallback((data: unknown, index: number) => {
    setSelectedIndex(index === selectedIndex ? null : index)
    if (onBarClick && typeof data === 'object' && data !== null) {
      onBarClick(data as ChartData, index)
    }
  }, [selectedIndex, onBarClick])

  // Get bar color based on state
  const getBarColor = useCallback((index: number) => {
    if (selectedIndex === index) return colors[0]
    if (hoveredIndex === index) return colors[1]
    return colors[index % colors.length]
  }, [colors, hoveredIndex, selectedIndex])

  return (
    <motion.div 
      className={`w-full ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay, duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {title && (
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            {title}
            {trend && (
              <div className="flex items-center gap-1">
                {trend.direction === 'up' && (
                  <TrendingUp className="w-5 h-5 text-green-400" />
                )}
                {trend.direction === 'down' && (
                  <TrendingDown className="w-5 h-5 text-red-400" />
                )}
                {trend.direction === 'neutral' && (
                  <Minus className="w-5 h-5 text-gray-400" />
                )}
                <span 
                  className={`text-sm font-medium ${
                    trend.direction === 'up' ? 'text-green-400' : 
                    trend.direction === 'down' ? 'text-red-400' : 
                    'text-gray-400'
                  }`}
                >
                  {trend.percentage}%
                </span>
              </div>
            )}
          </h3>
        )}
      </div>

      {/* Chart */}
      <div 
        className="relative bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6"
        role="img"
        aria-label={`Bar chart showing ${title || 'data'}`}
      >
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart 
            data={data} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            {showGrid && (
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(255,255,255,0.1)"
                vertical={false}
              />
            )}
            
            <XAxis 
              dataKey={xAxisKey}
              tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.7)' }}
              tickLine={{ stroke: 'rgba(255,255,255,0.3)' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
            />
            
            <YAxis 
              tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.7)' }}
              tickLine={{ stroke: 'rgba(255,255,255,0.3)' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
              tickFormatter={valueFormatter}
            />
            
            {showTooltip && (
              <Tooltip 
                content={<CustomTooltip valueFormatter={valueFormatter} />}
                cursor={{ fill: 'rgba(255,255,255,0.1)' }}
              />
            )}
            
            {showLegend && (
              <Legend 
                wrapperStyle={{ color: 'rgba(255,255,255,0.8)' }}
              />
            )}
            
            <Bar 
              dataKey={dataKey}
              radius={[4, 4, 0, 0]}
              onClick={handleBarClick}
              onMouseEnter={(_data: unknown, index: number) => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ cursor: onBarClick ? 'pointer' : 'default' }}
            >
              {data.map((_entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getBarColor(index)}
                />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>

        {/* Data Summary */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.slice(0, 4).map((item, index) => (
            <div 
              key={index}
              className="text-center p-2 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="text-sm text-gray-400">{item[xAxisKey]}</div>
              <div className="text-lg font-semibold text-white">
                {valueFormatter(Number(item[dataKey]) || 0)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accessibility info */}
      <div className="sr-only">
        Chart data: {data.map((item, _index) => 
          `${item[xAxisKey]}: ${valueFormatter(Number(item[dataKey]) || 0)}`
        ).join(', ')}
      </div>
    </motion.div>
  )
}