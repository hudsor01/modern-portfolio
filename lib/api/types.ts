export interface ApiResponse<T = unknown> {
  data?: T
  error?: {
    message: string
    code: string
    metadata?: Record<string, unknown>
  }
}

export interface PaginatedResponse<T> extends ApiResponse {
  data?: T[]
  pagination?: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export interface ApiContext {
  params: Record<string, string>
  searchParams: URLSearchParams
}

export type ApiHandler<T = unknown> = (request: Request, context: ApiContext) => Promise<Response | ApiResponse<T>>
