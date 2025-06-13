export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  image: string
  category: string
  technologies: string[]
  outcomes?: string[]
  link: string
}

export const projects: Project[] = [
  {
    id: 'revenue-dashboard',
    title: 'Revenue Analytics Dashboard',
    description: 'Interactive dashboard providing real-time insights into sales performance and revenue metrics.',
    longDescription: 'Developed a comprehensive revenue analytics dashboard that integrates data from multiple sources to provide real-time insights into sales performance, revenue metrics, and growth trends. The dashboard includes customizable views for different stakeholders and automated alerts for key performance indicators.',
    image: '/images/projects/revenue-dashboard.jpg',
    category: 'Analytics',
    technologies: ['PowerBI', 'SQL', 'Excel', 'Salesforce'],
    outcomes: [
      'Increased sales team efficiency by 23%',
      'Reduced reporting time by 85%',
      'Improved forecast accuracy by 32%'
    ],
    link: '/projects/revenue-dashboard'
  },
  {
    id: 'customer-retention',
    title: 'Customer Retention Analysis',
    description: 'Deep-dive analysis of customer behavior patterns to identify churn risks and retention opportunities.',
    longDescription: 'Conducted a comprehensive analysis of customer behavior patterns to identify churn risks and retention opportunities. The project involved data mining, statistical analysis, and predictive modeling to develop a customer health scoring system that proactively identifies at-risk accounts.',
    image: '/images/projects/customer-retention.jpg',
    category: 'Data Analysis',
    technologies: ['Python', 'Tableau', 'SQL', 'Excel'],
    outcomes: [
      'Reduced customer churn by 18%',
      'Increased renewal rates by 15%',
      'Developed early warning system for at-risk accounts'
    ],
    link: '/projects/customer-retention'
  },
  {
    id: 'sales-pipeline',
    title: 'Sales Pipeline Optimization',
    description: 'Streamlined sales process and improved conversion rates through data-driven insights.',
    longDescription: 'Redesigned the sales pipeline process based on data-driven insights to eliminate bottlenecks and improve conversion rates at each stage. The project included implementing new tracking metrics, sales enablement tools, and performance dashboards.',
    image: '/images/projects/sales-pipeline.jpg',
    category: 'Process Optimization',
    technologies: ['Salesforce', 'PowerBI', 'Excel'],
    outcomes: [
      'Increased pipeline velocity by 27%',
      'Improved lead-to-opportunity conversion by 35%',
      'Reduced sales cycle length by 12 days on average'
    ],
    link: '/projects/sales-pipeline'
  }
]