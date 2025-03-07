'use client'

import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCcw, Clock, Filter, Calendar, Download, ChevronDown, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import DealStageFunnelChart from './DealStageFunnelChart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

// Import real data
import { 
  funnelStages, 
  partnerGroupConversion, 
  monthlyConversionRates 
} from '@/lib/data/partner-analytics';

export default function DealFunnel() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTimeframe, setActiveTimeframe] = useState('3M');
  const [hoveredStage, setHoveredStage] = useState(null);
  
  // Calculate KPI metrics from real data
  const totalOpportunities = funnelStages[0].count;
  const closedDeals = funnelStages[funnelStages.length - 1].count;
  const avgDealSize = Math.round(funnelStages[funnelStages.length - 1].avg_deal_size);
  
  // Calculate avg sales cycle from group data
  const avgSalesCycle = Math.round(
    partnerGroupConversion.reduce((sum, group) => sum + group.avg_sales_cycle_days, 0) / 
    partnerGroupConversion.length
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
      transition: { duration: 0.5 }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Prepare stage conversion data for visualization
  const stageConversions = [
    { 
      stage: "Leads → Qualified", 
      conversion: parseFloat(monthlyConversionRates[monthlyConversionRates.length - 1].lead_to_qualified.toFixed(1)),
      color: "#4F46E5"
    },
    { 
      stage: "Qualified → Proposal", 
      conversion: parseFloat(monthlyConversionRates[monthlyConversionRates.length - 1].qualified_to_proposal.toFixed(1)),
      color: "#8B5CF6" 
    },
    { 
      stage: "Proposal → Negotiation", 
      conversion: parseFloat(monthlyConversionRates[monthlyConversionRates.length - 1].proposal_to_negotiation.toFixed(1)),
      color: "#EC4899" 
    },
    { 
      stage: "Negotiation → Closed", 
      conversion: parseFloat(monthlyConversionRates[monthlyConversionRates.length - 1].negotiation_to_closed.toFixed(1)),
      color: "#F59E0B" 
    }
  ];
  
  // Top 5 groups by conversion rate
  const topGroups = [...partnerGroupConversion]
    .sort((a, b) => b.lead_to_close_rate - a.lead_to_close_rate)
    .slice(0, 5);

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
                activeTimeframe === '1M' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveTimeframe('1M')}
            >
              1M
            </button>
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

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Channel Deal Pipeline</h1>
          <p className="text-gray-600 dark:text-gray-400">Visualizing deal flow and conversion rates through the sales process</p>
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
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">TOTAL OPPORTUNITIES</h3>
              <Filter size={14} className="text-gray-500" />
            </div>
            <p className="text-3xl font-bold">{totalOpportunities.toLocaleString()}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">In pipeline</p>
          </motion.div>
          
          <motion.div 
            className="bg-white dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
            variants={fadeInUp}
          >
            <div className="flex justify-between mb-3">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">AVERAGE DEAL SIZE</h3>
              <HelpCircle size={14} className="text-gray-500" />
            </div>
            <p className="text-3xl font-bold">${avgDealSize.toLocaleString()}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Per closed deal</p>
          </motion.div>
          
          <motion.div 
            className="bg-white dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
            variants={fadeInUp}
          >
            <div className="flex justify-between mb-3">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">CLOSED DEALS</h3>
              <span className="text-green-600 dark:text-green-400 text-xs px-2 py-1 bg-green-100 dark:bg-green-400/10 rounded-full">+15%</span>
            </div>
            <p className="text-3xl font-bold">{closedDeals.toLocaleString()}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">This period</p>
          </motion.div>
          
          <motion.div 
            className="bg-white dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
            variants={fadeInUp}
          >
            <div className="flex justify-between mb-3">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">AVG. CYCLE TIME</h3>
              <Clock size={14} className="text-gray-500" />
            </div>
            <p className="text-3xl font-bold">{avgSalesCycle}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Days to close</p>
          </motion.div>
        </motion.div>
        
        {/* Main Funnel Chart */}
        <motion.div 
          className="bg-white dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 mb-8 shadow-sm"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Deal Stage Conversion Funnel</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Visualizing drop-off at each stage</p>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar size={14} className="mr-1" />
              <span>Last {activeTimeframe}</span>
            </div>
          </div>
          
          {isLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <RefreshCcw size={24} className="text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
          ) : (
            <DealStageFunnelChart />
          )}
        </motion.div>
        
        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Stage-to-Stage Conversion Rates */}
          <motion.div 
            className="bg-white dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-sm"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Stage-to-Stage Conversion</h3>
            
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <RefreshCcw size={24} className="text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart 
                  data={stageConversions} 
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" strokeOpacity={0.3} horizontal={false} />
                  <XAxis 
                    type="number" 
                    tick={{ fill: '#64748b' }} 
                    domain={[0, 100]} 
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis 
                    dataKey="stage" 
                    type="category" 
                    tick={{ fill: '#64748b' }} 
                    width={150}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Conversion Rate']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar 
                    name="Conversion Rate" 
                    dataKey="conversion" 
                    radius={[0, 4, 4, 0]}
                    animationDuration={1500}
                  >
                    {stageConversions.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>
          
          {/* Top Groups */}
          <motion.div 
            className="bg-white dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-sm"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Top Groups by Conversion</h3>
            
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <RefreshCcw size={24} className="text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
            ) : (
              <div className="overflow-auto max-h-[400px]">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Group
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Lead to Close
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Cycle (Days)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Avg Deal Size
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-transparent divide-y divide-gray-200 dark:divide-gray-800">
                    {topGroups.map((group, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/30' : 'bg-white dark:bg-transparent'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {group.partner_group}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <div className="flex items-center">
                            <span className="mr-2">{group.lead_to_close_rate}%</span>
                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                              <div 
                                className="bg-blue-500 h-2.5 rounded-full" 
                                style={{ width: `${(group.lead_to_close_rate/20) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {group.avg_sales_cycle_days} days
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          ${group.avg_deal_size.toLocaleString()}
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
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Pipeline Insights & Recommendations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Key Findings</h4>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 mr-2 text-xs">1</span>
                  <span>The highest drop-off occurs between Qualified and Proposal stages with a {(100 - stageConversions[1].conversion).toFixed(1)}% loss.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 mr-2 text-xs">2</span>
                  <span>Enterprise channels have the highest lead-to-close conversion at {topGroups[0].lead_to_close_rate}%, despite longer sales cycles.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 mr-2 text-xs">3</span>
                  <span>The overall lead-to-close rate is {(closedDeals/totalOpportunities*100).toFixed(1)}%, slightly above industry average.</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Recommended Actions</h4>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 mr-2 text-xs">1</span>
                  <span>Implement proposal-stage enablement tools to reduce the {(100 - stageConversions[1].conversion).toFixed(1)}% drop-off between qualification and proposal.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 mr-2 text-xs">2</span>
                  <span>Optimize sales cycles for Enterprise channels, which could improve overall conversion by 3-5%.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 mr-2 text-xs">3</span>
                  <span>Focus on increasing average deal size for Mid-Market channels through solution bundling to improve revenue efficiency.</span>
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
