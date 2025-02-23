"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { logger } from "@/lib/logger"
import type { AppError } from "@/lib/errors/types"

interface FormState<T> {
  data?: T
  error?: AppError
}

export function useFormState<T>() {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<FormState<T>>({})

  const execute = async (action: () => Promise<T>) => {
    startTransition(async () => {
      try {
        const data = await action()
        setState({ data })
        return data
      } catch (error) {
        logger.error("Form action failed", { error })

        const message = error instanceof Error ? error.message : "An unexpected error occurred"
        toast.error(message)

        setState({ error: error as AppError })
        return null
      }
    })
  }

  return {
    isPending,
    data: state.data,
    error: state.error,
    execute,
  }
}
