import { NextResponse } from "next/server"
import type { ZodError } from "zod"

export type ApiResponse<T = unknown> = {
  success: boolean
  data?: T
  error?: string
  errors?: Record<string, string[]>
}

export function successResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
  })
}

export function errorResponse(message: string, status = 400): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status },
  )
}

export function validationErrorResponse(error: ZodError): NextResponse<ApiResponse> {
  const errors = error.errors.reduce(
    (acc, curr) => {
      const key = curr.path[0]?.toString() || "general"
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(curr.message)
      return acc
    },
    {} as Record<string, string[]>,
  )

  return NextResponse.json(
    {
      success: false,
      error: "Validation error",
      errors,
    },
    { status: 400 },
  )
}

