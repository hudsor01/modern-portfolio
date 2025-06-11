'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  RefreshCcw,
  TrendingUp,
  Download,
} from 'lucide-react'
import { motion } from 'framer-motion'
import RevenueBarChart from './RevenueBarChart'
import RevenueLineChart from './RevenueLineChart'
import TopPartnersChart from './TopPartnersChart'
import PartnerGroupPieChart from './PartnerGroupPieChart'
import { yearOverYearGrowth as rawYearOverYearGrowth } from '@/app/projects/data/partner-analytics'

// Define the correct type for the data
type YearOverYearGrowth = {
  year: number;
  total_revenue: number;
  total_transactions: number;
  total_commissions: number;
  partner_count: number;
  commission_growth_percentage: number;
};

// Cast the imported data to the correct type
const yearOverYearGrowth = rawYearOverYearGrowth as YearOverYearGrowth[];

export default function RevenueKPI() {
  const [activeTimeframe, setActiveTimeframe] = useState('All')
  const [isLoading] = useState(true)

  // Get the most recent year data
  const currentYearData: YearOverYearGrowth | undefined = yearOverYearGrowth[yearOverYearGrowth.length - 1];
  const prevYearData: YearOverYearGrowth | undefined = yearOverYearGrowth[yearOverYearGrowth.length - 2];

  // Calculate growth percentages
  const revenueGrowth =
    prevYearData?.total_revenue && currentYearData?.total_revenue
      ? ((currentYearData.total_revenue - prevYearData.total_revenue) / prevYearData.total_revenue) * 100
      : 0;
  // Calculate partner growth percentage manually
  const partnerGrowth =
    prevYearData?.partner_count && currentYearData?.partner_count
      ? ((currentYearData.partner_count - prevYearData.partner_count) / prevYearData.partner_count) * 100
      : 0;
  // Calculate transaction growth percentage manually
  const transactionGrowth =
    prevYearData?.total_transactions && currentYearData?.total_transactions
      ? ((currentYearData.total_transactions - prevYearData.total_transactions) / prevYearData.total_transactions) * 100
      : 0;

  // Handle undefined data
  if (!currentYearData) {
    console.error("currentYearData is undefined");
    return <div>Error: Data not available</div>;
  }


  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-8 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/projects"
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            <span>Back to Projects</span>
          </Link>

          <div className="flex items-center space-x-2">
            <button
              className={`px-3 py-1 rounded-md ${activeTimeframe === '2020' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700'}`}
              onClick={() => setActiveTimeframe('2020')}
            >
              2020
            </button>
            <button
              className={`px-3 py-1 rounded-md ${activeTimeframe === '2022' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700'}`}
              onClick={() => setActiveTimeframe('2022')}
            >
              2022
            </button>
            <button
              className={`px-3 py-1 rounded-md ${activeTimeframe === '2024' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700'}`}
              onClick={() => setActiveTimeframe('2024')}
            >
              2024
            </button>
            <button
              className={`px-3 py-1 rounded-md ${activeTimeframe === 'All' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700'}`}
              onClick={() => setActiveTimeframe('All')}
            >
              All
            </button>
          </div>
        </div>

        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Revenue KPI Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Comprehensive view of revenue metrics and partner performance indicators
          </p>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
            variants={fadeInUp}
            key="total-revenue"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                TOTAL REVENUE
              </h3>
              <span className="text-green-500 dark:text-green-400 text-xs px-2 py-1 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center">
                <TrendingUp size={12} className="mr-1" />+{revenueGrowth.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-baseline">
              <p className="text-3xl font-bold">
                ${(currentYearData?.total_revenue / 1000000).toFixed(1)}M
              </p>
              <p className="text-slate-500 dark:text-slate-400 ml-2 text-sm">
                {currentYearData.year}
              </p>
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
            variants={fadeInUp}
            key="partner-count"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                PARTNER COUNT
              </h3>
              <span className="text-blue-500 dark:text-blue-400 text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center">
                <TrendingUp size={12} className="mr-1" />+{partnerGrowth.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-baseline">
              <p className="text-3xl font-bold">{currentYearData.partner_count}</p>
              <p className="text-slate-500 dark:text-slate-400 ml-2 text-sm">Partners</p>
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
            variants={fadeInUp}
            key="transactions"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                TRANSACTIONS
              </h3>
              <span className="text-indigo-500 dark:text-indigo-400 text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center">
                <TrendingUp size={12} className="mr-1" />+{transactionGrowth.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-baseline">
              <p className="text-3xl font-bold">
                {(currentYearData?.total_transactions / 1000).toFixed(1)}K
              </p>
              <p className="text-slate-500 dark:text-slate-400 ml-2 text-sm">Transactions</p>
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
            variants={fadeInUp}
            key="commissions"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                COMMISSIONS
              </h3>
              <span className="text-purple-500 dark:text-purple-400 text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center">
                <TrendingUp size={12} className="mr-1" />+
                {currentYearData.commission_growth_percentage.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-baseline">
              <p className="text-3xl font-bold">
                ${(currentYearData.total_commissions / 1000000).toFixed(1)}M
              </p>
              <p className="text-slate-500 dark:text-slate-400 ml-2 text-sm">Paid out</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Charts section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Bar Chart */}
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            key="revenue-bar-chart"
          >
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <RefreshCcw size={24} className="text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
            ) : (
              <RevenueBarChart />
            )}
          </motion.div>

          {/* Revenue Line Chart */}
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            key="revenue-line-chart"
          >
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <RefreshCcw size={24} className="text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
            ) : (
              <RevenueLineChart />
            )}
          </motion.div>
        </div>

        {/* Secondary charts section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Partners Chart */}
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            key="top-partners-chart"
          >
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <RefreshCcw size={24} className="text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
            ) : (
              <TopPartnersChart />
            )}
          </motion.div>

          {/* Partner Group Pie Chart */}
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
            key="partner-group-pie-chart"
          >
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <RefreshCcw size={24} className="text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
            ) : (
              <PartnerGroupPieChart />
            )}
          </motion.div>
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex justify-between">
          <Link
            href="/projects"
            className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white px-5 py-2 rounded-lg transition-colors flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Projects
          </Link>

          <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg transition-colors flex items-center">
            <Download size={16} className="mr-2" />
            <span>Export Report</span>
          </button>
        </div>
      </div>
    </div>
  )
}
