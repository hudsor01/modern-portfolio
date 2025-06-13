export interface Skill {
  name: string
  category: 'data' | 'tools' | 'business' | 'technical'
  proficiency: number // 1-100
  icon?: string
}

export const skills: Skill[] = [
  {
    name: 'Data Analysis',
    category: 'data',
    proficiency: 95,
  },
  {
    name: 'Business Intelligence',
    category: 'data',
    proficiency: 90,
  },
  {
    name: 'Revenue Operations',
    category: 'business',
    proficiency: 95,
  },
  {
    name: 'PowerBI',
    category: 'tools',
    proficiency: 90,
  },
  {
    name: 'Tableau',
    category: 'tools',
    proficiency: 85,
  },
  {
    name: 'SQL',
    category: 'technical',
    proficiency: 80,
  },
  {
    name: 'Excel',
    category: 'tools',
    proficiency: 95,
  },
  {
    name: 'Salesforce',
    category: 'tools',
    proficiency: 85,
  },
  {
    name: 'Strategic Planning',
    category: 'business',
    proficiency: 90,
  },
  {
    name: 'Process Optimization',
    category: 'business',
    proficiency: 85,
  },
  {
    name: 'Python',
    category: 'technical',
    proficiency: 75,
  },
  {
    name: 'Data Visualization',
    category: 'data',
    proficiency: 90,
  },
]