'use client'

import { m as motion } from 'framer-motion'

// Define proper types for the data
interface FunnelStage {
  name: string;
  count: number;
  avg_deal_size: number;
}

interface ChartData {
  stage: string;
  count: number;
  conversionRate: string;
}


interface DealStageFunnelChartProps {
  stages: FunnelStage[];
}

export default function DealStageFunnelChart({ stages }: DealStageFunnelChartProps) {

  // Calculate conversion rates between stages
  const calculateData = (): ChartData[] => {
    if (!stages || stages.length === 0) return [];

    return stages.map((stage, index) => {
      let conversionRate = '100%';

      // Calculate conversion rate from previous stage
      const prevStage = stages[index - 1];
      const prevCount = prevStage?.count ?? 0;
      if (index > 0 && prevCount > 0) {
        const rate = (stage.count / prevCount) * 100;
        conversionRate = `${rate.toFixed(1)}%`;
      }

      return {
        stage: stage.name,
        count: stage.count,
        conversionRate
      };
    });
  };

  // Transform data for visualization
  const data: ChartData[] = calculateData();

  // Gradient colors for funnel stages
  const funnelColors = [
    'var(--color-primary)', // Blue
    'var(--color-secondary)', // Indigo
    'var(--color-secondary)', // Purple
    'var(--color-chart-5)', // Purple
    'var(--color-chart-5)', // Light Purple
  ];


  return (
    <div className="w-full">
      {data.length > 0 ? (
        <>
          {/* True Funnel Shape */}
          <div className="relative w-full max-w-3xl mx-auto">
            <svg
              width="100%"
              height="450"
              viewBox="0 0 400 450"
              className="overflow-visible"
            >
              <defs>
                {funnelColors.map((color, index) => (
                  <linearGradient key={index} id={`funnelGradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                  </linearGradient>
                ))}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/> 
                  </feMerge>
                </filter>
              </defs>
              
              {data.map((stage, index) => {
                // Calculate trapezoid dimensions for proper funnel shape
                const topWidth = 350 - (index * 60); // Starts wide, gets narrower
                const bottomWidth = 350 - ((index + 1) * 60);
                const height = 70;
                const yPosition = index * 75 + 20;
                const topXOffset = (400 - topWidth) / 2;
                const bottomXOffset = (400 - bottomWidth) / 2;
                
                return (
                  <motion.g
                    key={stage.stage}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                  >
                    {/* Funnel segment (trapezoid) */}
                    <path
                      d={`M ${topXOffset} ${yPosition} 
                          L ${topXOffset + topWidth} ${yPosition} 
                          L ${bottomXOffset + bottomWidth} ${yPosition + height} 
                          L ${bottomXOffset} ${yPosition + height} Z`}
                      fill={`url(#funnelGradient-${index})`}
                      stroke={funnelColors[index]}
                      strokeWidth="2"
                      filter="url(#glow)"
                      className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                    />
                    
                    {/* Stage label on the left */}
                    <text
                      x={topXOffset - 10}
                      y={yPosition + height / 2}
                      textAnchor="end"
                      dominantBaseline="middle"
                      className="fill-white text-sm font-medium"
                    >
                      {stage.stage}
                    </text>
                    
                    {/* Count in center */}
                    <text
                      x={200}
                      y={yPosition + height / 2 - 8}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-white text-xl font-bold"
                    >
                      {stage.count.toLocaleString()}
                    </text>
                    
                    {/* "deals" text below count */}
                    <text
                      x={200}
                      y={yPosition + height / 2 + 8}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-white text-xs opacity-80"
                    >
                      deals
                    </text>
                    
                    {/* Conversion rate on the right */}
                    <text
                      x={topXOffset + topWidth + 10}
                      y={yPosition + height / 2}
                      textAnchor="start"
                      dominantBaseline="middle"
                      className="fill-white text-sm font-semibold"
                      fill={funnelColors[index]}
                    >
                      {stage.conversionRate}
                    </text>
                  </motion.g>
                );
              })}
            </svg>
          </div>
          
          {/* Stage cards below funnel */}
          <div className="mt-8 grid grid-cols-5 gap-4">
            {data.map((stage, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="glass rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: funnelColors[index % funnelColors.length] }}
                  />
                  <p className="text-xs font-medium text-white">{stage.stage}</p>
                </div>
                <p className="text-xl font-bold text-white">{stage.conversionRate}</p>
                <p className="text-sm text-muted-foreground">{stage.count.toLocaleString()} deals</p>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <div className="h-40 flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      )}
    </div>
  )
}
