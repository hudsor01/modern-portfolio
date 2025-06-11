'use client'

import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  RefreshCcw,
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import DealStageFunnelChart from './DealStageFunnelChart'
import { getProject } from '@/lib/content/projects'
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, BarChart as RechartsBarChart, Bar, Cell } from 'recharts'

// Define proper types for funnel data
interface FunnelStage {
  name: string;
  count: number;
  avg_deal_size: number;
}

interface PartnerConversion {
  group: string;
  avg_sales_cycle_days: number;
}

interface ConversionRate {
  month: string;
  lead_to_qualified: number;
  qualified_to_proposal: number;
  proposal_to_negotiation: number;
  negotiation_to_closed: number;
}

export default function DealFunnel() {
  const [isLoading, setIsLoading] = useState(true)
  const [localFunnelStages, setLocalFunnelStages] = useState<FunnelStage[]>([])
  const [localPartnerConversion, setLocalPartnerConversion] = useState<PartnerConversion[]>([])
  const [localConversionRates, setLocalConversionRates] = useState<ConversionRate[]>([])

  // Fetch project data
  useEffect(() => {
    async function loadProjectData() {
      try {
        await getProject('deal-funnel')

        // Create realistic funnel data
        const stages: FunnelStage[] = [
          { name: 'Leads', count: 1250, avg_deal_size: 0 },
          { name: 'Qualified', count: 750, avg_deal_size: 15000 },
          { name: 'Proposal', count: 450, avg_deal_size: 18000 },
          { name: 'Negotiation', count: 280, avg_deal_size: 22000 },
          { name: 'Closed Won', count: 180, avg_deal_size: 25000 },
        ]
        setLocalFunnelStages(stages)

        // Create partner conversion data
        const partnerData: PartnerConversion[] = [
          { group: 'Enterprise', avg_sales_cycle_days: 85 },
          { group: 'Mid-Market', avg_sales_cycle_days: 65 },
          { group: 'SMB', avg_sales_cycle_days: 45 },
        ]
        setLocalPartnerConversion(partnerData)

        // Create conversion rate data
        const conversionData: ConversionRate[] = [
          {
            month: 'Jan',
            lead_to_qualified: 60.2,
            qualified_to_proposal: 58.5,
            proposal_to_negotiation: 62.3,
            negotiation_to_closed: 64.1,
          },
          {
            month: 'Feb',
            lead_to_qualified: 58.7,
            qualified_to_proposal: 60.2,
            proposal_to_negotiation: 59.8,
            negotiation_to_closed: 62.5,
          },
          {
            month: 'Mar',
            lead_to_qualified: 62.1,
            qualified_to_proposal: 61.8,
            proposal_to_negotiation: 63.4,
            negotiation_to_closed: 65.2,
          },
        ]
        setLocalConversionRates(conversionData)

        // Simulate loading
        setTimeout(() => setIsLoading(false), 800)
      } catch (error) {
        console.error('Error loading project data:', error)
        setIsLoading(false)
      }
    }

    loadProjectData()
  }, [])

  // Ensure data is available before accessing indices
  const totalOpportunities = localFunnelStages?.[0]?.count ?? 0
  const closedDeals = localFunnelStages.length > 0 ? localFunnelStages[localFunnelStages.length - 1]?.count ?? 0 : 0
  const avgDealSize = localFunnelStages.length > 0 ? Math.round(localFunnelStages[localFunnelStages.length - 1]?.avg_deal_size ?? 0) : 0

  // Ensure safe calculations
  const avgSalesCycle =
    localPartnerConversion.length > 0
      ? Math.round(
          localPartnerConversion.reduce((sum, group) => sum + group.avg_sales_cycle_days, 0) /
            localPartnerConversion.length
        )
      : 0

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  // Prepare stage conversion data for visualization
  const stageConversions =
    localConversionRates.length > 0
      ? [
        {
          stage: 'Leads → Qualified',
          conversion: localConversionRates[localConversionRates.length - 1]?.lead_to_qualified ?? 0,
          color: '#4F46E5',
        },
        {
          stage: 'Qualified → Proposal',
          conversion: localConversionRates[localConversionRates.length - 1]?.qualified_to_proposal ?? 0,
          color: '#8B5CF6',
        },
        {
          stage: 'Proposal → Negotiation',
          conversion: localConversionRates[localConversionRates.length - 1]?.proposal_to_negotiation ?? 0,
          color: '#EC4899',
        },
        {
          stage: 'Negotiation → Closed',
          conversion: localConversionRates[localConversionRates.length - 1]?.negotiation_to_closed ?? 0,
          color: '#F59E0B',
        },
        ]
      : []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white px-4 py-8 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/projects"
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            <span>Back to Projects</span>
          </Link>
        </div>

        {/* KPI Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
            variants={fadeInUp}
          >
            <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Opportunities</h3>
            <p className="text-2xl font-bold">{totalOpportunities.toLocaleString()}</p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
            variants={fadeInUp}
          >
            <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Closed Deals</h3>
            <p className="text-2xl font-bold">{closedDeals.toLocaleString()}</p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
            variants={fadeInUp}
          >
            <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Average Deal Size</h3>
            <p className="text-2xl font-bold">${avgDealSize.toLocaleString()}</p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
            variants={fadeInUp}
          >
            <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Avg Sales Cycle (Days)
            </h3>
            <p className="text-2xl font-bold">{avgSalesCycle}</p>
          </motion.div>
        </motion.div>

        {/* Funnel Chart */}
        <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow" variants={fadeInUp}>
          <h3 className="text-lg font-semibold mb-4">Deal Stage Conversion Funnel</h3>
          {isLoading ? (
            <div className="h-40 flex items-center justify-center">
              <RefreshCcw className="animate-spin text-blue-600 dark:text-blue-400" size={24} />
            </div>
          ) : (
            <DealStageFunnelChart stages={localFunnelStages} />
          )}
        </motion.div>

        {/* Stage Conversion Rates */}
        <motion.div
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-8"
          variants={fadeInUp}
        >
          <h3 className="text-lg font-semibold mb-4">Stage Conversion Rates</h3>
          {isLoading ? (
            <div className="h-40 flex items-center justify-center">
              <RefreshCcw className="animate-spin text-blue-600 dark:text-blue-400" size={24} />
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={stageConversions} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                  <YAxis dataKey="stage" type="category" width={150} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Conversion Rate']} />
                  <Bar dataKey="conversion" radius={[0, 4, 4, 0]}>
                    {stageConversions.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
