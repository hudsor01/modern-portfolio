'use client'

import { useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import Link from 'next/link';
import { ArrowLeft, RefreshCcw, Calendar, Download, Filter, ChevronDown, Users, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

// Enhanced data
const churnData = [
  { month: 'Jan', churn: 12, retained: 88, newCustomers: 45, totalCustomers: 620 },
  { month: 'Feb', churn: 10, retained: 90, newCustomers: 48, totalCustomers: 658 },
  { month: 'Mar', churn: 8, retained: 92, newCustomers: 52, totalCustomers: 702 },
  { month: 'Apr', churn: 9, retained: 91, newCustomers: 50, totalCustomers: 743 },
  { month: 'May', churn: 7, retained: 93, newCustomers: 56, totalCustomers: 792 },
  { month: 'Jun', churn: 6, retained: 94, newCustomers: 59, totalCustomers: 845 },
];

const segmentChurn = [
  { segment: 'Enterprise', churnRate: 4, customerCount: 125 },
  { segment: 'Mid-Market', churnRate: 7, customerCount: 280 },
  { segment: 'SMB', churnRate: 12, customerCount: 440 },
];

const churnReasons = [
  { name: 'Pricing', value: 35 },
  { name: 'Features', value: 25 },
  { name: 'Competition', value: 18 },
  { name: 'Customer Service', value: 12 },
  { name: 'Other', value: 10 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

const lifetimeData = [
  { months: '0-3', value: 25 },
  { months: '4-6', value: 20 },
  { months: '7-12', value: 15 },
  { months: '13-24', value: 10 },
  { months: '25+', value: 5 },
];

export default function ChurnAnalysis() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTimeframe, setActiveTimeframe] = useState('6M');
  const [selectedSegment, setSelectedSegment] = useState('All');
  const [highlightedReason, setHighlightedReason] = useState(null);
  
  // Current churn and retention rates
  const currentMonth = churnData[churnData.length - 1];
  const previousMonth = churnData[churnData.length - 2];
  const churnDifference = currentMonth.churn - previousMonth.churn;
  
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

  // Calculate average churn and retention
  const avgChurn = churnData.reduce((sum, item) => sum + item.churn, 0) / churnData.length;
  const avgRetention = churnData.reduce((sum, item) => sum + item.retained, 0) / churnData.length;

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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Churn & Retention Analysis</h1>
          <p className="text-gray-400">Customer retention metrics and churn prevention insights</p>
        </motion.div>
        
        {/* KPI Cards */}
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
              <h3 className="text-gray-400 text-sm font-medium">CURRENT CHURN RATE</h3>
              <span className={`text-xs px-2 py-1 rounded-full flex items-center ${
                churnDifference < 0 
                  ? 'text-green-400 bg-green-400/10' 
                  : 'text-red-400 bg-red-400/10'
              }`}>
                {churnDifference < 0 
                  ? <TrendingDown size={12} className="mr-1" /> 
                  : <TrendingUp size={12} className="mr-1" />
                }
                {Math.abs(churnDifference)}%
              </span>
            </div>
            <p className="text-3xl font-bold">{currentMonth.churn}%</p>
            <p className="text-gray-400 text-sm mt-1">Monthly rate</p>
          </motion.div>
          
          <motion.div 
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
            variants={fadeInUp}
          >
            <div className="flex justify-between mb-3">
              <h3 className="text-gray-400 text-sm font-medium">RETENTION RATE</h3>
              <span className={`text-xs px-2 py-1 rounded-full flex items-center ${
                -churnDifference > 0 
                  ? 'text-green-400 bg-green-400/10' 
                  : 'text-red-400 bg-red-400/10'
              }`}>
                {-churnDifference > 0 
                  ? <TrendingUp size={12} className="mr-1" /> 
                  : <TrendingDown size={12} className="mr-1" />
                }
                {Math.abs(churnDifference)}%
              </span>
            </div>
            <p className="text-3xl font-bold">{currentMonth.retained}%</p>
            <p className="text-gray-400 text-sm mt-1">Monthly rate</p>
          </motion.div>
          
          <motion.div 
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
            variants={fadeInUp}
          >
            <div className="flex justify-between mb-3">
              <h3 className="text-gray-400 text-sm font-medium">CUSTOMER COUNT</h3>
              <Users size={14} className="text-gray-500" />
            </div>
            <p className="text-3xl font-bold">{currentMonth.totalCustomers}</p>
            <p className="text-gray-400 text-sm mt-1">Active customers</p>
          </motion.div>
          
          <motion.div 
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
            variants={fadeInUp}
          >
            <div className="flex justify-between mb-3">
              <h3 className="text-gray-400 text-sm font-medium">AVG. CUSTOMER LIFETIME</h3>
              <Activity size={14} className="text-gray-500" />
            </div>
            <p className="text-3xl font-bold">15.2</p>
            <p className="text-gray-400 text-sm mt-1">Months</p>
          </motion.div>
        </motion.div>
        
        {/* Main Chart */}
        <motion.div 
          className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-8"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold">Churn & Retention Trends</h3>
              <p className="text-gray-400 text-sm mt-1">Monthly rates over time</p>
            </div>
            
            <div className="flex space-x-4 items-center">
              <div className="flex items-center text-sm text-gray-400">
                <Calendar size={14} className="mr-1" />
                <span>Last {activeTimeframe}</span>
              </div>
              
              <select 
                className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1 text-white text-sm"
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
              >
                <option value="All">All Segments</option>
                <option value="Enterprise">Enterprise</option>
                <option value="Mid-Market">Mid-Market</option>
                <option value="SMB">SMB</option>
              </select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <RefreshCcw size={24} className="text-blue-400 animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={churnData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorChurn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRetained" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="month" tick={{ fill: '#9ca3af' }} />
                <YAxis tick={{ fill: '#9ca3af' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563', borderRadius: '6px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => [`${value}%`, '']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  name="Churn Rate" 
                  dataKey="churn" 
                  stroke="#ef4444" 
                  fillOpacity={1} 
                  fill="url(#colorChurn)" 
                />
                <Area 
                  type="monotone" 
                  name="Retention Rate" 
                  dataKey="retained" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorRetained)" 
                />
                <Area 
                  type="monotone" 
                  name="New Customers" 
                  dataKey="newCustomers" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorNew)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>
        
        {/* Secondary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Churn by Segment Chart */}
          <motion.div 
            className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-4">Churn by Customer Segment</h3>
            
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <RefreshCcw size={24} className="text-blue-400 animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={segmentChurn} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#9ca3af' }} />
                  <YAxis dataKey="segment" type="category" tick={{ fill: '#9ca3af' }} width={100} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563', borderRadius: '6px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value, name) => {
                      if (name === "churnRate") return [`${value}%`, 'Churn Rate'];
                      return [value, 'Customer Count'];
                    }}
                  />
                  <Legend />
                  <Bar 
                    name="Churn Rate" 
                    dataKey="churnRate" 
                    fill="#ef4444" 
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar 
                    name="Customer Count" 
                    dataKey="customerCount" 
                    fill="#3b82f6" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>
          
          {/* Churn Reasons Chart */}
          <motion.div 
            className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold mb-4">Primary Churn Reasons</h3>
            
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <RefreshCcw size={24} className="text-blue-400 animate-spin" />
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row items-center">
                <div className="w-full lg:w-2/3">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={churnReasons}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        onMouseEnter={(data) => setHighlightedReason(data.name)}
                        onMouseLeave={() => setHighlightedReason(null)}
                      >
                        {churnReasons.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                            opacity={highlightedReason && highlightedReason !== entry.name ? 0.5 : 1}
                            stroke={highlightedReason === entry.name ? '#fff' : 'none'}
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
                
                <div className="w-full lg:w-1/3 space-y-3 mt-4 lg:mt-0">
                  {churnReasons.map((reason, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg transition-colors cursor-pointer ${
                        highlightedReason === reason.name
                          ? 'bg-gray-700/60'
                          : 'bg-gray-800/30 hover:bg-gray-700/40'
                      }`}
                      onMouseEnter={() => setHighlightedReason(reason.name)}
                      onMouseLeave={() => setHighlightedReason(null)}
                    >
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="font-medium">{reason.name}</span>
                      </div>
                      <p className="text-gray-300 text-sm mt-1">{reason.value}% of churned customers</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
        
        {/* Customer Lifetime Chart */}
        <motion.div 
          className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-8"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-semibold mb-6">Customer Lifetime Distribution</h3>
          
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <RefreshCcw size={24} className="text-blue-400 animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={lifetimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="months" tick={{ fill: '#9ca3af' }} />
                <YAxis tick={{ fill: '#9ca3af' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563', borderRadius: '6px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => [`${value}%`, 'Percentage of Customers']}
                />
                <Bar 
                  name="Customer Percentage" 
                  dataKey="value" 
                  fill="#8b5cf6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
          
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800/30 rounded-lg p-4">
              <h4 className="text-lg font-medium mb-2">Customer Lifetime Value</h4>
              <p className="text-2xl font-bold">$1,250</p>
              <p className="text-gray-400 text-sm mt-1">Avg value per customer</p>
            </div>
            
            <div className="bg-gray-800/30 rounded-lg p-4">
              <h4 className="text-lg font-medium mb-2">Avg. Months to Churn</h4>
              <p className="text-2xl font-bold">7.3</p>
              <p className="text-gray-400 text-sm mt-1">For churned customers</p>
            </div>
            
            <div className="bg-gray-800/30 rounded-lg p-4">
              <h4 className="text-lg font-medium mb-2">1-Year Retention</h4>
              <p className="text-2xl font-bold">68%</p>
              <p className="text-gray-400 text-sm mt-1">Of new customers</p>
            </div>
            
            <div className="bg-gray-800/30 rounded-lg p-4">
              <h4 className="text-lg font-medium mb-2">Churn Cost</h4>
              <p className="text-2xl font-bold">$475K</p>
              <p className="text-gray-400 text-sm mt-1">Annual lost revenue</p>
            </div>
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
              <span>Filter Data</span>
            </button>
            
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg transition-colors flex items-center">
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
