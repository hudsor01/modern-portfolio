import { Globe, Mail, Share2, Users, DollarSign } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const starData = {
  situation: { phase: 'Situation', impact: 25, efficiency: 21, value: 17 },
  task: { phase: 'Task', impact: 51, efficiency: 46, value: 42 },
  action: { phase: 'Action', impact: 79, efficiency: 84, value: 76 },
  result: { phase: 'Result', impact: 96, efficiency: 94, value: 92 },
}

export interface LeadConversionSource {
  source: string
  conversions: number
  conversion_rate: number
  icon: LucideIcon
}

export const leadConversionData: LeadConversionSource[] = [
  { source: 'Website', conversions: 142, conversion_rate: 0.125, icon: Globe },
  { source: 'Referral', conversions: 89, conversion_rate: 0.168, icon: Share2 },
  { source: 'Social', conversions: 67, conversion_rate: 0.094, icon: Users },
  { source: 'Email', conversions: 55, conversion_rate: 0.183, icon: Mail },
  { source: 'Paid Ads', conversions: 73, conversion_rate: 0.087, icon: DollarSign },
]

export const monthlyTrendData = [
  { month: 'Jan', leads: 890, conversions: 98 },
  { month: 'Feb', leads: 945, conversions: 112 },
  { month: 'Mar', leads: 1120, conversions: 145 },
  { month: 'Apr', leads: 1050, conversions: 132 },
  { month: 'May', leads: 1180, conversions: 158 },
  { month: 'Jun', leads: 1065, conversions: 140 },
  { month: 'Jul', leads: 980, conversions: 125 },
  { month: 'Aug', leads: 1095, conversions: 148 },
  { month: 'Sep', leads: 1205, conversions: 167 },
  { month: 'Oct', leads: 1150, conversions: 156 },
  { month: 'Nov', leads: 1280, conversions: 183 },
  { month: 'Dec', leads: 1340, conversions: 201 },
]

export const technologies = [
  'React 19', 'TypeScript', 'Attribution Modeling', 'Customer Journey Mapping',
  'Cross-Device Tracking', 'Conversion Analysis', 'Marketing Analytics', 'ROI Optimization',
  'Multi-Touch Attribution', 'Data Visualization', 'Campaign Performance', 'Lead Scoring'
]
