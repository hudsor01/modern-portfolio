'use client'

import { FunnelChart, Funnel, Cell, Tooltip, ResponsiveContainer, LabelList } from 'recharts'

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

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: ChartData;
  }>;
}

interface DealStageFunnelChartProps {
  stages: FunnelStage[];
}

// V4 Chart Colors using CSS Custom Properties
const chartColors = {
  funnel: [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ],
  text: 'hsl(var(--background))',
}

export default function DealStageFunnelChart({ stages }: DealStageFunnelChartProps) {
  // Custom tooltip component with proper typing
  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length > 0 && payload[0]?.payload) {
      const data = payload[0].payload;
      return (
        <div 
          className="p-3 rounded-md"
          style={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            boxShadow: 'var(--shadow-dark-lg)',
            color: 'hsl(var(--card-foreground))',
          }}
        >
          <p className="font-medium">{data.stage}</p>
          <p className="text-sm">
            Count: <span className="font-medium">{data.count.toLocaleString()}</span>
          </p>
          <p className="text-sm">
            Conversion: <span className="font-medium">{data.conversionRate}</span>
          </p>
        </div>
      )
    }
    return null
  }

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

  return (
    <div className="portfolio-card mx-auto w-full max-w-3xl">
      <h2 className="mb-4 text-xl font-semibold">Deal Funnel</h2>
      {data.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={400}>
            <FunnelChart>
              <Tooltip content={<CustomTooltip />} />
              <Funnel
                data={data}
                dataKey="count"
                nameKey="stage"
                fill={chartColors.funnel[0]}
                isAnimationActive={true}
                animationDuration={1500}
              >
                {data.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={chartColors.funnel[index % chartColors.funnel.length]} 
                  />
                ))}
                <LabelList
                  position="right"
                  fill={chartColors.text}
                  stroke="none"
                  dataKey="stage"
                  className="text-sm font-medium"
                />
                <LabelList
                  position="center"
                  fill={chartColors.text}
                  stroke="none"
                  dataKey="count"
                  formatter={(value: number) => value.toLocaleString()}
                  className="text-sm font-semibold"
                />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
          <div className="mt-6 grid grid-cols-5 gap-2 text-center">
            {data.map((stage, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-4 h-4 rounded-sm mb-1"
                  style={{ backgroundColor: chartColors.funnel[index % chartColors.funnel.length] }}
                ></div>
                <p className="text-xs font-medium">{stage.stage}</p>
                <p className="text-xs text-muted-foreground">{stage.conversionRate}</p>
              </div>
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
