// Revenue operations center static data and metrics
import { Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

export const starData = {
  situation: { phase: 'Situation', impact: 30, efficiency: 25, value: 20 },
  task: { phase: 'Task', impact: 55, efficiency: 50, value: 45 },
  action: { phase: 'Action', impact: 85, efficiency: 88, value: 80 },
  result: { phase: 'Result', impact: 99, efficiency: 97, value: 95 },
}

export const revenueMetrics = {
  totalRevenue: 12847600,
  revenueGrowth: 34.2,
  forecastAccuracy: 96.8,
  pipelineHealth: 92.4,
  operationalEfficiency: 89.7,
  activeDeals: 247,
  avgDealSize: 52000,
  salesCycleLength: 73,
  winRate: 83.2,
  quarterlyTarget: 13500000,
  targetAttainment: 95.2
}

export const kpiAlerts = [
  { type: 'success', icon: CheckCircle, message: 'Q4 forecast accuracy exceeds 95% target', severity: 'low' },
  { type: 'warning', icon: AlertTriangle, message: 'Pipeline velocity down 8% from last quarter', severity: 'medium' },
  { type: 'info', icon: Activity, message: 'Deal stage progression improved 12% this month', severity: 'low' },
  { type: 'warning', icon: Clock, message: 'Average sales cycle extended by 6 days', severity: 'medium' },
]

export const departmentMetrics = [
  {
    department: 'Sales',
    metrics: [
      { name: 'Revenue', value: '$8.2M', change: '+28%', positive: true },
      { name: 'Win Rate', value: '83.2%', change: '+5.4%', positive: true },
      { name: 'Cycle Length', value: '73 days', change: '+6 days', positive: false },
      { name: 'Pipeline Value', value: '$24.8M', change: '+18%', positive: true },
    ]
  },
  {
    department: 'Partners',
    metrics: [
      { name: 'Partner Revenue', value: '$4.6M', change: '+67%', positive: true },
      { name: 'Partner Count', value: '47', change: '+12', positive: true },
      { name: 'Partner ROI', value: '4.7x', change: '+0.8x', positive: true },
      { name: 'Channel Health', value: '89%', change: '+12%', positive: true },
    ]
  },
  {
    department: 'Operations',
    metrics: [
      { name: 'Efficiency Score', value: '89.7%', change: '+7.2%', positive: true },
      { name: 'Data Quality', value: '94.3%', change: '+2.1%', positive: true },
      { name: 'Process Automation', value: '78%', change: '+15%', positive: true },
      { name: 'Cost per Lead', value: '$127', change: '-23%', positive: true },
    ]
  }
]

export const alertTypeStyles = {
  success: 'bg-success/20 text-success border-success/30',
  warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  error: 'bg-destructive/20 text-destructive border-destructive/30',
  info: 'bg-primary/20 text-primary border-primary/30',
}

export const technologies = [
  'React 19', 'TypeScript', 'Revenue Operations', 'Data Integration',
  'Predictive Analytics', 'Process Automation', 'Business Intelligence', 'Machine Learning',
  'ETL Pipelines', 'Data Governance', 'Workflow Orchestration', 'Executive Dashboards'
]
