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

// CLV trend data with confidence intervals and forecasting
export const clvTrendData = [
  { month: 'Jan 23', actual: 2450, predicted: 2420, confidence_high: 2580, confidence_low: 2260, customers: 3890 },
  { month: 'Feb 23', actual: 2520, predicted: 2510, confidence_high: 2650, confidence_low: 2370, customers: 3945 },
  { month: 'Mar 23', actual: 2610, predicted: 2580, confidence_high: 2720, confidence_low: 2440, customers: 4012 },
  { month: 'Apr 23', actual: 2680, predicted: 2670, confidence_high: 2810, confidence_low: 2530, customers: 4089 },
  { month: 'May 23', actual: 2720, predicted: 2700, confidence_high: 2840, confidence_low: 2560, customers: 4156 },
  { month: 'Jun 23', actual: 2780, predicted: 2760, confidence_high: 2900, confidence_low: 2620, customers: 4223 },
  { month: 'Jul 23', actual: 2820, predicted: 2810, confidence_high: 2950, confidence_low: 2670, customers: 4287 },
  { month: 'Aug 23', actual: 2847, predicted: 2840, confidence_high: 2980, confidence_low: 2700, customers: 4287 },
  // Future predictions (no actual data)
  { month: 'Sep 23', actual: null, predicted: 2890, confidence_high: 3030, confidence_low: 2750, customers: 4350 },
  { month: 'Oct 23', actual: null, predicted: 2920, confidence_high: 3080, confidence_low: 2760, customers: 4420 },
  { month: 'Nov 23', actual: null, predicted: 2980, confidence_high: 3140, confidence_low: 2820, customers: 4485 },
  { month: 'Dec 23', actual: null, predicted: 3020, confidence_high: 3200, confidence_low: 2840, customers: 4550 },
]

// CLV prediction vs actual data showing model accuracy
export const clvPredictionData = [
  { predicted: 2100, actual: 2150, segment: 'Champions', accuracy: 97.7 },
  { predicted: 2300, actual: 2280, segment: 'Champions', accuracy: 99.1 },
  { predicted: 1800, actual: 1750, segment: 'Loyal', accuracy: 97.2 },
  { predicted: 1950, actual: 1980, segment: 'Loyal', accuracy: 98.5 },
  { predicted: 1400, actual: 1450, segment: 'Potential', accuracy: 96.6 },
  { predicted: 1600, actual: 1580, segment: 'Potential', accuracy: 98.8 },
  { predicted: 1200, actual: 1180, segment: 'At Risk', accuracy: 98.3 },
  { predicted: 1350, actual: 1320, segment: 'At Risk', accuracy: 97.8 },
  { predicted: 2800, actual: 2750, segment: "Can't Lose", accuracy: 98.2 },
  { predicted: 3100, actual: 3180, segment: "Can't Lose", accuracy: 97.5 },
  { predicted: 2500, actual: 2520, segment: 'Champions', accuracy: 99.2 },
  { predicted: 1700, actual: 1680, segment: 'Loyal', accuracy: 98.8 },
  { predicted: 1500, actual: 1520, segment: 'Potential', accuracy: 98.7 },
  { predicted: 1100, actual: 1090, segment: 'At Risk', accuracy: 99.1 },
  { predicted: 2900, actual: 2980, segment: "Can't Lose", accuracy: 97.3 },
  { predicted: 2200, actual: 2180, segment: 'Champions', accuracy: 99.1 },
  { predicted: 1850, actual: 1870, segment: 'Loyal', accuracy: 98.9 },
  { predicted: 1300, actual: 1280, segment: 'Potential', accuracy: 98.5 },
  { predicted: 1150, actual: 1140, segment: 'At Risk', accuracy: 99.1 },
  { predicted: 3200, actual: 3150, segment: "Can't Lose", accuracy: 98.4 },
]

// Customer segment chart data with revenue
export const customerSegmentChartData = [
  { segment: 'Champions', count: 628, clv: 4850, probability: 92, revenue: 3045800, color: 'var(--color-success)' },
  { segment: 'Loyal', count: 841, clv: 3420, probability: 87, revenue: 2876220, color: 'var(--color-primary)' },
  { segment: 'Potential', count: 1156, clv: 2640, probability: 74, revenue: 3051840, color: 'var(--color-secondary)' },
  { segment: 'At Risk', count: 892, clv: 1890, probability: 45, revenue: 1686480, color: 'var(--color-warning)' },
  { segment: "Can't Lose", count: 770, clv: 3850, probability: 68, revenue: 2964500, color: 'var(--color-destructive)' },
]
