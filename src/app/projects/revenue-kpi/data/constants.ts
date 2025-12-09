import type { Variants } from 'framer-motion'

export type YearOverYearGrowth = {
  year: number
  total_revenue: number
  total_transactions: number
  total_commissions: number
  partner_count: number
  commission_growth_percentage: number
}

export const starData = {
  situation: { phase: 'Situation', impact: 31, efficiency: 26, value: 21 },
  task: { phase: 'Task', impact: 56, efficiency: 51, value: 46 },
  action: { phase: 'Action', impact: 86, efficiency: 89, value: 81 },
  result: { phase: 'Result', impact: 99, efficiency: 97, value: 95 },
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

export const technologies = [
  'React 19',
  'TypeScript',
  'Recharts',
  'Next.js',
  'Tailwind CSS',
  'Framer Motion',
  'API Integration',
  'Real-time Data',
  'Responsive Design',
  'Performance Optimization',
  'Data Visualization',
  'Business Intelligence',
]

export const timeframes = ['2020', '2022', '2024', 'All']
