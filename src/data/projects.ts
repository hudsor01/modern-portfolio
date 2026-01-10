import React from 'react'
import { DollarSign, Clock, Target, TrendingUp, Zap, Award, Calculator, Users, Activity, BarChart3 } from 'lucide-react'

// Showcase project interface for portfolio display
export interface ShowcaseProject {
  id: string
  slug: string
  title: string
  description: string
  longDescription: string
  image: string
  category: string
  technologies: string[]
  displayMetrics: Array<{
    label: string
    value: string
    icon: React.ComponentType<{ size?: number; className?: string }>
  }>
  metrics?: Record<string, string>
  featured: boolean
  year: number
  client: string
  duration: string
  impact: string[]
  results: Array<{
    metric: string
    before: string
    after: string
    improvement: string
  }>
  caseStudyUrl: string
}

// Showcase projects for portfolio display
export const showcaseProjects: ShowcaseProject[] = [
  {
    id: 'revenue-kpi',
    slug: 'revenue-kpi',
    title: 'Revenue Operations Dashboard',
    description: 'Real-time revenue tracking and forecasting platform with advanced analytics',
    longDescription:
      'A comprehensive revenue operations dashboard that provides real-time insights into sales performance, pipeline health, and revenue forecasting.',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&crop=center&q=85',
    category: 'revenue-ops',
    technologies: ['React', 'TypeScript', 'D3.js', 'PostgreSQL', 'Salesforce API'],
    displayMetrics: [
      { label: 'Revenue Increase', value: '$3.7M', icon: DollarSign },
      { label: 'Time Saved', value: '40%', icon: Clock },
      { label: 'Accuracy Improved', value: '95%', icon: Target },
    ],
    featured: true,
    year: 2024,
    client: 'TechCorp Inc.',
    duration: '6 months',
    impact: [
      'Increased revenue visibility by 300%',
      'Reduced manual reporting time by 40%',
      'Improved forecast accuracy to 95%',
    ],
    results: [
      {
        metric: 'Monthly Revenue Visibility',
        before: '2 weeks delay',
        after: 'Real-time',
        improvement: '100%',
      },
      {
        metric: 'Report Generation Time',
        before: '8 hours',
        after: '5 minutes',
        improvement: '96%',
      },
      { metric: 'Forecast Accuracy', before: '65%', after: '95%', improvement: '46%' },
    ],
    caseStudyUrl: '/projects/revenue-kpi',
  },
  {
    id: 'churn-retention',
    slug: 'churn-retention',
    title: 'Customer Churn Prediction Model',
    description: 'Machine learning model to predict and prevent customer churn',
    longDescription:
      'Advanced analytics platform using machine learning to identify at-risk customers and recommend retention strategies.',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop&crop=center&q=85',
    category: 'data-analytics',
    technologies: ['Python', 'Scikit-learn', 'React', 'PostgreSQL', 'Docker'],
    displayMetrics: [
      { label: 'Churn Reduced', value: '25%', icon: TrendingUp },
      { label: 'Model Accuracy', value: '92%', icon: Target },
      { label: 'Revenue Saved', value: '$800K', icon: DollarSign },
    ],
    featured: true,
    year: 2023,
    client: 'SaaS Growth Co.',
    duration: '4 months',
    impact: [
      'Reduced customer churn by 25%',
      'Increased customer lifetime value',
      'Improved retention strategies',
    ],
    results: [
      { metric: 'Customer Churn Rate', before: '8.5%', after: '6.4%', improvement: '25%' },
      { metric: 'Prediction Accuracy', before: 'N/A', after: '92%', improvement: '100%' },
      { metric: 'Retention Campaign ROI', before: '2.1x', after: '4.7x', improvement: '124%' },
    ],
    caseStudyUrl: '/projects/churn-retention',
  },
  {
    id: 'deal-funnel',
    slug: 'deal-funnel',
    title: 'Sales Funnel Optimization',
    description: 'Interactive sales funnel analysis with conversion optimization insights',
    longDescription:
      'Comprehensive sales funnel analysis platform providing deep insights into conversion rates, bottlenecks, and optimization opportunities.',
    image:
      'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=1200&h=800&fit=crop&crop=center&q=85',
    category: 'business-intelligence',
    technologies: ['Vue.js', 'Node.js', 'MongoDB', 'Chart.js', 'Stripe API'],
    displayMetrics: [
      { label: 'Conversion Rate', value: '+35%', icon: TrendingUp },
      { label: 'Sales Velocity', value: '+60%', icon: Zap },
      { label: 'Deal Size', value: '+20%', icon: Award },
    ],
    featured: false,
    year: 2023,
    client: 'Enterprise Solutions',
    duration: '3 months',
    impact: [
      'Optimized sales process efficiency',
      'Identified conversion bottlenecks',
      'Increased average deal size',
    ],
    results: [
      { metric: 'Lead-to-Customer Rate', before: '12%', after: '16.2%', improvement: '35%' },
      { metric: 'Sales Cycle Time', before: '90 days', after: '56 days', improvement: '38%' },
      { metric: 'Average Deal Size', before: '$45K', after: '$54K', improvement: '20%' },
    ],
    caseStudyUrl: '/projects/deal-funnel',
  },
  {
    id: 'lead-attribution',
    slug: 'lead-attribution',
    title: 'Marketing Attribution Platform',
    description: 'Multi-touch attribution model for marketing campaign optimization',
    longDescription:
      'Advanced marketing attribution platform that tracks customer journeys across multiple touchpoints and provides insights for campaign optimization.',
    image:
      'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=1200&h=800&fit=crop&crop=center&q=85',
    category: 'data-analytics',
    technologies: ['React', 'Python', 'BigQuery', 'Looker', 'Google Analytics API'],
    displayMetrics: [
      { label: 'Attribution Accuracy', value: '88%', icon: Target },
      { label: 'ROAS Improvement', value: '+45%', icon: TrendingUp },
      { label: 'Campaign Efficiency', value: '+30%', icon: Zap },
    ],
    featured: true,
    year: 2024,
    client: 'Digital Marketing Agency',
    duration: '5 months',
    impact: [
      'Improved marketing ROI visibility',
      'Optimized budget allocation',
      'Enhanced campaign performance',
    ],
    results: [
      { metric: 'Marketing ROAS', before: '3.2x', after: '4.6x', improvement: '44%' },
      { metric: 'Attribution Confidence', before: '65%', after: '88%', improvement: '35%' },
      {
        metric: 'Campaign Optimization Speed',
        before: '2 weeks',
        after: '2 days',
        improvement: '86%',
      },
    ],
    caseStudyUrl: '/projects/lead-attribution',
  },
  {
    id: 'cac-unit-economics',
    slug: 'cac-unit-economics',
    title: 'Customer Acquisition Cost Optimization',
    description: 'CAC analysis and LTV:CAC ratio optimization achieving 32% cost reduction',
    longDescription:
      'Comprehensive CAC analysis and LTV:CAC ratio optimization that achieved 32% cost reduction through strategic partner channel optimization. Industry-benchmark 3.6:1 efficiency ratio with 8.4-month payback period.',
    image:
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=800&fit=crop&crop=center&q=85',
    category: 'revenue-ops',
    technologies: ['React', 'TypeScript', 'SQL', 'Tableau', 'Salesforce'],
    displayMetrics: [
      { label: 'CAC Reduction', value: '32%', icon: TrendingUp },
      { label: 'LTV:CAC Ratio', value: '3.6:1', icon: Calculator },
      { label: 'Payback Period', value: '8.4mo', icon: Clock },
    ],
    featured: true,
    year: 2024,
    client: 'SaaS Enterprise',
    duration: '5 months',
    impact: [
      'Reduced customer acquisition cost by 32%',
      'Optimized LTV:CAC ratio to industry benchmark',
      'Decreased payback period to 8.4 months',
    ],
    results: [
      { metric: 'Blended CAC', before: '$18,150', after: '$12,345', improvement: '32%' },
      { metric: 'LTV:CAC Ratio', before: '2.8:1', after: '3.6:1', improvement: '29%' },
      { metric: 'Payback Period', before: '12.3 mo', after: '8.4 mo', improvement: '32%' },
    ],
    caseStudyUrl: '/projects/cac-unit-economics',
  },
  {
    id: 'commission-optimization',
    slug: 'commission-optimization',
    title: 'Commission & Incentive Optimization',
    description: 'Automated commission management delivering 34% performance improvement',
    longDescription:
      'Advanced commission management and partner incentive optimization platform managing $254K+ commission structures with 87.5% automation efficiency.',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop&crop=center&q=85',
    category: 'revenue-ops',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Python', 'REST APIs'],
    displayMetrics: [
      { label: 'Commission Pool', value: '$254K', icon: DollarSign },
      { label: 'Performance', value: '+34%', icon: TrendingUp },
      { label: 'Automation', value: '87.5%', icon: Zap },
    ],
    featured: false,
    year: 2024,
    client: 'Tech Partnership Co.',
    duration: '4 months',
    impact: [
      'Managed $254K+ annual commission structures',
      'Improved partner performance by 34%',
      'Achieved 87.5% automation efficiency',
    ],
    results: [
      { metric: 'Commission Rate', before: '18%', after: '23%', improvement: '28%' },
      { metric: 'Partner Performance', before: 'Baseline', after: '+34%', improvement: '34%' },
      { metric: 'Processing Time', before: '8 hours', after: '1 hour', improvement: '87.5%' },
    ],
    caseStudyUrl: '/projects/commission-optimization',
  },
  {
    id: 'customer-lifetime-value',
    slug: 'customer-lifetime-value',
    title: 'Customer Lifetime Value Analytics',
    description: 'Predictive CLV analytics with 94.3% ML accuracy across customer segments',
    longDescription:
      'Advanced CLV analytics platform leveraging BTYD predictive modeling framework. Achieving 94.3% prediction accuracy through machine learning algorithms and real-time customer behavior tracking.',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&crop=center&q=85',
    category: 'data-analytics',
    technologies: ['Python', 'Machine Learning', 'React', 'PostgreSQL', 'BTYD Framework'],
    displayMetrics: [
      { label: 'ML Accuracy', value: '94.3%', icon: Target },
      { label: 'Average CLV', value: '$142K', icon: DollarSign },
      { label: 'Segments', value: '5', icon: BarChart3 },
    ],
    featured: true,
    year: 2024,
    client: 'Enterprise SaaS',
    duration: '6 months',
    impact: [
      'Achieved 94.3% prediction accuracy with ML models',
      'Identified $142K average customer lifetime value',
      'Segmented customers into 5 distinct value tiers',
    ],
    results: [
      { metric: 'Prediction Accuracy', before: '72%', after: '94.3%', improvement: '31%' },
      { metric: 'Customer Segmentation', before: 'Basic', after: '5 tiers', improvement: '100%' },
      { metric: 'Forecast Horizon', before: '12 mo', after: '24 mo', improvement: '100%' },
    ],
    caseStudyUrl: '/projects/customer-lifetime-value',
  },
  {
    id: 'forecast-pipeline-intelligence',
    slug: 'forecast-pipeline-intelligence',
    title: 'Forecast & Pipeline Intelligence',
    description: 'Predictive forecasting improving accuracy by 31% and reducing slippage 26%',
    longDescription:
      'Enterprise forecasting and pipeline intelligence platform combining predictive analytics, deal health monitoring, and early warning systems.',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&crop=center&q=85',
    category: 'revenue-ops',
    technologies: ['React', 'TypeScript', 'Python', 'Salesforce API', 'ML Models'],
    displayMetrics: [
      { label: 'Accuracy Gain', value: '+31%', icon: Target },
      { label: 'Slippage Reduced', value: '-26%', icon: TrendingUp },
      { label: 'Deals Tracked', value: '4,200+', icon: Activity },
    ],
    featured: true,
    year: 2024,
    client: 'Enterprise Sales Org',
    duration: '5 months',
    impact: [
      'Improved forecast accuracy by 31%',
      'Reduced deal slippage by 26%',
      'Monitored 4,200+ active deals',
    ],
    results: [
      { metric: 'Forecast Accuracy', before: '74%', after: '97%', improvement: '31%' },
      { metric: 'Deal Slippage', before: '35%', after: '26%', improvement: '26%' },
      { metric: 'Early Warning Detection', before: '52%', after: '89%', improvement: '71%' },
    ],
    caseStudyUrl: '/projects/forecast-pipeline-intelligence',
  },
  {
    id: 'multi-channel-attribution',
    slug: 'multi-channel-attribution',
    title: 'Multi-Channel Attribution Analytics',
    description: 'ML-powered attribution across 12+ channels with $2.3M ROI optimization',
    longDescription:
      'Advanced marketing attribution analytics platform using machine learning models to track customer journeys across 12+ touchpoints. Delivering 92.4% attribution accuracy.',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop&crop=center&q=85',
    category: 'data-analytics',
    technologies: ['React', 'Python', 'Machine Learning', 'BigQuery', 'Google Analytics'],
    displayMetrics: [
      { label: 'Accuracy', value: '92.4%', icon: Target },
      { label: 'ROI Impact', value: '$2.3M', icon: DollarSign },
      { label: 'Channels', value: '12', icon: BarChart3 },
    ],
    featured: true,
    year: 2024,
    client: 'Marketing Agency',
    duration: '6 months',
    impact: [
      'Achieved 92.4% attribution accuracy',
      'Optimized $2.3M in marketing ROI',
      'Tracked 12+ marketing channels',
    ],
    results: [
      { metric: 'Conversions', before: '14,400', after: '18,450', improvement: '28%' },
      { metric: 'Attribution Accuracy', before: '67%', after: '92.4%', improvement: '38%' },
      { metric: 'ROI Optimization', before: 'Baseline', after: '$2.3M', improvement: '100%' },
    ],
    caseStudyUrl: '/projects/multi-channel-attribution',
  },
  {
    id: 'partner-performance',
    slug: 'partner-performance',
    title: 'Partner Performance Intelligence',
    description: 'Channel analytics with 83.2% win rate and 4.7x quick ratio',
    longDescription:
      'Strategic channel analytics and partner ROI intelligence demonstrating 83.2% win rate across multi-tier partner ecosystem with real-time performance tracking.',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&crop=center&q=85',
    category: 'revenue-ops',
    technologies: ['React', 'TypeScript', 'PostgreSQL', 'Recharts', 'Analytics APIs'],
    displayMetrics: [
      { label: 'Win Rate', value: '83.2%', icon: Award },
      { label: 'Partner Revenue', value: '$904K', icon: DollarSign },
      { label: 'Quick Ratio', value: '4.7x', icon: TrendingUp },
    ],
    featured: true,
    year: 2024,
    client: 'Channel Partner Program',
    duration: '4 months',
    impact: [
      'Achieved 83.2% partner win rate',
      'Generated $904K partner revenue',
      'Maintained 4.7x SaaS quick ratio',
    ],
    results: [
      { metric: 'Partner Win Rate', before: '68%', after: '83.2%', improvement: '22%' },
      { metric: 'Active Partners', before: '28', after: '34', improvement: '21%' },
      { metric: 'Revenue Contribution', before: '71%', after: '83.2%', improvement: '17%' },
    ],
    caseStudyUrl: '/projects/partner-performance',
  },
  {
    id: 'partnership-program-implementation',
    slug: 'partnership-program-implementation',
    title: 'Partnership Program Implementation',
    description: 'Built first partnership program from scratch with 90%+ automation',
    longDescription:
      'Led comprehensive design and implementation of company\'s first partnership program, creating automated partner onboarding, commission tracking, and performance analytics.',
    image:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&h=800&fit=crop&crop=center&q=85',
    category: 'revenue-ops',
    technologies: ['Salesforce', 'DocuSign API', 'React', 'TypeScript', 'REST APIs'],
    displayMetrics: [
      { label: 'Automation', value: '90%+', icon: Zap },
      { label: 'Program Launch', value: '6 mo', icon: Clock },
      { label: 'Integrations', value: 'Full Stack', icon: Activity },
    ],
    featured: false,
    year: 2023,
    client: 'Tech Startup',
    duration: '6 months',
    impact: [
      'Launched company\'s first partnership program',
      'Achieved 90%+ process automation',
      'Built production-ready integrations',
    ],
    results: [
      { metric: 'Partner Onboarding', before: 'Manual', after: 'Automated', improvement: '90%' },
      { metric: 'Program Launch Time', before: 'N/A', after: '6 months', improvement: '100%' },
      { metric: 'System Integration', before: 'None', after: 'Full Stack', improvement: '100%' },
    ],
    caseStudyUrl: '/projects/partnership-program-implementation',
  },
  {
    id: 'quota-territory-management',
    slug: 'quota-territory-management',
    title: 'Quota & Territory Management',
    description: 'Intelligent quota optimization increasing forecast accuracy by 28%',
    longDescription:
      'Advanced quota setting and territory assignment system using predictive analytics and fairness algorithms. Optimized territory design increased forecast accuracy by 28%.',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&crop=center&q=85',
    category: 'revenue-ops',
    technologies: ['Python', 'React', 'PostgreSQL', 'Optimization Algorithms', 'Salesforce'],
    displayMetrics: [
      { label: 'Accuracy Gain', value: '+28%', icon: Target },
      { label: 'Variance Reduction', value: '-32%', icon: TrendingUp },
      { label: 'Territories', value: '47', icon: BarChart3 },
    ],
    featured: false,
    year: 2024,
    client: 'Enterprise Sales',
    duration: '4 months',
    impact: [
      'Increased forecast accuracy by 28%',
      'Reduced quota variance by 32%',
      'Optimized 47 sales territories',
    ],
    results: [
      { metric: 'Forecast Accuracy', before: '76%', after: '97%', improvement: '28%' },
      { metric: 'Quota Attainment Variance', before: '47%', after: '32%', improvement: '32%' },
      { metric: 'Territory Balance', before: 'Uneven', after: 'Optimized', improvement: '100%' },
    ],
    caseStudyUrl: '/projects/quota-territory-management',
  },
  {
    id: 'revenue-operations-center',
    slug: 'revenue-operations-center',
    title: 'Revenue Operations Center',
    description: 'Unified RevOps dashboard with 96.8% forecast accuracy',
    longDescription:
      'Comprehensive revenue operations dashboard consolidating pipeline health, forecasting accuracy, partner performance, and operational KPIs with real-time insights.',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&crop=center&q=85',
    category: 'revenue-ops',
    technologies: ['React', 'TypeScript', 'PostgreSQL', 'Recharts', 'Multiple APIs'],
    displayMetrics: [
      { label: 'Forecast Accuracy', value: '96.8%', icon: Target },
      { label: 'Pipeline Health', value: '92.4%', icon: Activity },
      { label: 'Revenue Growth', value: '+34.2%', icon: TrendingUp },
    ],
    featured: true,
    year: 2024,
    client: 'Enterprise Revenue Team',
    duration: '6 months',
    impact: [
      'Achieved 96.8% forecast accuracy',
      'Maintained 92.4% pipeline health',
      'Delivered 34.2% revenue growth YoY',
    ],
    results: [
      { metric: 'Forecast Accuracy', before: '78%', after: '96.8%', improvement: '24%' },
      { metric: 'Operational Efficiency', before: '72%', after: '89.7%', improvement: '25%' },
      { metric: 'Revenue Growth YoY', before: '18%', after: '34.2%', improvement: '90%' },
    ],
    caseStudyUrl: '/projects/revenue-operations-center',
  },
  {
    id: 'sales-enablement',
    slug: 'sales-enablement',
    title: 'Sales Enablement Platform',
    description: 'Training and coaching platform increasing win rates by 34%',
    longDescription:
      'Transformed sales team performance through structured training, real-time coaching, and continuous skill development. Increased win rates by 34% and reduced ramp time by 45%.',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop&crop=center&q=85',
    category: 'revenue-ops',
    technologies: ['React', 'Node.js', 'MongoDB', 'Video Platform', 'LMS Integration'],
    displayMetrics: [
      { label: 'Win Rate', value: '+34%', icon: Award },
      { label: 'Ramp Time', value: '-45%', icon: Clock },
      { label: 'Team Size', value: '125', icon: Users },
    ],
    featured: false,
    year: 2023,
    client: 'Sales Organization',
    duration: '5 months',
    impact: [
      'Increased win rates by 34%',
      'Reduced ramp time by 45%',
      'Trained 125+ sales professionals',
    ],
    results: [
      { metric: 'Win Rate', before: '52%', after: '70%', improvement: '34%' },
      { metric: 'Ramp Time', before: '180 days', after: '99 days', improvement: '45%' },
      { metric: 'Content Created', before: '50', after: '450+', improvement: '800%' },
    ],
    caseStudyUrl: '/projects/sales-enablement',
  },
]
