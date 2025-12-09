// Multi-channel attribution static data and metrics

export const starData = {
  situation: { phase: 'Situation', impact: 22, efficiency: 18, value: 12 },
  task: { phase: 'Task', impact: 48, efficiency: 42, value: 38 },
  action: { phase: 'Action', impact: 77, efficiency: 82, value: 72 },
  result: { phase: 'Result', impact: 96, efficiency: 94, value: 93 },
}

export const attributionMetrics = {
  totalConversions: 8247,
  attributionAccuracy: 92.4,
  totalROI: 2300000,
  conversionLift: 47.8,
  avgTouchpoints: 7.3,
  totalChannels: 12,
  customersAnalyzed: 45670,
  journeyLength: 28.4
}

export const attributionModels = [
  { model: 'First-Touch', accuracy: 68.2, conversions: 1456, roi: 340000 },
  { model: 'Last-Touch', accuracy: 72.4, conversions: 1823, roi: 420000 },
  { model: 'Linear', accuracy: 78.9, conversions: 2104, roi: 580000 },
  { model: 'Time-Decay', accuracy: 84.6, conversions: 2456, roi: 720000 },
  { model: 'Position-Based', accuracy: 87.3, conversions: 2698, roi: 840000 },
  { model: 'Data-Driven (ML)', accuracy: 92.4, conversions: 2847, roi: 1200000 },
]

export const channelPerformance = [
  {
    channel: 'Paid Search',
    touchpoints: 12450,
    conversions: 1847,
    cost: 285000,
    revenue: 2340000,
    roi: 8.2,
    attribution: 22.4
  },
  {
    channel: 'Social Media',
    touchpoints: 8920,
    conversions: 1234,
    cost: 180000,
    revenue: 1560000,
    roi: 8.7,
    attribution: 15.0
  },
  {
    channel: 'Email Marketing',
    touchpoints: 15670,
    conversions: 2104,
    cost: 95000,
    revenue: 2850000,
    roi: 30.0,
    attribution: 25.5
  },
  {
    channel: 'Direct Traffic',
    touchpoints: 6890,
    conversions: 987,
    cost: 0,
    revenue: 1890000,
    roi: 999,
    attribution: 12.0
  },
  {
    channel: 'Display Ads',
    touchpoints: 9540,
    conversions: 756,
    cost: 220000,
    revenue: 980000,
    roi: 4.5,
    attribution: 9.2
  },
  {
    channel: 'Organic Search',
    touchpoints: 11230,
    conversions: 1456,
    cost: 65000,
    revenue: 2200000,
    roi: 33.8,
    attribution: 17.7
  },
]

export const customerJourneyStages = [
  { stage: 'Awareness', touchpoints: 45670, channels: 8, avgTime: 0, conversionRate: 18.5 },
  { stage: 'Interest', touchpoints: 8447, channels: 6, avgTime: 3.2, conversionRate: 34.2 },
  { stage: 'Consideration', touchpoints: 2889, channels: 5, avgTime: 12.8, conversionRate: 52.7 },
  { stage: 'Intent', touchpoints: 1523, channels: 4, avgTime: 21.4, conversionRate: 68.9 },
  { stage: 'Purchase', touchpoints: 1049, channels: 3, avgTime: 28.4, conversionRate: 78.6 },
  { stage: 'Retention', touchpoints: 825, channels: 4, avgTime: 45.2, conversionRate: 89.3 },
]

export const technologies = [
  'React 19', 'TypeScript', 'Machine Learning', 'Attribution Modeling',
  'Cross-Channel Analytics', 'Predictive Modeling', 'Budget Optimization', 'Marketing Mix Modeling',
  'Customer Journey Analytics', 'Conversion Optimization', 'AI-Powered Insights', 'Performance Analytics'
]
