import type React from 'react'
import {
  DollarSign,
  Clock,
  Target,
  TrendingUp,
  Zap,
  Award,
  Calculator,
  Users,
  Activity,
  BarChart3,
} from 'lucide-react'

// Showcase project interface for portfolio display
export interface ShowcaseProject {
  id: string
  slug: string
  title: string
  description: string
  longDescription: string
  category: string
  /**
   * Shown as the tech badges on /projects cards. List only what the case-study
   * page itself uses or names (its charts are React + TypeScript + Recharts),
   * not an unverified stack: the old tags (Vue.js, MongoDB, Chart.js on a
   * Recharts page) contradicted the pages they linked to.
   */
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
    category: 'revenue-ops',
    technologies: ['React', 'TypeScript', 'Recharts'],
    displayMetrics: [
      { label: 'Revenue Increase', value: '$4.2M', icon: DollarSign },
      { label: 'Manual Reporting Cut', value: '65%', icon: Clock },
      { label: 'Forecast Accuracy', value: '94%', icon: Target },
    ],
    featured: true,
    year: 2024,
    client: 'Revenue reporting · 5 systems',
    duration: '6 months',
    impact: [
      'Generated $4.2M in additional revenue',
      'Reduced manual reporting by 65%',
      'Improved forecast accuracy from 82% to 94%',
    ],
    results: [
      { metric: 'Forecast Accuracy', before: '82%', after: '94%', improvement: '15%' },
      { metric: 'Forecast Variance', before: '18%', after: '6%', improvement: '67%' },
      {
        metric: 'Manual Reporting Time',
        before: '15+ hours/week',
        after: '10+ hours saved weekly',
        improvement: '65%',
      },
    ],
    caseStudyUrl: '/projects/revenue-kpi',
  },
  {
    id: 'churn-retention',
    slug: 'churn-retention',
    title: 'Partner Churn Prediction Model',
    description: 'Machine learning model to predict and prevent partner churn',
    longDescription:
      'Advanced analytics platform using machine learning to identify at-risk partners and recommend retention strategies.',
    category: 'data-analytics',
    technologies: ['React', 'TypeScript', 'Recharts', 'Machine Learning'],
    displayMetrics: [
      { label: 'Churn Reduced', value: '23%', icon: TrendingUp },
      { label: 'Prediction Accuracy', value: '89%', icon: Target },
      { label: 'Revenue Saved', value: '$830K', icon: DollarSign },
    ],
    featured: false,
    year: 2023,
    client: 'Partner success · retention',
    duration: '4 months',
    impact: [
      'Reduced partner churn rate from 14.2% to 10.9% quarterly',
      'Increased retention rate for high-value partners to 92%',
      'Improved partner satisfaction scores by 18% through proactive outreach',
    ],
    results: [
      {
        metric: 'Partner Churn Rate (quarterly)',
        before: '14.2%',
        after: '10.9%',
        improvement: '23%',
      },
      { metric: 'Partner Satisfaction', before: '', after: '', improvement: '18%' },
      { metric: 'Retention Team Workload', before: '', after: '', improvement: '34%' },
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
    category: 'business-intelligence',
    technologies: ['React', 'TypeScript', 'Recharts', 'Slack'],
    displayMetrics: [
      { label: 'Conversion Rate', value: '+27%', icon: TrendingUp },
      { label: 'Sales Cycle', value: '-31 days', icon: Clock },
      { label: 'Forecast Accuracy', value: '89%', icon: Target },
    ],
    featured: false,
    year: 2023,
    client: 'Sales operations · 4 segments',
    duration: '3 months',
    impact: [
      'Improved forecast accuracy from 73% to 89% through granular pipeline visibility',
      'Increased Enterprise segment conversion rate from 18% to 24%',
      'Reduced deal stagnation in middle stages by 34% through proactive intervention',
    ],
    results: [
      { metric: 'Forecast Accuracy', before: '73%', after: '89%', improvement: '22%' },
      { metric: 'Enterprise Conversion Rate', before: '18%', after: '24%', improvement: '33%' },
      { metric: 'Overall Conversion Rate', before: '', after: '', improvement: '27%' },
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
    category: 'data-analytics',
    technologies: ['React', 'TypeScript', 'Recharts'],
    displayMetrics: [
      { label: 'Marketing ROI', value: '+34%', icon: TrendingUp },
      { label: 'Budget Savings', value: '$480K', icon: DollarSign },
      { label: 'Lead-to-Customer', value: '+29%', icon: Users },
    ],
    featured: false,
    year: 2024,
    client: 'B2B marketing · 6 channels',
    duration: '5 months',
    impact: [
      'Improved marketing ROI visibility',
      'Optimized budget allocation',
      'Enhanced campaign performance',
    ],
    results: [
      { metric: 'Marketing ROI', before: '', after: '', improvement: '34%' },
      { metric: 'Lead-to-Customer Rate', before: '', after: '', improvement: '29%' },
      { metric: 'Cost per Acquisition', before: '', after: '', improvement: '28%' },
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
    category: 'revenue-ops',
    technologies: ['React', 'TypeScript', 'Recharts'],
    displayMetrics: [
      { label: 'CAC Reduction', value: '32%', icon: TrendingUp },
      { label: 'LTV:CAC Ratio', value: '3.6:1', icon: Calculator },
      { label: 'Payback Period', value: '8.4mo', icon: Clock },
    ],
    featured: false,
    year: 2024,
    client: 'Growth analytics · unit economics',
    duration: '5 months',
    impact: [
      'Reduced customer acquisition cost by 32%',
      'Optimized LTV:CAC ratio to industry benchmark',
      'Decreased payback period to 8.4 months',
    ],
    results: [
      { metric: 'Blended CAC', before: '$247', after: '$168', improvement: '32%' },
      { metric: 'Payback Period', before: '14.2 mo', after: '8.4 mo', improvement: '41%' },
      { metric: 'Contribution Margin', before: '', after: '', improvement: '28%' },
    ],
    caseStudyUrl: '/projects/cac-unit-economics',
  },
  {
    id: 'commission-optimization',
    slug: 'commission-optimization',
    title: 'Commission & Incentive Optimization',
    description: 'Automated commission management delivering 34.2% performance improvement',
    longDescription:
      'Advanced commission management and partner incentive optimization platform managing $254K+ commission structures with 87.5% automation efficiency.',
    category: 'revenue-ops',
    technologies: ['React', 'TypeScript', 'Recharts'],
    displayMetrics: [
      { label: 'Commission Pool', value: '$254K', icon: DollarSign },
      { label: 'Performance', value: '+34.2%', icon: TrendingUp },
      { label: 'Automation', value: '87.5%', icon: Zap },
    ],
    featured: false,
    year: 2024,
    client: 'Partner commission operations',
    duration: '4 months',
    impact: [
      'Managed $254K+ annual commission structures',
      'Improved partner performance by 34.2%',
      'Achieved 87.5% automation efficiency',
    ],
    results: [
      {
        metric: 'Commission Processing Time',
        before: '8.5 hours',
        after: '2.3 hours',
        improvement: '73%',
      },
      { metric: 'Dispute Rate', before: '3.8%', after: '1.2%', improvement: '68%' },
      { metric: 'Calculation Accuracy', before: '87.8%', after: '99.8%', improvement: '14%' },
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
    category: 'data-analytics',
    technologies: ['React', 'TypeScript', 'Recharts', 'BTYD Framework', 'Machine Learning'],
    displayMetrics: [
      { label: 'Prediction Accuracy', value: '94.3%', icon: Target },
      { label: 'Predicted Revenue Impact', value: '$1.28M', icon: DollarSign },
      { label: 'Segments', value: '5', icon: BarChart3 },
    ],
    featured: false,
    year: 2024,
    client: 'Customer analytics · 4,287 accounts',
    duration: '6 months',
    impact: [
      'Achieved 94.3% prediction accuracy with ML models',
      'Reduced churn probability from 21% to 12.8% for at-risk segments',
      'Enabled 5-tier customer segmentation',
    ],
    results: [
      {
        metric: 'Churn Probability (at-risk segments)',
        before: '21%',
        after: '12.8%',
        improvement: '39%',
      },
      { metric: 'Marketing Campaign Efficiency', before: '', after: '', improvement: '42%' },
      { metric: 'Customer Retention', before: '', after: '', improvement: '18%' },
    ],
    caseStudyUrl: '/projects/customer-lifetime-value',
  },
  {
    id: 'forecast-pipeline-intelligence',
    slug: 'forecast-pipeline-intelligence',
    title: 'Forecast & Pipeline Intelligence',
    description:
      'Predictive forecasting lifting accuracy from 63% to 94% and cutting slippage from 26% to 19%',
    longDescription:
      'Enterprise forecasting and pipeline intelligence platform combining predictive analytics, deal health monitoring, and early warning systems.',
    category: 'revenue-ops',
    technologies: ['React', 'TypeScript', 'Salesforce', 'Machine Learning'],
    displayMetrics: [
      { label: 'Forecast Accuracy', value: '94%', icon: Target },
      { label: 'Deal Slippage', value: '19%', icon: TrendingUp },
      { label: 'Deals Tracked', value: '4,200+', icon: Activity },
    ],
    featured: true,
    year: 2024,
    client: 'Revenue forecasting · 4,200+ deals',
    duration: '5 months',
    impact: [
      'Improved forecast accuracy from 63% to 94%, a 31 percentage point gain',
      'Reduced deal slippage from 26% to 19%',
      'Monitored 4,200+ active deals',
    ],
    results: [
      { metric: 'Forecast Accuracy', before: '63%', after: '94%', improvement: '31 pts' },
      { metric: 'Deal Slippage', before: '26%', after: '19%', improvement: '27%' },
    ],
    caseStudyUrl: '/projects/forecast-pipeline-intelligence',
  },
  {
    id: 'multi-channel-attribution',
    slug: 'multi-channel-attribution',
    title: 'Multi-Channel Attribution Analytics',
    description:
      'ML-powered attribution across 12 active marketing channels with $2.3M ROI optimization',
    longDescription:
      'Advanced marketing attribution analytics platform using machine learning models to track customer journeys across 12 active marketing channels. Improved campaign ROI prediction accuracy to 92.4%.',
    category: 'data-analytics',
    technologies: ['React', 'TypeScript', 'Recharts', 'Machine Learning'],
    displayMetrics: [
      { label: 'Accuracy', value: '92.4%', icon: Target },
      { label: 'ROI Impact', value: '$2.3M', icon: DollarSign },
      { label: 'Channels', value: '12', icon: BarChart3 },
    ],
    featured: false,
    year: 2024,
    client: 'B2B marketing · 12 channels',
    duration: '6 months',
    impact: [
      'Improved campaign ROI prediction accuracy from 67% to 92.4%',
      'Optimized $2.3M in marketing ROI',
      'Tracked 12 active marketing channels',
    ],
    results: [
      {
        metric: 'Campaign ROI Prediction Accuracy',
        before: '67%',
        after: '92.4%',
        improvement: '38%',
      },
      { metric: 'Conversion Rate', before: '', after: '', improvement: '47.8%' },
      { metric: 'Customer Acquisition Cost', before: '', after: '', improvement: '31%' },
    ],
    caseStudyUrl: '/projects/multi-channel-attribution',
  },
  {
    id: 'partner-performance',
    slug: 'partner-performance',
    title: 'Partner Performance Intelligence',
    description: 'Channel analytics with 83.2% win rate and 4.7x quick ratio',
    longDescription:
      'Channel analytics across 47 partners: an 83.2% win rate, $904K in partner revenue and a 4.7x quick ratio, with Pareto analysis showing 5 partners drive 80% of channel revenue.',
    category: 'revenue-ops',
    technologies: ['React', 'TypeScript', 'Recharts'],
    displayMetrics: [
      { label: 'Win Rate', value: '83.2%', icon: Award },
      { label: 'Partner Revenue', value: '$904K', icon: DollarSign },
      { label: 'Quick Ratio', value: '4.7x', icon: TrendingUp },
    ],
    featured: false,
    year: 2024,
    client: 'Partner operations · 47 partners',
    duration: '4 months',
    impact: [
      'Achieved 83.2% partner win rate',
      'Generated $904K partner revenue',
      'Maintained 4.7x SaaS quick ratio',
    ],
    results: [
      {
        metric: 'Certified Partner Revenue Contribution',
        before: '',
        after: '',
        improvement: '63%',
      },
      { metric: 'Partner Churn', before: '', after: '', improvement: '22%' },
    ],
    caseStudyUrl: '/projects/partner-performance',
  },
  {
    id: 'partnership-program-implementation',
    slug: 'partnership-program-implementation',
    title: 'Partnership Program Implementation',
    description: 'Built first partnership program from scratch with 90%+ automation',
    longDescription:
      "Designed and built the company's first partnership program: 47 active partners, 90%+ process automation, and a new revenue stream now 35% of total company revenue.",
    category: 'revenue-ops',
    technologies: ['Salesforce', 'DocuSign API', 'React', 'TypeScript', 'REST APIs'],
    displayMetrics: [
      { label: 'Active Partners', value: '47', icon: Users },
      { label: 'Automation', value: '90%+', icon: Zap },
      { label: 'Revenue from Partners', value: '35%', icon: DollarSign },
      { label: 'Onboarding', value: '15 days', icon: Clock },
    ],
    featured: true,
    year: 2023,
    client: 'Partner channel · first program',
    duration: '6 months',
    impact: [
      "Launched company's first partnership program",
      'Achieved 90%+ process automation',
      'Cut partner onboarding from 6+ weeks to 15 days',
    ],
    results: [],
    caseStudyUrl: '/projects/partnership-program-implementation',
  },
  {
    id: 'quota-territory-management',
    slug: 'quota-territory-management',
    title: 'Quota & Territory Management',
    description: 'Quota and territory optimization lifting forecast accuracy from 64% to 92%',
    longDescription:
      'Quota setting and territory assignment across 47 territories. Forecast accuracy rose from 64% to 92%, quota attainment variance fell from 32% to 11%, and the work generated $8.7M in incremental revenue.',
    category: 'revenue-ops',
    technologies: ['React', 'TypeScript', 'Machine Learning'],
    displayMetrics: [
      { label: 'Accuracy Gain', value: '+28 pts', icon: Target },
      { label: 'Incremental Revenue', value: '$8.7M', icon: TrendingUp },
      { label: 'Territories', value: '47', icon: BarChart3 },
    ],
    featured: false,
    year: 2024,
    client: 'Sales planning · 47 territories',
    duration: '4 months',
    impact: [
      'Raised forecast accuracy from 64% to 92%',
      'Reduced quota attainment variance from 32% to 11%',
      'Optimized 47 sales territories',
    ],
    results: [
      { metric: 'Forecast Accuracy', before: '64%', after: '92%', improvement: '28 pts' },
      { metric: 'Quota Attainment Variance', before: '32%', after: '11%', improvement: '66%' },
      { metric: 'Sales Rep Turnover', before: '28%', after: '10%', improvement: '64%' },
    ],
    caseStudyUrl: '/projects/quota-territory-management',
  },
  {
    id: 'revenue-operations-center',
    slug: 'revenue-operations-center',
    title: 'Revenue Operations Center',
    description: 'Unified RevOps dashboard with 96.8% forecast accuracy',
    longDescription:
      'Revenue operations dashboard consolidating 12 source systems. Forecast accuracy rose from 74% to 96.8%, manual reporting time fell 78%, and revenue grew 34.2% year over year.',
    category: 'revenue-ops',
    technologies: ['React', 'TypeScript', 'Recharts'],
    displayMetrics: [
      { label: 'Forecast Accuracy', value: '96.8%', icon: Target },
      { label: 'Revenue Growth', value: '+34.2%', icon: TrendingUp },
      { label: 'Operational Efficiency', value: '89.7%', icon: Activity },
    ],
    featured: false,
    year: 2024,
    client: 'Revenue operations · 12 systems',
    duration: '6 months',
    impact: [
      'Achieved 96.8% forecast accuracy',
      'Cut manual reporting time by 78%',
      'Achieved 34.2% YoY revenue growth',
    ],
    results: [
      { metric: 'Forecast Accuracy', before: '74%', after: '96.8%', improvement: '31%' },
      { metric: 'Manual Reporting Time', before: '', after: '', improvement: '78%' },
      { metric: 'Lead-to-Opportunity Conversion', before: '', after: '', improvement: '31%' },
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
    category: 'revenue-ops',
    technologies: ['React', 'TypeScript'],
    displayMetrics: [
      { label: 'Win Rate', value: '+34%', icon: Award },
      { label: 'Ramp Time', value: '-45%', icon: Clock },
      { label: 'Team Size', value: '125', icon: Users },
    ],
    featured: true,
    year: 2023,
    client: 'Enablement · 125 sales professionals',
    duration: '5 months',
    impact: [
      'Increased win rates by 34%',
      'Reduced ramp time by 45%',
      'Trained 125+ sales professionals',
    ],
    results: [
      { metric: 'Win Rate', before: '52%', after: '70%', improvement: '34%' },
      { metric: 'Ramp Time', before: '9 mo', after: '5 mo', improvement: '45%' },
      { metric: 'Manager Satisfaction', before: '3.4', after: '4.7', improvement: '38%' },
    ],
    caseStudyUrl: '/projects/sales-enablement',
  },
]

/** Number of published case studies. Use this in copy instead of a hardcoded count. */
export const PROJECT_COUNT = showcaseProjects.length
