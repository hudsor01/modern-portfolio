'use client'

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import Link from 'next/link';
import { ArrowLeft, RefreshCcw, Calendar, Download, Filter, ChevronDown, ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import LeadSourcePieChart from './LeadSourcePieChart';

// Import real data
import { 
  leadSources, 
  channelPerformance, 
  monthlyAttribution 
} from '@/lib/data/partner-analytics';

export default function LeadAttribution() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTimeframe, setActiveTimeframe] = useState('6M');
  const [selectedSource, setSelectedSource] = useState(null);
  
  // Total leads calculation
  const totalLeads = leadSources.reduce((sum, item) => sum + item.count, 0);
  
  // Calculate total revenue
  const totalRevenue = channelPerformance.reduce((sum, item) => sum + item.revenue, 0);
  
  // Calculate average conversion rate
  const avgConversionRate = parseFloat(
    (channelPerformance.reduce((sum, item) => sum + item.conversion_rate, 0) / 
    channelPerformance.length).toFixed(1)
  );
  
  // Calculate average cost per acquisition
  const totalConversions = channelPerformance.reduce((sum, item) => sum + item.conversions, 0);
  const totalSpend = 500000; // Assuming campaign spend
  const avgCostPerLead = Math.round(totalSpend / totalLeads);
  
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

  // Format numbers for display
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Transform monthly data for visualization
  type MonthlyData = typeof monthlyAttribution[0] & Record<string, any>;
  
  const monthlyTrendData = Object.keys(monthlyAttribution[0])
    .filter(key => key !== 'month')
    .map(sourceKey => {
      // Convert from snake_case to readable format
      const displayName = sourceKey
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
        
      // Get latest month percentage
      const latestData = monthlyAttribution[monthlyAttribution.length - 1] as MonthlyData;
      const previousData = monthlyAttribution[monthlyAttribution.length - 2] as MonthlyData;
      
      const latestValue = latestData[sourceKey] as number;
      const previousValue = previousData[sourceKey] as number;
      
      const changeVal = ((latestValue - previousValue) / previousValue) * 100;
      const change = changeVal.toFixed(1);
      
      return {
        source: displayName,
        percentage: latestValue,
        change: parseFloat(change),
        trend: parseFloat(change) >= 0 ? 'up' : 'down',
      };
    });

  // Prepare data for the monthly attribution line chart
  const monthlyLineData = monthlyAttribution.slice(-6).map(item => ({
    month: item.month,
    'Channel Referral': item.partner_referral,
    'Website': item.website,
    'Direct Outreach': item.direct_outreach,
    'Events': item.events,
    'Content Marketing': item.content_marketing,
    'Social Media': item.social_media,
  }));

  // Channel performance colors
  const channelColors: Record<string, string> = {
    'Channel Referral': '#4F46E5',
    'Website': '#10B981',
    'Direct Outreach': '#F59E0B',
    'Events': '#EF4444',
    'Content Marketing': '#8B5CF6',
    'Social Media': '#EC4899'
  };

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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Lead Source Attribution</h1>
          <p className="text-gray-600 dark:text-gray-400">Analyzing lead source effectiveness and channel performance</p>
        </motion.div>
        
        {/* Key Metrics Cards */}
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
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">TOTAL LEADS</h3>
              <span className="text-green-600 dark:text-green-400 text-xs px-2 py-1 bg-green-100 dark:bg-green-400/10 rounded-full flex items-center">
                <TrendingUp size={12} className="mr-1" />
                +12%
              </span>
            </div>
            <p className="text-3xl font-bold">{totalLeads.toLocaleString()}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Current period</p>
          </motion.div>
          
          <motion.div 
            className="bg-white dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
            variants={fadeInUp}
          >
            <div className="flex justify-between mb-3">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">COST PER LEAD</h3>
              <span className="text-red-600 dark:text-red-400 text-xs px-2 py-1 bg-red-100 dark:bg-red-400/10 rounded-full flex items-center">
                <TrendingDown size={12} className="mr-1" />
                -5%
              </span>
            </div>
            <p className="text-3xl font-bold">${avgCostPerLead}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Average cost</p>
          </motion.div>
          
          <motion.div 
            className="bg-white dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
            variants={fadeInUp}
          >
            <div className="flex justify-between mb-3">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">CONVERSION RATE</h3>
              <span className="text-green-600 dark:text-green-400 text-xs px-2 py-1 bg-green-100 dark:bg-green-400/10 rounded-full flex items-center">
                <TrendingUp size={12} className="mr-1" />
                +2.5%
              </span>
            </div>
            <p className="text-3xl font-bold">{avgConversionRate}%</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Lead to customer</p>
          </motion.div>
          
          <motion.div 
            className="bg-white dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
            variants={fadeInUp}
          >
            <div className="flex justify-between mb-3">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">ATTRIBUTED REVENUE</h3>
              <ArrowUpRight size={14} className="text-green-500" />
            </div>
            <p className="text-3xl font-bold">${formatNumber(totalRevenue)}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">From all sources</p>
          </motion.div>
        </motion.div>
        
        {/* Main Lead Source Pie Chart */}
        <motion.div 
          className="bg-white dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 mb-8 shadow-sm"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Lead Source Distribution</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Percentage breakdown by channel</p>
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
            <LeadSourcePieChart />
          )}
        </motion.div>
        
        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Attribution Trends Chart */}
          <motion.div 
            className="bg-white dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-sm"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Monthly Attribution Trends</h3>
            
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <RefreshCcw size={24} className="text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart 
                  data={monthlyLineData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" strokeOpacity={0.3} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#64748b' }}
                  />
                  <YAxis 
                    tick={{ fill: '#64748b' }}
                    domain={[0, 30]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`${value}%`, '']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  {Object.keys(channelColors).map((channel) => (
                    <Line
                      key={channel}
                      type="monotone"
                      dataKey={channel}
                      stroke={channelColors[channel]}
                      strokeWidth={2}
                      dot={{ r: 3, strokeWidth: 1 }}
                      activeDot={{ r: 5, strokeWidth: 1 }}
                      animationDuration={1500}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </motion.div>
          
          {/* Channel Performance Metrics */}
          <motion.div 
            className="bg-white dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-sm"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Channel Performance Metrics</h3>
            
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
                        Channel
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Conversion
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        ROI
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-transparent divide-y divide-gray-200 dark:divide-gray-800">
                    {channelPerformance.map((channel, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/30' : 'bg-white dark:bg-transparent'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {channel.channel === "Partner Referral" ? "Channel Referral" : channel.channel}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <div className="flex items-center">
                            <span className="mr-2">{channel.conversion_rate}%</span>
                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                              <div 
                                className="bg-blue-500 h-2.5 rounded-full" 
                                style={{ width: `${(channel.conversion_rate/20) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          ${channel.revenue.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {channel.roi}%
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
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Attribution Insights & Recommendations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Key Findings</h4>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 mr-2 text-xs">1</span>
                  <span>Channel Referrals generate {leadSources[0].percentage}% of leads, making it the most effective channel.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 mr-2 text-xs">2</span>
                  <span>Events show a high conversion rate of {channelPerformance[3].conversion_rate}% despite lower lead volume.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 mr-2 text-xs">3</span>
                  <span>Direct Outreach yields the highest average deal value at ${leadSources[2].avg_deal_value.toLocaleString()}.</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Recommended Actions</h4>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 mr-2 text-xs">1</span>
                  <span>Expand the referral program with incentives to leverage its {channelPerformance[0].roi}% ROI.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 mr-2 text-xs">2</span>
                  <span>Increase investment in targeted direct outreach campaigns to high-value prospects.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 mr-2 text-xs">3</span>
                  <span>Optimize content marketing strategy to improve its conversion rate from {channelPerformance[4].conversion_rate}%.</span>
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
              <span>Filter Sources</span>
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
