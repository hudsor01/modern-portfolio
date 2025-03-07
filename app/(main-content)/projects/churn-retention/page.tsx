'use client';

import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  RefreshCcw,
  Calendar,
  Download,
  Filter,
  ChevronDown,
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ChurnLineChart from './ChurnLineChart';
import RetentionHeatmap from './RetentionHeatmap';

// Import real data
import {
  monthlyChurnData,
  partnerGroupRetention,
  retentionCohortData,
} from '@/lib/data/partner-analytics';

export default function ChurnAnalysis() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTimeframe, setActiveTimeframe] = useState('6M');
  const [selectedSegment, setSelectedSegment] = useState('All');

  // Current churn and retention rates
  const currentMonth = monthlyChurnData[monthlyChurnData.length - 1];
  const previousMonth = monthlyChurnData[monthlyChurnData.length - 2];

  const churnDifference = (currentMonth.churn_rate - previousMonth.churn_rate).toFixed(1);

  const retentionDifference = (
    (currentMonth.retained_partners /
      (currentMonth.retained_partners + currentMonth.churned_partners)) *
      100 -
    (previousMonth.retained_partners /
      (previousMonth.retained_partners + previousMonth.churned_partners)) *
      100
  ).toFixed(1);

  // Calculate average lifetime based on channel group retention data
  const avgLifetime = Math.round(
    partnerGroupRetention.reduce((sum, item) => sum + item.avg_partner_tenure_months, 0) /
      partnerGroupRetention.length
  );

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Calculate average churn and retention
  const avgChurn = parseFloat(
    (
      monthlyChurnData.reduce((sum, item) => sum + item.churn_rate, 0) / monthlyChurnData.length
    ).toFixed(1)
  );

  const avgRetention = parseFloat(
    (
      monthlyChurnData.reduce(
        (sum, item) =>
          sum + (item.retained_partners / (item.retained_partners + item.churned_partners)) * 100,
        0
      ) / monthlyChurnData.length
    ).toFixed(1)
  );

  // Current retention rate as percentage
  const currentRetentionRate = parseFloat(
    (
      (currentMonth.retained_partners /
        (currentMonth.retained_partners + currentMonth.churned_partners)) *
      100
    ).toFixed(1)
  );

  // Latest cohort data
  const latestCohortData = retentionCohortData[retentionCohortData.length - 1];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white px-4 py-8 md:p-8">
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
              className={`px-3 py-1 rounded-md ${
                activeTimeframe === '3M'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveTimeframe('3M')}
            >
              3M
            </button>
            <button
              className={`px-3 py-1 rounded-md ${
                activeTimeframe === '6M'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveTimeframe('6M')}
            >
              6M
            </button>
            <button
              className={`px-3 py-1 rounded-md ${
                activeTimeframe === '1Y'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveTimeframe('1Y')}
            >
              1Y
            </button>
          </div>
        </div>

        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Churn & Retention Analysis</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Retention metrics and churn prevention insights based on real transaction data
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
            className="bg-white dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
            variants={fadeInUp}
          >
            <div className="flex justify-between mb-3">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                CURRENT CHURN RATE
              </h3>
              <span
                className={`text-xs px-2 py-1 rounded-full flex items-center ${
                  parseFloat(churnDifference) < 0
                    ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-400/10'
                    : 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-400/10'
                }`}
              >
                {parseFloat(churnDifference) < 0 ? (
                  <TrendingDown size={12} className="mr-1" />
                ) : (
                  <TrendingUp size={12} className="mr-1" />
                )}
                {Math.abs(parseFloat(churnDifference))}%
              </span>
            </div>
            <p className="text-3xl font-bold">{currentMonth.churn_rate}%</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Monthly rate</p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
            variants={fadeInUp}
          >
            <div className="flex justify-between mb-3">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                RETENTION RATE
              </h3>
              <span
                className={`text-xs px-2 py-1 rounded-full flex items-center ${
                  parseFloat(retentionDifference) > 0
                    ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-400/10'
                    : 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-400/10'
                }`}
              >
                {parseFloat(retentionDifference) > 0 ? (
                  <TrendingUp size={12} className="mr-1" />
                ) : (
                  <TrendingDown size={12} className="mr-1" />
                )}
                {Math.abs(parseFloat(retentionDifference))}%
              </span>
            </div>
            <p className="text-3xl font-bold">{currentRetentionRate}%</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Monthly rate</p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
            variants={fadeInUp}
          >
            <div className="flex justify-between mb-3">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">TOTAL COUNT</h3>
              <Users size={14} className="text-gray-500" />
            </div>
            <p className="text-3xl font-bold">
              {currentMonth.retained_partners + currentMonth.churned_partners}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Active accounts</p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
            variants={fadeInUp}
          >
            <div className="flex justify-between mb-3">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                AVG. LIFETIME
              </h3>
              <Activity size={14} className="text-gray-500" />
            </div>
            <p className="text-3xl font-bold">{avgLifetime}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Months</p>
          </motion.div>
        </motion.div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Churn Line Chart */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            {isLoading ? (
              <div className="h-[400px] flex items-center justify-center bg-white dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700/50">
                <RefreshCcw size={24} className="text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
            ) : (
              <ChurnLineChart />
            )}
          </motion.div>

          {/* Retention Heatmap */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            {isLoading ? (
              <div className="h-[400px] flex items-center justify-center bg-white dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700/50">
                <RefreshCcw size={24} className="text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
            ) : (
              <RetentionHeatmap />
            )}
          </motion.div>
        </div>

        {/* Secondary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Churn by Channel Group */}
          <motion.div
            className="bg-white dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-sm"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold mb-4">Retention by Group</h3>

            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <RefreshCcw size={24} className="text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
            ) : (
              <div className="overflow-auto max-h-[400px]">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Group
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Retention Rate
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Avg. Tenure (Months)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-transparent divide-y divide-gray-200 dark:divide-gray-800">
                    {partnerGroupRetention.slice(0, 10).map((group, idx) => (
                      <tr
                        key={idx}
                        className={
                          idx % 2 === 0
                            ? 'bg-gray-50 dark:bg-gray-800/30'
                            : 'bg-white dark:bg-transparent'
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {group.partner_group}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <div className="flex items-center">
                            <span className="mr-2">{group.retention_rate}%</span>
                            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                              <div
                                className="bg-green-500 h-2.5 rounded-full"
                                style={{ width: `${group.retention_rate}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {group.avg_partner_tenure_months} months
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          {/* Cohort Retention Analysis */}
          <motion.div
            className="bg-white dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-sm"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-xl font-semibold mb-4">Cohort Retention Analysis</h3>

            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <RefreshCcw size={24} className="text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
            ) : (
              <div className="overflow-auto max-h-[400px]">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Cohort Year
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        30-Day
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        90-Day
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        180-Day
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        1-Year
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-transparent divide-y divide-gray-200 dark:divide-gray-800">
                    {retentionCohortData.map((cohort, idx) => (
                      <tr
                        key={idx}
                        className={
                          idx % 2 === 0
                            ? 'bg-gray-50 dark:bg-gray-800/30'
                            : 'bg-white dark:bg-transparent'
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {cohort.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {cohort.thirtyDay}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {cohort.ninetyDay}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {cohort.oneEightyDay}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {cohort.oneYear}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>

        {/* Insights and Recommendations */}
        <motion.div
          className="bg-white dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 mb-8 shadow-sm"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xl font-semibold mb-4">Key Insights & Recommendations</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                Analysis Highlights
              </h4>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 mr-2 text-xs">
                    1
                  </span>
                  <span>
                    Enterprise groups show the highest retention rate at{' '}
                    {partnerGroupRetention[0].retention_rate}%, with an average tenure of{' '}
                    {partnerGroupRetention[0].avg_partner_tenure_months} months.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 mr-2 text-xs">
                    2
                  </span>
                  <span>
                    Overall yearly retention rates have improved from{' '}
                    {retentionCohortData[0].oneYear}% in 2020 to{' '}
                    {retentionCohortData[retentionCohortData.length - 1].oneYear}% in 2024.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 mr-2 text-xs">
                    3
                  </span>
                  <span>
                    Seasonal patterns show slightly higher churn rates in February (
                    {monthlyChurnData[1].churn_rate}%) and November (
                    {monthlyChurnData[10].churn_rate}%).
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                Recommended Actions
              </h4>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 mr-2 text-xs">
                    1
                  </span>
                  <span>
                    Implement targeted engagement programs for Affiliate and Referral groups to
                    improve their retention rates.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 mr-2 text-xs">
                    2
                  </span>
                  <span>
                    Develop enhanced onboarding processes to improve early-stage retention metrics,
                    particularly for the 90-day mark.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 mr-2 text-xs">
                    3
                  </span>
                  <span>
                    Create proactive outreach campaigns before seasonal churn periods (January and
                    October) to mitigate potential losses.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
          <Link
            href="/projects"
            className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white px-5 py-2 rounded-lg transition-colors flex items-center justify-center sm:justify-start border border-gray-200 dark:border-gray-700"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Projects
          </Link>

          <div className="flex flex-col sm:flex-row gap-3">
            <button className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white px-5 py-2 rounded-lg transition-colors flex items-center justify-center border border-gray-200 dark:border-gray-700">
              <Filter size={16} className="mr-2" />
              <span>Filter Data</span>
            </button>

            <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg transition-colors flex items-center justify-center">
              <Download size={16} className="mr-2" />
              <span>Export Report</span>
              <ChevronDown size={16} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
