/**
 * Type-safe RPC Client for Frontend
 * Provides type-safe methods to call RPC endpoints from the frontend
 */

import { 
  ContactFormInput,
  ContactResponse,
  BlogPost,
  BlogPostCreate,
  BlogPostUpdate,
  BlogPostFilters,
  BlogCategory,
  BlogTag,
  Project,
  ProjectFilters,
  Pagination,
  PaginatedResponse,
  AnalyticsData,
  WebVitalReport,
  // Auth types removed - not needed
  HealthCheck,
  RPCResponse,
  UploadedFile,
} from './types'

// =======================
// BASE RPC CLIENT
// =======================

class RPCError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number,
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'RPCError'
  }
}

interface RPCClientOptions {
  baseUrl?: string
  timeout?: number
  defaultHeaders?: Record<string, string>
  onError?: (error: RPCError) => void
  onResponse?: (response: Response) => void
}

class BaseRPCClient {
  protected baseUrl: string
  protected timeout: number
  protected defaultHeaders: Record<string, string>
  protected onError?: (error: RPCError) => void
  protected onResponse?: (response: Response) => void

  constructor(options: RPCClientOptions = {}) {
    this.baseUrl = options.baseUrl || '/api/rpc'
    this.timeout = options.timeout || 30000
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.defaultHeaders,
    }
    this.onError = options.onError
    this.onResponse = options.onResponse
  }

  // Auth token method removed - portfolio doesn't need authentication

  private async makeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: unknown,
    options: { headers?: Record<string, string> } = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers = { ...this.defaultHeaders, ...options.headers }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Call response callback if provided
      if (this.onResponse) {
        this.onResponse(response)
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const error = new RPCError(
          errorData.error?.message || 'Request failed',
          errorData.error?.code || 'REQUEST_FAILED',
          response.status,
          errorData.error?.details
        )
        
        // Call error callback if provided
        if (this.onError) {
          this.onError(error)
        }
        
        throw error
      }

      const result = await response.json() as RPCResponse<T>

      if (!result.success) {
        const error = new RPCError(
          result.error?.message || 'Operation failed',
          result.error?.code || 'OPERATION_FAILED',
          response.status,
          result.error?.details
        )
        
        if (this.onError) {
          this.onError(error)
        }
        
        throw error
      }

      return result.data as T

    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof RPCError) {
        throw error
      }

      if (error instanceof Error && error.name === 'AbortError') {
        const timeoutError = new RPCError('Request timeout', 'REQUEST_TIMEOUT', 408)
        if (this.onError) {
          this.onError(timeoutError)
        }
        throw timeoutError
      }

      const genericError = new RPCError(
        error instanceof Error ? error.message : 'Unknown error',
        'UNKNOWN_ERROR',
        500
      )
      
      if (this.onError) {
        this.onError(genericError)
      }
      
      throw genericError
    }
  }

  protected get<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>('GET', endpoint)
  }

  protected post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.makeRequest<T>('POST', endpoint, data)
  }

  protected put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.makeRequest<T>('PUT', endpoint, data)
  }

  protected delete<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>('DELETE', endpoint)
  }
}

// =======================
// CONTACT CLIENT
// =======================

class ContactClient extends BaseRPCClient {
  async submit(formData: ContactFormInput): Promise<ContactResponse> {
    return this.post<ContactResponse>('/contact/submit', formData)
  }

  async validate(formData: ContactFormInput): Promise<{ valid: boolean; message: string; fields: string[] }> {
    return this.post('/contact/validate', formData)
  }

  async getStats(): Promise<{
    totalSubmissions: number
    thisMonth: number
    avgResponseTime: string
    topSources: Array<{ source: string; count: number }>
  }> {
    return this.get('/contact/stats')
  }
}

// =======================
// BLOG CLIENT
// =======================

