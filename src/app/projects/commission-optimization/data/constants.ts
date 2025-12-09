// Commission management static data and metrics

export const starData = {
  situation: { phase: 'Situation', impact: 25, efficiency: 20, value: 15 },
  task: { phase: 'Task', impact: 50, efficiency: 45, value: 40 },
  action: { phase: 'Action', impact: 80, efficiency: 85, value: 75 },
  result: { phase: 'Result', impact: 98, efficiency: 95, value: 94 },
}

export const commissionMetrics = {
  totalCommissionPool: 254000,
  averageCommissionRate: 23.0,
  performanceImprovement: 34.2,
  automationEfficiency: 87.5,
  partnerCount: 47,
  totalPayouts: 218450,
  pendingPayouts: 35550,
  averagePartnerEarnings: 5403
}

export const commissionTiers = [
  {
    tier: 'Elite Partners',
    count: 8,
    commissionRate: 28.0,
    totalEarnings: 89600,
    avgEarnings: 11200,
    requirements: '$50K+ quarterly sales',
    performanceBonus: 15.0,
    roi: 4.2
  },
  {
    tier: 'Premium Partners',
    count: 12,
    commissionRate: 25.0,
    totalEarnings: 67800,
    avgEarnings: 5650,
    requirements: '$25K+ quarterly sales',
    performanceBonus: 10.0,
    roi: 3.8
  },
  {
    tier: 'Standard Partners',
    count: 19,
    commissionRate: 20.0,
    totalEarnings: 45600,
    avgEarnings: 2400,
    requirements: '$10K+ quarterly sales',
    performanceBonus: 5.0,
    roi: 3.2
  },
  {
    tier: 'Growth Partners',
    count: 8,
    commissionRate: 15.0,
    totalEarnings: 15450,
    avgEarnings: 1931,
    requirements: 'New partner onboarding',
    performanceBonus: 0,
    roi: 2.1
  }
]

export const incentivePrograms = [
  {
    program: 'Quarterly Sales Accelerator',
    participants: 34,
    budget: 45000,
    payout: 38750,
    effectiveness: 86.1,
    avgBonus: 1140,
    performanceLift: 28.4
  },
  {
    program: 'New Customer Acquisition Bonus',
    participants: 28,
    budget: 35000,
    payout: 31200,
    effectiveness: 89.1,
    avgBonus: 1114,
    performanceLift: 42.3
  },
  {
    program: 'Product Mix Incentive',
    participants: 41,
    budget: 28000,
    payout: 24680,
    effectiveness: 88.1,
    avgBonus: 602,
    performanceLift: 19.7
  },
  {
    program: 'Territory Expansion Rewards',
    participants: 15,
    budget: 22000,
    payout: 18900,
    effectiveness: 85.9,
    avgBonus: 1260,
    performanceLift: 35.6
  }
]

export const commissionCalculationMetrics = [
  { metric: 'Processing Time', value: '2.3 hours', improvement: '-73%', status: 'excellent' },
  { metric: 'Calculation Accuracy', value: '99.8%', improvement: '+12%', status: 'excellent' },
  { metric: 'Dispute Rate', value: '1.2%', improvement: '-68%', status: 'excellent' },
  { metric: 'Partner Satisfaction', value: '94.7%', improvement: '+19%', status: 'excellent' },
]

export const technologies = [
  'React 19', 'TypeScript', 'Recharts', 'Automated Calculations',
  'Commission Engine', 'ROI Analytics', 'Performance Tracking', 'Dispute Resolution',
  'Real-time Processing', 'Data Validation', 'Audit Trails', 'Business Intelligence'
]
