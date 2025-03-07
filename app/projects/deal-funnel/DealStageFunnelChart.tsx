'use client'
import { FunnelChart, Funnel, Tooltip, LabelList, ResponsiveContainer } from 'recharts'
import { funnelStages } from '@/lib/data/partner-analytics'

// Transform data for visualization
const data = funnelStages.map(stage => ({
  stage: stage.stage,
  count: stage.count,
  conversionRate: `${stage.conversion_rate}%`
}))

const COLORS = ['#4F46E5', '#4338CA', '#3730A3', '#312E81', '#1E1B4B']

export default function DealStageFunnelChart() {
	return (
		<div className='w-full max-w-3xl rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg mx-auto'>
			<h2 className='mb-4 text-xl font-semibold text-slate-800 dark:text-white'>Partner Deal Funnel</h2>
			<ResponsiveContainer width='100%' height={400}>
				<FunnelChart>
					<Tooltip 
            formatter={(value, name, props) => {
              if (name === 'count') return [`${value.toLocaleString()}`, 'Count']
              return [props.payload.conversionRate, 'Conversion Rate']
            }}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}
          />
					<Funnel 
            data={data} 
            dataKey='count' 
            nameKey='stage' 
            fill='#4F46E5'
            isAnimationActive={true}
            animationDuration={1500}
          >
            {
              data.map((entry, index) => (
                <LabelList
                  key={`label-${index}`}
                  position="right"
                  fill="#fff"
                  stroke="none"
                  dataKey="stage"
                  style={{ fontSize: '14px', fontWeight: 500 }}
                />
              ))
            }
            {
              data.map((entry, index) => (
                <LabelList
                  key={`label-count-${index}`}
                  position="center"
                  fill="#fff"
                  stroke="none"
                  dataKey="count"
                  formatter={(value) => value.toLocaleString()}
                  style={{ fontSize: '14px', fontWeight: 600 }}
                />
              ))
            }
            {
              data.map((entry, index) => (
                <cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))
            }
					</Funnel>
				</FunnelChart>
			</ResponsiveContainer>
      <div className="mt-6 grid grid-cols-5 gap-2 text-center">
        {data.map((stage, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className="w-4 h-4 rounded-sm mb-1" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{stage.stage}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{stage.conversionRate}</p>
          </div>
        ))}
      </div>
		</div>
	)
}
