export const starData = {
  situation: { phase: 'Situation', impact: 26, efficiency: 21, value: 16 },
  task: { phase: 'Task', impact: 51, efficiency: 46, value: 41 },
  action: { phase: 'Action', impact: 80, efficiency: 84, value: 76 },
  result: { phase: 'Result', impact: 96, efficiency: 94, value: 92 },
}

export const cacMetrics = {
  partnerDrivenCAC: 127,
  directCAC: 289,
  blendedCAC: 168,
  averageLTV: 612,
  paybackPeriod: 8.4,
  ltv_cac_ratio: 3.6,
  grossMargin: 78.5,
  monthlyChurn: 4.2
}

export const channelPerformance = [
  { channel: 'Certified Partners', cac: 98, ltv: 687, customers: 1089, efficiency: 7.0 },
  { channel: 'Legacy Partners', cac: 156, ltv: 578, customers: 743, efficiency: 3.7 },
  { channel: 'Direct Sales', cac: 289, ltv: 534, customers: 201, efficiency: 1.8 },
  { channel: 'Inactive Partners', cac: 234, ltv: 445, customers: 67, efficiency: 1.9 },
]

export const productTierEconomics = [
  { tier: 'Enterprise Pro ($349)', cac: 156, ltv: 892, margin: 83.2, payback: 6.2 },
  { tier: 'Business Plus ($199)', cac: 134, ltv: 567, margin: 78.9, payback: 7.8 },
  { tier: 'Starter Web ($99)', cac: 89, ltv: 287, margin: 71.4, payback: 9.1 },
  { tier: 'Support ($9)', cac: 12, ltv: 43, margin: 65.8, payback: 2.1 },
]

export const technologies = [
  'React 19', 'TypeScript', 'Unit Economics', 'CAC Analysis',
  'LTV Modeling', 'Cohort Analysis', 'Financial Modeling', 'Contribution Margin Analysis',
  'Payback Period Tracking', 'Channel Optimization', 'Profitability Analysis', 'Business Intelligence'
]

// Unit economics progression over time (LTV, CAC, ratio trends)
export const unitEconomicsTrendData = [
  { month: 'Jan', ltv: 534, cac: 189, ratio: 2.8, payback: 11.2 },
  { month: 'Feb', ltv: 548, cac: 178, ratio: 3.1, payback: 10.8 },
  { month: 'Mar', ltv: 567, cac: 172, ratio: 3.3, payback: 10.1 },
  { month: 'Apr', ltv: 582, cac: 168, ratio: 3.5, payback: 9.4 },
  { month: 'May', ltv: 595, cac: 165, ratio: 3.6, payback: 8.9 },
  { month: 'Jun', ltv: 612, cac: 161, ratio: 3.8, payback: 8.4 },
  { month: 'Jul', ltv: 618, cac: 158, ratio: 3.9, payback: 8.1 },
  { month: 'Aug', ltv: 625, cac: 156, ratio: 4.0, payback: 7.8 },
]

// Payback period by customer cohort and acquisition channel
export const paybackPeriodData = [
  { cohort: 'Jan 2024', certifiedPartners: 6.2, legacyPartners: 8.9, directSales: 14.2 },
  { cohort: 'Feb 2024', certifiedPartners: 6.1, legacyPartners: 8.7, directSales: 13.8 },
  { cohort: 'Mar 2024', certifiedPartners: 5.9, legacyPartners: 8.4, directSales: 13.1 },
  { cohort: 'Apr 2024', certifiedPartners: 5.8, legacyPartners: 8.2, directSales: 12.7 },
  { cohort: 'May 2024', certifiedPartners: 5.6, legacyPartners: 8.0, directSales: 12.3 },
  { cohort: 'Jun 2024', certifiedPartners: 5.4, legacyPartners: 7.8, directSales: 11.9 },
]
