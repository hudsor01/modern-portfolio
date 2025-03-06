'use client'

import { useEffect, useState } from 'react'
import { 
  LineChart, Line, BarChart, Bar, CartesianGrid, XAxis, YAxis, 
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, Info, RefreshCcw, Calendar, Tag, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

// More comprehensive dataset
const revenueData = [
  { month: 'Jan', revenue: 42000, sales: 120, target: 40000, leads: 230, conversion: 52 },
  { month: 'Feb', revenue: 38000, sales: 105, target: 42000, leads: 200, conversion: 48 },
  { month: 'Mar', revenue: 51000, sales: 145, target: 45000, leads: 250, conversion: 58 },
  { month: 'Apr', revenue: 47000, sales: 132, target: 47000, leads: 240, conversion: 55 },
  { month: 'May', revenue: 58000, sales: 156, target: 50000, leads: 280, conversion: 56 },
  { month: 'Jun', revenue: 63000, sales: 168, target: 55000, leads: 310, conversion: 54 }
];

const productRevenue = [
  { name: 'Product A', value: 45 },
  { name: 'Product B', value: 30 },
  { name: 'Product C', value: 15 },
  { name: 'Product D', value: 10 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function RevenueKPI() {
  const [activeTimeframe, setActiveTimeframe] = useState('6M');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(null);
  
  // Calculate KPIs
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const avgMonthlyRevenue = totalRevenue / revenueData.length;
  const lastMonth = revenueData[revenueData.length - 1];
  const prevMonth = revenueData[revenueData.length - 2];
  const revenueGrowth = ((lastMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100;
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Revenue KPI Dashboard</h1>
          <p className="text-gray-400">Comprehensive view of revenue metrics and performance indicators</p>
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
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-gray-400 text-sm font-medium">TOTAL REVENUE</h3>
              <span className="text-green-400 text-xs px-2 py-1 bg-green-400/10 rounded-full flex items-center">
                <TrendingUp size={12} className="mr-1" />
                +{revenueGrowth.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-baseline">
              <p className="text-3xl font-bold">${(totalRevenue/1000).toFixed(1)}k</p>
              <p className="text-gray-400 ml-2 text-sm">This period</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
            variants={fadeInUp}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-gray-400 text-sm font-medium">AVG MONTHLY REVENUE</h3>
              <Info size={14} className="text-gray-500" />
            </div>
            <div className="flex items-baseline">
              <p className="text-3xl font-bold">${(avgMonthlyRevenue/1000).toFixed(1)}k</p>
              <p className="text-gray-400 ml-2 text-sm">Per month</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
            variants={fadeInUp}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-gray-400 text-sm font-medium">SALES COUNT</h3>
              <span className="text-blue-400 text-xs px-2 py-1 bg-blue-400/10 rounded-full flex items-center">
                <TrendingUp size={12} className="mr-1" />
                +{((lastMonth.sales - prevMonth.sales) / prevMonth.sales * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-baseline">
              <p className="text-3xl font-bold">{revenueData.reduce((sum, item) => sum + item.sales, 0)}</p>
              <p className="text-gray-400 ml-2 text-sm">Transactions</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
            variants={fadeInUp}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-gray-400 text-sm font-medium">CONVERSION RATE</h3>
              <span className={`text-xs px-2 py-1 rounded-full flex items-center ${
                lastMonth.conversion > prevMonth.conversion 
                  ? 'text-green-400 bg-green-400/10' 
                  : 'text-red-400 bg-red-400/10'
              }`}>
                {lastMonth.conversion > prevMonth.conversion 
                  ? <TrendingUp size={12} className="mr-1" />
                  : <TrendingDown size={12} className="mr-1" />
                }
                {Math.abs(lastMonth.conversion - prevMonth.conversion).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-baseline">
              <p className="text-3xl font-bold">{lastMonth.conversion}%</p>
              <p className="text-gray-400 ml-2 text-sm">Last month</p>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Charts section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <motion.div 
            className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Revenue Trends</h3>
              <div className="flex items-center text-sm text-gray-400">
                <Calendar size={14} className="mr-1" />
                <span>Last {revenueData.length} months</span>
              </div>
            </div>
            
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <RefreshCcw size={24} className="text-blue-400 animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="month" tick={{ fill: '#9ca3af' }} />
                  <YAxis tick={{ fill: '#9ca3af' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563', borderRadius: '6px' }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                    formatter={(value) => [`$${value.toLocaleString()}`, '']}
                  />
                  <Legend />
                  <Area type="monotone" name="Revenue" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" name="Target" dataKey="target" stroke="#22c55e" fillOpacity={1} fill="url(#colorTarget)" strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </motion.div>
          
          {/* Sales Performance */}
          <motion.div 
            className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Sales Performance</h3>
              <div className="flex items-center text-sm text-gray-400">
                <Tag size={14} className="mr-1" />
                <span>Monthly breakdown</span>
              </div>
            </div>
            
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <RefreshCcw size={24} className="text-blue-400 animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="month" tick={{ fill: '#9ca3af' }} />
                  <YAxis tick={{ fill: '#9ca3af' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563', borderRadius: '6px' }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Legend />
                  <Bar 
                    name="Sales Count" 
                    dataKey="sales" 
                    fill="#10b981" 
                    radius={[4, 4, 0, 0]}
                    onMouseOver={(data) => setSelectedMonth(data.month)}
                    onMouseLeave={() => setSelectedMonth(null)}
                  />
                  <Bar 
                    name="Leads" 
                    dataKey="leads" 
                    fill="#6366f1" 
                    radius={[4, 4, 0, 0]}
                    opacity={0.7}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </div>
        
        {/* Secondary charts section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Revenue Breakdown */}
          <motion.div 
            className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-4">Product Revenue Breakdown</h3>
            
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <RefreshCcw size={24} className="text-blue-400 animate-spin" />
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={productRevenue}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {productRevenue.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563', borderRadius: '6px' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value) => [`${value}%`, 'Revenue Share']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="mt-4 md:mt-0">
                  {productRevenue.map((entry, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-sm">{entry.name}: {entry.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Conversion Rates */}
          <motion.div 
            className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold mb-4">Lead Conversion Trends</h3>
            
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <RefreshCcw size={24} className="text-blue-400 animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="month" tick={{ fill: '#9ca3af' }} />
                  <YAxis tick={{ fill: '#9ca3af' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563', borderRadius: '6px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value) => [`${value}%`, 'Conversion Rate']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    name="Conversion Rate" 
                    dataKey="conversion" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </div>
        
        {/* Action buttons */}
        <div className="mt-8 flex justify-between">
          <Link 
            href="/projects" 
            className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-lg transition-colors flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Projects
          </Link>
          
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg transition-colors flex items-center">
            <span>Download Report</span>
            <ChevronDown size={16} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
