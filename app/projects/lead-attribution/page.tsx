'use client'

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import Link from 'next/link';
import { ArrowLeft, RefreshCcw, Calendar, Download, Filter, ChevronDown, ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

// Enhanced data
const pieData = [
  { name: 'Organic Search', value: 40, revenue: 248000, cpa: 85 },
  { name: 'Paid Advertising', value: 30, revenue: 185000, cpa: 120 },
  { name: 'Referrals', value: 20, revenue: 142000, cpa: 65 },
  { name: 'Social Media', value: 10, revenue: 76000, cpa: 95 }
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899'];

const monthlyData = [
  { month: 'Jan', organic: 150, paid: 120, referral: 80, social: 40 },
  { month: 'Feb', organic: 160, paid: 110, referral: 90, social: 45 },
  { month: 'Mar', organic: 170, paid: 130, referral: 85, social: 50 },
  { month: 'Apr', organic: 180, paid: 140, referral: 95, social: 55 },
  { month: 'May', organic: 200, paid: 150, referral: 100, social: 60 },
  { month: 'Jun', organic: 220, paid: 145, referral: 110, social: 65 },
];

const conversionData = [
  { source: 'Organic Search', conversion: 4.2, ctr: 3.1 },
  { source: 'Paid Advertising', conversion: 3.8, ctr: 4.5 },
  { source: 'Referrals', conversion: 5.6, ctr: 2.8 },
  { source: 'Social Media', conversion: 2.9, ctr: 3.9 },
];

export default function LeadAttribution() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTimeframe, setActiveTimeframe] = useState('6M');
  const [selectedSource, setSelectedSource] = useState(null);
  
  // Total leads calculation
  const totalLeads = pieData.reduce((sum, item) => sum + item.value, 0);
  
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
  const formatNumber = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-8 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/projects" 
            className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            <span>Back to Projects</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <button 
              className={`px-3 py-1 rounded-md ${activeTimeframe === '1M' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}
              onClick={() => setActiveTimeframe('1M')}
            >
              1M
            </button>
            <button 
              className={`px-3 py-1 rounded-md ${activeTimeframe === '3M' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}
              onClick={() => setActiveTimeframe('3M')}
            >
              3M
            </button>
            <button 
              className={`px-3 py-1 rounded-md ${activeTimeframe === '6M' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}
              onClick={() => setActiveTimeframe('6M')}
            >
              6M
            </button>
            <button 
              className={`px-3 py-1 rounded-md ${activeTimeframe === '1Y' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}
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
          <p className="text-gray-400">Analyzing marketing performance and lead channel effectiveness</p>
        </motion.div>
        
        {/* Key Metrics Cards */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
            variants={fadeInUp}
          >
            <div className="flex justify-between mb-3">
              <h3 className="text-gray-400 text-sm font-medium">TOTAL LEADS</h3>
              <span className="text-green-400 text-xs px-2 py-1 bg-green-400/10 rounded-full flex items-center">
                <TrendingUp size={12} className="mr-1" />
                +15%
              </span>
            </div>
            <p className="text-3xl font-bold">{formatNumber(totalLeads)}</p>
            <p className="text-gray-400 text-sm mt-1">Current period</p>
          </motion.div>
          
          <motion.div 
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
            variants={fadeInUp}
          >
            <div className="flex justify-between mb-3">
              <h3 className="text-gray-400 text-sm font-medium">COST PER LEAD</h3>
              <span className="text-red-400 text-xs px-2 py-1 bg-red-400/10 rounded-full flex items-center">
                <TrendingDown size={12} className="mr-1" />
                -8%
              </span>
            </div>
            <p className="text-3xl font-bold">$92</p>
            <p className="text-gray-400 text-sm mt-1">Average cost</p>
          </motion.div>
          
          <motion.div 
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
            variants={fadeInUp}
          >
            <div className="flex justify-between mb-3">
              <h3 className="text-gray-400 text-sm font-medium">CONVERSION RATE</h3>
              <span className="text-green-400 text-xs px-2 py-1 bg-green-400/10 rounded-full flex items-center">
                <TrendingUp size={12} className="mr-1" />
                +3.5%
              </span>
            </div>
            <p className="text-3xl font-bold">4.2%</p>
            <p className="text-gray-400 text-sm mt-1">Lead to customer</p>
          </motion.div>
          
          <motion.div 
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
            variants={fadeInUp}
          >
            <div className="flex justify-between mb-3">
              <h3 className="text-gray-400 text-sm font-medium">TOTAL REVENUE</h3>
              <ArrowUpRight size={14} className="text-green-500" />
            </div>
            <p className="text-3xl font-bold">$651k</p>
            <p className="text-gray-400 text-sm mt-1">Attributed revenue</p>
          </motion.div>
        </motion.div>
        
        {/* Main charts section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Lead Source Pie Chart */}
          <motion.div 
            className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold">Lead Source Distribution</h3>
                <p className="text-gray-400 text-sm mt-1">Percentage breakdown by channel</p>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Calendar size={14} className="mr-1" />
                <span>Last {activeTimeframe}</span>
              </div>
            </div>
            
            {isLoading ? (
              <div className="h-[350px] flex items-center justify-center">
                <RefreshCcw size={24} className="text-blue-400 animate-spin" />
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row items-center">
                <div className="w-full lg:w-2/3">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        fill="#8884d8"
                        paddingAngle={4}
                        dataKey="value"
                        onMouseEnter={(data) => setSelectedSource(data.name)}
                        onMouseLeave={() => setSelectedSource(null)}
                      >
                        {pieData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                            opacity={selectedSource && selectedSource !== entry.name ? 0.5 : 1}
                            stroke={selectedSource === entry.name ? '#fff' : 'none'}
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563', borderRadius: '6px' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value) => [`${value}%`, 'Percentage']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="w-full lg:w-1/3 mt-6 lg:mt-0 space-y-4">
                  {pieData.map((entry, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedSource === entry.name 
                          ? 'bg-gray-700/60' 
                          : 'bg-gray-800/30 hover:bg-gray-700/40'
                      }`}
                      onMouseEnter={() => setSelectedSource(entry.name)}
                      onMouseLeave={() => setSelectedSource(null)}
                    >
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="font-medium">{entry.name}</span>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-400">Share:</p>
                          <p>{entry.value}%</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Revenue:</p>
                          <p>${formatNumber(entry.revenue)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Monthly Trend Chart */}
          <motion.div 
            className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold">Monthly Lead Trends</h3>
                <p className="text-gray-400 text-sm mt-1">Channel performance over time</p>
              </div>
              <button className="text-sm text-gray-400 bg-gray-800/60 px-3 py-1 rounded-lg flex items-center">
                <Filter size={12} className="mr-1" />
                <span>Filter</span>
              </button>
            </div>
            
            {isLoading ? (
              <div className="h-[350px] flex items-center justify-center">
                <RefreshCcw size={24} className="text-blue-400 animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="month" tick={{ fill: '#9ca3af' }} />
                  <YAxis tick={{ fill: '#9ca3af' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563', borderRadius: '6px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    name="Organic Search" 
                    dataKey="organic" 
                    stroke={COLORS[0]} 
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    name="Paid Ads" 
                    dataKey="paid" 
                    stroke={COLORS[1]} 
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    name="Referrals" 
                    dataKey="referral" 
                    stroke={COLORS[2]} 
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    name="Social Media" 
                    dataKey="social" 
                    stroke={COLORS[3]} 
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </div>
        
        {/* Conversion Metrics Chart */}
        <motion.div 
          className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-8"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold">Channel Efficiency Metrics</h3>
              <p className="text-gray-400 text-sm mt-1">Conversion rates and click-through rates by source</p>
            </div>
          </div>
          
          {isLoading ? (
            <div className="h-[350px] flex items-center justify-center">
              <RefreshCcw size={24} className="text-blue-400 animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="source" tick={{ fill: '#9ca3af' }} />
                <YAxis tick={{ fill: '#9ca3af' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563', borderRadius: '6px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => [`${value}%`, '']}
                />
                <Legend />
                <Bar 
                  name="Conversion Rate (%)" 
                  dataKey="conversion" 
                  fill={COLORS[0]} 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  name="Click-Through Rate (%)" 
                  dataKey="ctr" 
                  fill={COLORS[1]} 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            {pieData.map((entry, index) => (
              <div key={index} className="bg-gray-800/30 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="font-medium text-sm">{entry.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-gray-400">Cost Per Lead:</p>
                    <p className="font-medium">${entry.cpa}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">ROI:</p>
                    <p className="font-medium">{((entry.revenue / (entry.cpa * entry.value * 10)) * 100).toFixed(1)}x</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Action buttons */}
        <div className="mt-8 flex justify-between">
          <Link 
            href="/projects" 
            className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-lg transition-colors flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Projects
          </Link>
          
          <div className="flex space-x-3">
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-lg transition-colors flex items-center">
              <Filter size={16} className="mr-2" />
              <span>Filter Sources</span>
            </button>
            
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg transition-colors flex items-center">
              <Download size={16} className="mr-2" />
              <span>Export Data</span>
              <ChevronDown size={16} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
