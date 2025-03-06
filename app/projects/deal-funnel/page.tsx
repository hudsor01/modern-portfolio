'use client'

import { useState, useEffect } from 'react';
import { FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import Link from 'next/link';
import { ArrowLeft, RefreshCcw, Clock, Filter, Calendar, Download, ChevronDown, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// Enhanced data
const funnelData = [
  { name: 'Leads', value: 1000, percentage: 100, fillColor: '#3b82f6' },
  { name: 'Qualification', value: 600, percentage: 60, fillColor: '#8b5cf6' },
  { name: 'Meeting', value: 420, percentage: 42, fillColor: '#ec4899' },
  { name: 'Negotiation', value: 210, percentage: 21, fillColor: '#f97316' },
  { name: 'Closed Won', value: 120, percentage: 12, fillColor: '#22c55e' }
];

const conversionData = [
  { stage: 'Leads → Qualification', conversion: 60, value: 60 },
  { stage: 'Qualification → Meeting', conversion: 70, value: 70 },
  { stage: 'Meeting → Negotiation', conversion: 50, value: 50 },
  { stage: 'Negotiation → Closed Won', conversion: 57, value: 57 },
];

const timelineData = [
  { stage: 'Qualification', avgDays: 5 },
  { stage: 'Meeting', avgDays: 7 },
  { stage: 'Negotiation', avgDays: 14 },
  { stage: 'Closing', avgDays: 8 },
];

export default function DealFunnel() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTimeframe, setActiveTimeframe] = useState('3M');
  const [hoveredStage, setHoveredStage] = useState(null);
  
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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Sales Pipeline Funnel</h1>
          <p className="text-gray-400">Visualizing deal flow and conversion rates through the sales process</p>
        </motion.div>
        
        {/* Key Metrics */}
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
              <h3 className="text-gray-400 text-sm font-medium">TOTAL OPPORTUNITIES</h3>
              <Filter size={14} className="text-gray-500" />
            </div>
            <p className="text-3xl font-bold">{funnelData[0].value}</p>
            <p className="text-gray-400 text-sm mt-1">In pipeline</p>
          </motion.div>
          
          <motion.div 
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
            variants={fadeInUp}
          >
            <div className="flex justify-between mb-3">
              <h3 className="text-gray-400 text-sm font-medium">AVERAGE DEAL SIZE</h3>
              <HelpCircle size={14} className="text-gray-500" />
            </div>
            <p className="text-3xl font-bold">$24,500</p>
            <p className="text-gray-400 text-sm mt-1">Per closed deal</p>
          </motion.div>
          
          <motion.div 
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
            variants={fadeInUp}
          >
            <div className="flex justify-between mb-3">
              <h3 className="text-gray-400 text-sm font-medium">CLOSED DEALS</h3>
              <span className="text-green-400 text-xs px-2 py-1 bg-green-400/10 rounded-full">+15%</span>
            </div>
            <p className="text-3xl font-bold">{funnelData[4].value}</p>
            <p className="text-gray-400 text-sm mt-1">This period</p>
          </motion.div>
          
          <motion.div 
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
            variants={fadeInUp}
          >
            <div className="flex justify-between mb-3">
              <h3 className="text-gray-400 text-sm font-medium">TOTAL CYCLE TIME</h3>
              <Clock size={14} className="text-gray-500" />
            </div>
            <p className="text-3xl font-bold">34</p>
            <p className="text-gray-400 text-sm mt-1">Avg. days to close</p>
          </motion.div>
        </motion.div>
        
        {/* Main Funnel Chart */}
        <motion.div 
          className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-8"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold">Deal Stage Conversion Funnel</h3>
              <p className="text-gray-400 text-sm mt-1">Visualizing drop-off at each stage</p>
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <Calendar size={14} className="mr-1" />
              <span>Last {activeTimeframe}</span>
            </div>
          </div>
          
          {isLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <RefreshCcw size={24} className="text-blue-400 animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row items-start">
              <div className="lg:w-3/4">
                <ResponsiveContainer width="100%" height={400}>
                  <FunnelChart>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563', borderRadius: '6px' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value, name, props) => {
                        if (name === 'value') return [value, 'Count'];
                        return [value + '%', 'Conversion'];
                      }}
                    />
                    <Funnel
                      dataKey="value"
                      data={funnelData}
                      isAnimationActive
                      onMouseEnter={(data) => setHoveredStage(data.name)}
                      onMouseLeave={() => setHoveredStage(null)}
                    >
                      <LabelList 
                        position="right"
                        fill="#fff"
                        stroke="none"
                        dataKey="name"
                      />
                      <LabelList
                        position="right"
                        fill="#d1d5db"
                        stroke="none"
                        dataKey="value"
                        formatter={(value) => `${value} (${(value / funnelData[0].value * 100).toFixed(0)}%)`}
                        offset={40}
                      />
                      {funnelData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.fillColor} 
                          opacity={hoveredStage === entry.name ? 1 : 0.8}
                        />
                      ))}
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
              </div>
              
              <div className="lg:w-1/4 mt-6 lg:mt-0 lg:pl-8">
                <h4 className="text-lg font-medium mb-3">Stage Analysis</h4>
                <div className="space-y-3">
                  {funnelData.map((stage, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg transition-colors ${
                        hoveredStage === stage.name 
                          ? 'bg-gray-700/60' 
                          : 'bg-gray-800/30'
                      }`}
                    >
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: stage.fillColor }}
                        ></div>
                        <span className="font-medium">{stage.name}</span>
                      </div>
                      <div className="mt-1 grid grid-cols-2 gap-2 text-sm text-gray-300">
                        <div>
                          <span className="text-gray-400">Count: </span>
                          {stage.value}
                        </div>
                        <div>
                          <span className="text-gray-400">Conversion: </span>
                          {stage.percentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Conversion Rates */}
          <motion.div 
            className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-4">Stage-to-Stage Conversion</h3>
            
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <RefreshCcw size={24} className="text-blue-400 animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={conversionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#9ca3af' }} domain={[0, 100]} />
                  <YAxis dataKey="stage" type="category" tick={{ fill: '#9ca3af' }} width={140} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563', borderRadius: '6px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value) => [`${value}%`, 'Conversion Rate']}
                  />
                  <Legend />
                  <Bar name="Conversion Rate" dataKey="conversion" fill="#8884d8" radius={[0, 4, 4, 0]}>
                    {conversionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#ec4899', '#f97316'][index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>
          
          {/* Average Time in Stage */}
          <motion.div 
            className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold mb-4">Average Time in Stage</h3>
            
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <RefreshCcw size={24} className="text-blue-400 animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="stage" tick={{ fill: '#9ca3af' }} />
                  <YAxis tick={{ fill: '#9ca3af' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563', borderRadius: '6px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value) => [`${value} days`, 'Average Time']}
                  />
                  <Legend />
                  <Bar 
                    name="Average Days" 
                    dataKey="avgDays" 
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </div>
        
        {/* Footer with action buttons */}
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
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
