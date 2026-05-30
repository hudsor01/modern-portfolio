// Partner Analytics Data for Portfolio Project
// This is sample data for demonstration purposes

export const leadAttributionData = [
  { source: 'Organic Search', leads: 150, conversion: 0.12 },
  { source: 'Paid Social', leads: 95, conversion: 0.08 },
  { source: 'Email Marketing', leads: 120, conversion: 0.15 },
  { source: 'Direct Traffic', leads: 80, conversion: 0.18 },
  { source: 'Referrals', leads: 65, conversion: 0.22 },
]

export const staticChurnData = [
  { month: 'Jan 2024', churnRate: 5.2, cohortSize: 100, churned: 5, retained: 95 },
  { month: 'Feb 2024', churnRate: 4.8, cohortSize: 105, churned: 5, retained: 100 },
  { month: 'Mar 2024', churnRate: 6.1, cohortSize: 98, churned: 6, retained: 92 },
  { month: 'Apr 2024', churnRate: 3.9, cohortSize: 102, churned: 4, retained: 98 },
  { month: 'May 2024', churnRate: 4.2, cohortSize: 108, churned: 5, retained: 103 },
  { month: 'Jun 2024', churnRate: 3.5, cohortSize: 110, churned: 4, retained: 106 },
]

export const partnerGroupsData = [
  { name: 'Enterprise', value: 65, color: 'var(--color-chart-1)' },
  { name: 'Mid-Market', value: 25, color: 'var(--color-chart-2)' },
  { name: 'SMB', value: 10, color: 'var(--color-chart-3)' },
]

export const monthlyRevenue2024 = [
  { month: 'Jan', revenue: 284000, target: 270000 },
  { month: 'Feb', revenue: 298000, target: 285000 },
  { month: 'Mar', revenue: 315000, target: 300000 },
  { month: 'Apr', revenue: 332000, target: 320000 },
  { month: 'May', revenue: 348000, target: 335000 },
  { month: 'Jun', revenue: 365000, target: 350000 },
]