class BlogClient extends BaseRPCClient {
  // Posts
  async getPosts(params: BlogPostFilters & Pagination = { page: 1, limit: 20 }): Promise<PaginatedResponse<BlogPost>> {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.set(key, String(value))
      }
    })
    return this.get<PaginatedResponse<BlogPost>>(`/blog/posts?${queryParams}`)
  }

  async getPost(slug: string): Promise<BlogPost> {
    return this.get<BlogPost>(`/blog/posts/${slug}`)
  }

  async createPost(data: BlogPostCreate): Promise<BlogPost> {
    return this.post<BlogPost>('/blog/posts', data)
  }

  async updatePost(id: string, data: BlogPostUpdate): Promise<BlogPost> {
    return this.put<BlogPost>(`/blog/posts/${id}`, data)
  }

  async deletePost(id: string): Promise<{ success: boolean }> {
    return this.delete<{ success: boolean }>(`/blog/posts/${id}`)
  }

  // Categories
  async getCategories(): Promise<BlogCategory[]> {
    return this.get<BlogCategory[]>('/blog/categories')
  }

  // Tags
  async getTags(): Promise<BlogTag[]> {
    return this.get<BlogTag[]>('/blog/tags')
  }

  // Analytics
  async getAnalytics(): Promise<{
    totalPosts: number
    publishedPosts: number
    draftPosts: number
    totalViews: number
    avgReadingTime: number
    topPosts: BlogPost[]
    monthlyViews: Array<{ month: string; views: number }>
    popularKeywords: Array<{ keyword: string; count: number }>
  }> {
    return this.get('/blog/analytics')
  }

  // File Upload
  async uploadFile(file: File): Promise<UploadedFile> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${this.baseUrl}/blog/upload`, {
      method: 'POST',
      headers: {
        ...Object.fromEntries(
          Object.entries(this.defaultHeaders).filter(([key]) => key !== 'Content-Type')
        ),
        // Remove Content-Type to let browser set multipart boundary
      } as Record<string, string>,
      body: formData,
    })

    if (!response.ok) {
      throw new RPCError('Upload failed', 'UPLOAD_FAILED', response.status)
    }

    const result = await response.json() as RPCResponse<UploadedFile>
    if (!result.success) {
      throw new RPCError(result.error?.message || 'Upload failed', result.error?.code || 'UPLOAD_FAILED', response.status)
    }

    return result.data!
  }
}

// =======================
// PROJECTS CLIENT
// =======================

class ProjectsClient extends BaseRPCClient {
  async getProjects(params: ProjectFilters & Pagination = { page: 1, limit: 20 }): Promise<PaginatedResponse<Project>> {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.set(key, String(value))
      }
    })
    return this.get<PaginatedResponse<Project>>(`/projects?${queryParams}`)
  }

  async getProject(slug: string): Promise<Project & {
    analytics: {
      revenue: number
      users: number
      growth: number
      conversionRate: string
      avgSessionDuration: number
    }
    relatedProjects: Project[]
    technicalDetails: {
      architecture: string[]
      challenges: string[]
      solutions: string[]
    }
  }> {
    return this.get(`/projects/${slug}`)
  }

  async getCategories(): Promise<Array<{
    name: string
    count: number
    slug: string
    description: string
    icon: string
  }>> {
    return this.get('/projects/categories/list')
  }

  async getTechnologies(): Promise<Array<{
    name: string
    count: number
    slug: string
    category: string
    popularity: number
  }>> {
    return this.get('/projects/technologies/list')
  }

  async getStats(): Promise<{
    totalProjects: number
    featuredProjects: number
    categories: number
    technologies: number
    totalRevenue: number
    avgProjectComplexity: number
    successRate: number
    clientSatisfaction: number
    categoryBreakdown: Record<string, number>
    technologyTrends: Array<{ name: string; growth: string; trend: string }>
    performanceMetrics: {
      avgLoadTime: string
      mobileOptimization: string
      accessibility: string
      seoScore: number
    }
  }> {
    return this.get('/projects/stats')
  }

  async searchProjects(params: ProjectFilters & Pagination & {
    sortBy?: 'title' | 'createdAt' | 'featured'
    sortOrder?: 'asc' | 'desc'
  }): Promise<PaginatedResponse<Project>> {
    return this.post<PaginatedResponse<Project>>('/projects/search', params)
  }
}

// =======================
// ANALYTICS CLIENT
// =======================

class AnalyticsClient extends BaseRPCClient {
  async reportVital(vital: WebVitalReport): Promise<{ received: boolean; timestamp: string; vitalId: string }> {
    return this.post('/analytics/vitals', vital)
  }

  async getVitalsSummary(timeRange: string = '7d'): Promise<{
    timeRange: string
    totalReports: number
    vitals: Array<{
      name: string
      value: number
      rating: 'good' | 'needs-improvement' | 'poor'
      count: number
      trend: 'up' | 'down' | 'stable'
    }>
    overallScore: number
    recommendations: string[]
  }> {
    return this.get(`/analytics/vitals/summary?range=${timeRange}`)
  }

  async trackPageView(data: { page: string; title: string; referrer?: string }): Promise<{
    page: string
    views: number
    uniqueViews: number
    timestamp: string
  }> {
    return this.post('/analytics/pageview', data)
  }

  async getPageViews(params: Pagination & {
    timeRange?: string
    sortBy?: 'views' | 'uniqueViews' | 'lastViewed'
  } = { page: 1, limit: 20 }): Promise<{
    pages: Array<{
      page: string
      views: number
      uniqueViews: number
      lastViewed: string
    }>
    totals: {
      totalViews: number
      totalUniqueViews: number
      totalPages: number
      avgViewsPerPage: number
    }
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }> {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.set(key, String(value))
      }
    })
    return this.get(`/analytics/pageviews?${queryParams}`)
  }

  async getDashboard(timeRange: string = '7d'): Promise<{
    timeRange: string
    overview: {
      pageViews: number
      uniqueVisitors: number
      bounceRate: number
      avgSessionDuration: number
      activeSessions: number
    }
    topPages: Array<{ page: string; views: number; uniqueViews: number }>
    vitals: Array<{ name: string; value: number; rating: string }>
    trends: {
      pageViews: Array<{ date: string; value: number }>
      uniqueVisitors: Array<{ date: string; value: number }>
      bounceRate: Array<{ date: string; value: number }>
    }
    geography: Array<{ country: string; visitors: number; percentage: number }>
    devices: Array<{ device: string; visitors: number; percentage: number }>
    referrers: Array<{ source: string; visitors: number; percentage: number }>
  }> {
    return this.get(`/analytics/dashboard?range=${timeRange}`)
  }

  async getHealth(): Promise<HealthCheck> {
    return this.get('/analytics/health')
  }
}

// =======================
// AUTH CLIENT REMOVED - Portfolio site doesn't need authentication

// =======================
// MAIN RPC CLIENT
// =======================

export class RPCClient {
  public contact: ContactClient
  public blog: BlogClient
  public projects: ProjectsClient
  public analytics: AnalyticsClient
  // auth client removed - not needed for portfolio

  constructor(options: RPCClientOptions = {}) {
    this.contact = new ContactClient(options)
    this.blog = new BlogClient(options)
    this.projects = new ProjectsClient(options)
    this.analytics = new AnalyticsClient(options)
    // auth client removed - not needed
  }

  // Auth token method removed - portfolio doesn't need authentication
}

// =======================
// EXPORTS
// =======================

// Create default client instance
export const rpcClient = new RPCClient()

// Export error class for error handling
export { RPCError }

// Export types for use in frontend
export type {
  ContactFormInput,
  ContactResponse,
  BlogPost,
  BlogPostCreate,
  BlogPostUpdate,
  BlogPostFilters,
  BlogCategory,
  BlogTag,
  Project,
  ProjectFilters,
  Pagination,
  PaginatedResponse,
  AnalyticsData,
  WebVitalReport,
  // Auth types removed - not needed
  HealthCheck,
  UploadedFile,
  RPCClientOptions,
}