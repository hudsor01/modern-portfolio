import { NextResponse } from 'next/server'
import type { ZodError } from 'zod'

export type ApiResponse<T = unknown> = {
  success: boolean
  status: number
  data?: T
  error?: string
  errors?: Record<string, string[]>
}

export function successResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    status: 200,
    data,
  })
}
export function errorResponse(message: string, status = 400): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      status,
      error: message,
    },
    { status }
  )
}

export function validationErrorResponse(error: ZodError): NextResponse<ApiResponse> {
  const errors = error.issues.reduce(
    (acc: Record<string, string[]>, curr) => {
      // Get a safe string key from the path, defaulting to 'general'
      let key = 'general';
      
      if (curr.path.length > 0 && curr.path[0] !== undefined) {
        key = String(curr.path[0]);
      }
      
      // Create a new object with the existing properties and the new array
      return {
        ...acc,
        [key]: [...(acc[key] || []), curr.message]
      };
    },
    {} as Record<string, string[]>
  );
  
  return NextResponse.json(
    {
      success: false,
      status: 400,
      error: 'Validation error',
      errors,
    },
    { status: 400 }
  )
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
