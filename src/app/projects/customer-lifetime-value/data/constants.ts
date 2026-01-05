export const starData = {
  situation: { phase: 'Situation', impact: 28, efficiency: 22, value: 18 },
  task: { phase: 'Task', impact: 52, efficiency: 48, value: 42 },
  action: { phase: 'Action', impact: 82, efficiency: 86, value: 78 },
  result: { phase: 'Result', impact: 97, efficiency: 95, value: 93 },
}

export const clvMetrics = {
  averageCLV: 2847,
  predictionAccuracy: 94.3,
  totalCustomers: 4287,
  highValueCustomers: 1156,
  churnRisk: 12.8,
  revenueImpact: 1276000,
  forecastHorizon: 24,
  modelConfidence: 96.7
}

export const customerSegments = [
  {
    segment: 'Champions',
    count: 628,
    clv: 4850,
    probability: 0.92,
    characteristics: 'High frequency, recent purchases, high value',
    color: 'var(--color-success)'
  },
  {
    segment: 'Loyal Customers',
    count: 841,
    clv: 3420,
    probability: 0.87,
    characteristics: 'Regular buyers, consistent engagement',
    color: 'var(--color-primary)'
  },
  {
    segment: 'Potential Loyalists',
    count: 1156,
    clv: 2640,
    probability: 0.74,
    characteristics: 'Recent customers with growth potential',
    color: 'var(--color-secondary)'
  },
  {
    segment: 'At Risk',
    count: 892,
    clv: 1890,
    probability: 0.45,
    characteristics: 'Declining engagement, need intervention',
    color: 'var(--color-warning)'
  },
  {
    segment: "Can't Lose Them",
    count: 770,
    clv: 3850,
    probability: 0.68,
    characteristics: 'High value but decreased activity',
    color: 'var(--color-destructive)'
  },
]

export const predictiveMetrics = [
  { metric: 'Next Purchase Probability', value: '87.3%', trend: '+12%', color: 'text-secondary' },
  { metric: 'Expected Purchase Value', value: '$342', trend: '+8%', color: 'text-primary' },
  { metric: 'Days to Next Purchase', value: '14.2', trend: '-3%', color: 'text-accent' },
  { metric: 'Churn Probability', value: '12.8%', trend: '-15%', color: 'text-primary' },
]

export const technologies = [
  'React 19', 'TypeScript', 'Machine Learning', 'RFM Analysis',
  'Predictive Modeling', 'Cohort Analysis', 'Data Visualization', 'Statistical Analysis',
  'Customer Segmentation', 'Behavioral Analytics', 'Retention Modeling', 'Churn Prediction'
]
