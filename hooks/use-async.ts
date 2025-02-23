"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"
import { logger } from "@/lib/logger"

interface AsyncState<T> {
  data: T | null
  error: Error | null
  isLoading: boolean
}

export function useAsync<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: false,
  })

  const execute = useCallback(
    async (asyncFunction: () => Promise<T>, options?: { showToast?: boolean; successMessage?: string }) => {
      try {
        setState({ data: null, error: null, isLoading: true })
        const data = await asyncFunction()
        setState({ data, error: null, isLoading: false })

        if (options?.showToast) {
          toast.success(options.successMessage || "Operation completed successfully")
        }

        return { data, error: null }
      } catch (error) {
        logger.error("Async operation failed", { error })
        setState({ data: null, error: error as Error, isLoading: false })

        if (options?.showToast) {
          toast.error(error instanceof Error ? error.message : "An unexpected error occurred")
        }

        return { data: null, error: error as Error }
      }
    },
    [],
  )

  return { ...state, execute }
}
