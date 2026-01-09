import { Project } from '@/types/project'
import { ContactFormData } from '@/types/shared-api'
import { ChartData } from '@/types/chart'

// Factory for creating mock project data
export const createMockProject = (overrides: Partial<Project> = {}): Project => ({
  id: '1',
  title: 'Test Project',
  slug: 'test-project',
  description: 'A test project for testing purposes',
  longDescription:
    'This is a longer description of the test project that provides more details about what it does and how it works.',
  content: null,
  tags: ['React', 'TypeScript', 'Next.js'],
  category: 'Analytics',
  image:
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center&q=80',
  link: null,
  github: 'https://github.com/test/project',
  featured: false,
  client: null,
  role: null,
  duration: null,
  year: null,
  impact: null,
  results: null,
  displayMetrics: null,
  metrics: null,
  testimonial: null,
  gallery: null,
  details: null,
  charts: null,
  caseStudyUrl: null,
  viewCount: 0,
  clickCount: 0,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
})

// Factory for creating mock contact form data
export const createMockContactForm = (
  overrides: Partial<ContactFormData> = {}
): ContactFormData => ({
  name: 'John Doe',
  email: 'john.doe@example.com',
  subject: 'Test Inquiry',
  message: 'This is a test message for contact form testing.',
  ...overrides,
})

// Factory for creating mock chart data
export const createMockChartData = (dataPoints = 5): ChartData[] => {
  return Array.from({ length: dataPoints }, (_, index) => ({
    name: `Point ${index + 1}`,
    value: Math.floor(Math.random() * 1000) + 100,
  }))
}

// Factory for creating mock revenue data
export const createMockRevenueData = (months = 12) => {
  const months_names = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  return Array.from({ length: months }, (_, index) => ({
    month: months_names[index] || `Month ${index + 1}`,
    revenue: Math.floor(Math.random() * 500000) + 100000,
    target: Math.floor(Math.random() * 600000) + 120000,
    growth: Math.floor(Math.random() * 50) - 10, // -10 to 40% growth
  }))
}

// Factory for creating mock partner data
export const createMockPartnerData = (partners = 10) => {
  const partnerTypes = ['Premium', 'Standard', 'Basic']
  const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America']

  return Array.from({ length: partners }, (_, index) => ({
    id: `partner-${index + 1}`,
    name: `Partner ${index + 1}`,
    type: partnerTypes[index % partnerTypes.length],
    region: regions[index % regions.length],
    revenue: Math.floor(Math.random() * 100000) + 10000,
    deals: Math.floor(Math.random() * 50) + 5,
    conversionRate: Math.floor(Math.random() * 30) + 10,
    joinDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
  }))
}

// Factory for creating mock API responses
export const createMockApiResponse = <T>(data: T, success = true) => ({
  success,
  data: success ? data : null,
  error: success ? null : 'Mock error message',
  message: success ? 'Success' : 'Error occurred',
  timestamp: new Date().toISOString(),
})

// Factory for creating mock error responses
export const createMockErrorResponse = (message = 'Test error', status = 400) => ({
  success: false,
  data: null,
  error: {
    message,
    status,
    code: 'TEST_ERROR',
  },
  timestamp: new Date().toISOString(),
})

// Factory for creating mock loading states
export const createMockLoadingState = () => ({
  isLoading: true,
  data: null,
  error: null,
  isError: false,
  isSuccess: false,
})

// Factory for creating mock success states
export const createMockSuccessState = <T>(data: T) => ({
  isLoading: false,
  data,
  error: null,
  isError: false,
  isSuccess: true,
})

// Factory for creating mock error states
export const createMockErrorState = (error: Error) => ({
  isLoading: false,
  data: null,
  error,
  isError: true,
  isSuccess: false,
})
