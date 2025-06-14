'use client'

import { useState } from 'react'

interface HeatmapData {
  row: string
  col: string
  value: number
}

interface HeatmapChartProps {
  data: HeatmapData[]
  title?: string
  valueFormatterAction?: (value: number) => string
  colorScale?: string[]
  className?: string
}

const DEFAULT_COLOR_SCALE = [
  'hsl(var(--chart-1) / 0.1)', 'hsl(var(--chart-1) / 0.3)', 
  'hsl(var(--chart-1) / 0.5)', 'hsl(var(--chart-1) / 0.7)', 
  'hsl(var(--chart-1) / 0.8)', 'hsl(var(--chart-1) / 0.9)', 
  'hsl(var(--chart-1))', 'hsl(var(--primary))'
]

export function HeatmapChart({ 
  data, 
  title,
  valueFormatterAction = (value) => value.toString(),
  colorScale = DEFAULT_COLOR_SCALE,
  className = ''
}: HeatmapChartProps) {
  const [hoveredCell, setHoveredCell] = useState<{ row: string, col: string, value: number } | null>(null)

  // Get unique rows and columns
  const rows = Array.from(new Set(data.map(d => d.row))).sort()
  const cols = Array.from(new Set(data.map(d => d.col))).sort()

  // Get min and max values for color scaling
  const values = data.map(d => d.value)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)

  // Create a lookup for quick data access
  const dataLookup = new Map()
  data.forEach(d => {
    dataLookup.set(`${d.row}-${d.col}`, d.value)
  })

  // Get color for a value
  const getColor = (value: number): string => {
    if (minValue === maxValue) return colorScale[0] || 'hsl(var(--chart-1) / 0.1)'
    const normalized = (value - minValue) / (maxValue - minValue)
    const index = Math.floor(normalized * (colorScale.length - 1))
    return colorScale[Math.min(index, colorScale.length - 1)] || 'hsl(var(--chart-1) / 0.1)'
  }

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      )}
      
      <div className="relative overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-sm font-medium text-left"></th>
              {cols.map(col => (
                <th key={col} className="p-2 text-sm font-medium text-center min-w-[60px]">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row}>
                <td className="p-2 text-sm font-medium text-right pr-4">
                  {row}
                </td>
                {cols.map(col => {
                  const value = dataLookup.get(`${row}-${col}`) || 0
                  const color = getColor(value)
                  
                  return (
                    <td 
                      key={`${row}-${col}`}
                      className="p-1"
                    >
                      <div
                        className="w-full h-12 flex items-center justify-center text-xs font-medium cursor-pointer rounded transition-all hover:scale-105 hover:shadow-sm"
                        style={{ backgroundColor: color }}
                        onMouseEnter={() => setHoveredCell({ row, col, value })}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        {valueFormatterAction(value)}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <div className="mt-4 p-3 bg-card border border-border rounded-lg shadow-sm">
          <div className="text-sm">
            <strong>{hoveredCell.row}</strong> × <strong>{hoveredCell.col}</strong>
          </div>
          <div className="text-lg font-semibold">
            {valueFormatterAction(hoveredCell.value)}
          </div>
        </div>
      )}

      {/* Color Legend */}
      <div className="mt-4 flex items-center justify-center space-x-2">
        <span className="text-xs text-muted-foreground">
          {valueFormatterAction(minValue)}
        </span>
        <div className="flex">
          {colorScale.map((color, index) => (
            <div 
              key={index}
              className="w-4 h-4"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {valueFormatterAction(maxValue)}
        </span>
      </div>
    </div>
  )
}