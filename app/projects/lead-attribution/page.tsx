'use client'

import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import Link from 'next/link'
import {
  ArrowLeft,
  RefreshCcw,
} from 'lucide-react'
import LeadSourcePieChart from './LeadSourcePieChart'

// Import real data
import {
  leadAttributionData as leadSourceData,
} from '@/app/projects/data/partner-analytics'

// TODO: UPDATE FOR A PRODUCTION IMPLEMENTATION
// Mock conversion data for demo (replace with real data as needed)
const leadConversionData = [
  { source: 'Website', conversions: 120, conversion_rate: 0.12 },
  { source: 'Referral', conversions: 80, conversion_rate: 0.16 },
  { source: 'Social', conversions: 40, conversion_rate: 0.08 },
]

// TODO: UPDATE FOR A PRODUCTION IMPLEMENTATION
// Mock monthly trend data for demo (replace with real data as needed)
const monthlyTrendData = [
  { month: 'Jan', leads: 100, conversions: 12 },
  { month: 'Feb', leads: 120, conversions: 18 },
  { month: 'Mar', leads: 90, conversions: 10 },
  { month: 'Apr', leads: 110, conversions: 15 },
]

export default function LeadAttribution() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500) // Simulated loading delay
  }, [])

  // Calculate totals safely
  const totalLeads = leadSourceData?.reduce(
    (sum: number, source: { leads: number }) => sum + (source.leads || 0),
    0
  ) || 0
  const totalConversions =
    leadConversionData?.reduce(
      (sum: number, source: { conversions: number }) => sum + (source.conversions || 0),
      0
    ) || 0

  // Calculate conversion rate safely
  const overallConversionRate = totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0

  return (
    <div className="flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/projects">
          <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-black cursor-pointer" />
        </Link>
        <h1 className="text-xl font-bold">Lead Attribution Dashboard</h1>
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
              <h2 className="text-sm text-gray-500">Total Leads</h2>
              <p className="text-xl font-bold">{totalLeads.toLocaleString()}</p>
            </div>
            <div className="bg-white shadow-md p-4 rounded-md">
              <h2 className="text-sm text-gray-500">Total Conversions</h2>
              <p className="text-xl font-bold">{totalConversions.toLocaleString()}</p>
            </div>
            <div className="bg-white shadow-md p-4 rounded-md">
              <h2 className="text-sm text-gray-500">Conversion Rate</h2>
              <p className="text-xl font-bold">{overallConversionRate.toFixed(2)}%</p>
            </div>
          </div>

          {/* Lead Source Pie Chart */}
          <div className="mt-6">
            <LeadSourcePieChart />
          </div>

          {/* Monthly Trends Line Chart */}
          <div className="mt-6 bg-white shadow-md p-4 rounded-md">
            <h2 className="text-lg font-semibold">Monthly Lead Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="leads" stroke="#8884d8" />
                <Line type="monotone" dataKey="conversions" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}
