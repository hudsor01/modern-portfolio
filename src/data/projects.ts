import React from 'react'
import { DollarSign, Clock, Target, TrendingUp, Zap, Award } from 'lucide-react'

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
]
