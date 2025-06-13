'use client'

import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  RefreshCcw,
} from 'lucide-react'
import Link from 'next/link'
import ChurnLineChart from './ChurnLineChart'
import RetentionHeatmap from './RetentionHeatmap'

// Import real data
import {
  monthlyChurnData,
} from '@/app/projects/data/partner-analytics'

export default function ChurnAnalysis() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500) // Simulated loading delay
  }, [])

  // Ensure data exists before accessing indices
  const currentMonth = monthlyChurnData?.[monthlyChurnData.length - 1] ?? null
  const previousMonth = monthlyChurnData?.[monthlyChurnData.length - 2] ?? null

  // Safe calculations
  const churnDifference =
    currentMonth && previousMonth
      ? (currentMonth.churn_rate - previousMonth.churn_rate).toFixed(1)
      : '0.0'

  const retentionDifference =
    currentMonth && previousMonth
      ? (
          (currentMonth.retained_partners /
            (currentMonth.retained_partners + currentMonth.churned_partners)) *
            100 -
          (previousMonth.retained_partners /
            (previousMonth.retained_partners + previousMonth.churned_partners)) *
            100
        ).toFixed(1)
      : '0.0'

  return (
    <div className="flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/projects">
          <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-black cursor-pointer" />
        </Link>
        <h1 className="text-xl font-bold">Churn & Retention Analysis</h1>
        <button onClick={() => setIsLoading(true)}>
          <RefreshCcw className="h-6 w-6 text-gray-600 hover:text-black cursor-pointer" />
        </button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">Loading...</div>
      ) : (
        <>
          {/* KPI Section */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-white shadow-md p-4 rounded-md">
              <h2 className="text-sm text-gray-500">Current Churn Rate</h2>
              <p className="text-xl font-bold">
                {currentMonth ? `${currentMonth.churn_rate}%` : 'N/A'}
              </p>
            </div>
            <div className="bg-white shadow-md p-4 rounded-md">
              <h2 className="text-sm text-gray-500">Churn Difference</h2>
              <p
                className={`text-xl font-bold ${
                  churnDifference >= '0' ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {churnDifference}%
              </p>
            </div>
            <div className="bg-white shadow-md p-4 rounded-md">
              <h2 className="text-sm text-gray-500">Retention Difference</h2>
              <p
                className={`text-xl font-bold ${
                  retentionDifference >= '0' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {retentionDifference}%
              </p>
            </div>
          </div>

          {/* Retention Heatmap */}
          <div className="mt-6">
            <RetentionHeatmap />
          </div>

          {/* Churn Trends Line Chart */}
          <div className="mt-6 bg-white shadow-md p-4 rounded-md">
            <h2 className="text-lg font-semibold">Churn Rate Trends</h2>
            <ChurnLineChart />
          </div>
        </>
      )}
    </div>
  )
}
