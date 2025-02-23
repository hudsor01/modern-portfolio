import { ResumeGenerationError, ResumeErrorCodes } from "@/lib/exceptions/resume-errors"

export async function handleResumeError(error: unknown): Promise<never> {
  console.error("Resume generation error:", error)

  if (error instanceof ResumeGenerationError) {
    throw error
  }

  if (error instanceof Error) {
    // Map known error types to specific resume errors
    if (error.message.includes("database")) {
      throw new ResumeGenerationError("Failed to track resume download", ResumeErrorCodes.DATABASE_ERROR, error)
    }

    if (error.message.includes("browser")) {
      throw new ResumeGenerationError("Failed to initialize PDF generation", ResumeErrorCodes.BROWSER_ERROR, error)
    }

    if (error.message.includes("navigation")) {
      throw new ResumeGenerationError("Failed to load resume content", ResumeErrorCodes.NAVIGATION_ERROR, error)
    }

    if (error.message.includes("render")) {
      throw new ResumeGenerationError("Failed to render resume PDF", ResumeErrorCodes.RENDER_ERROR, error)
    }
  }

  // Generic error for unknown cases
  throw new ResumeGenerationError(
    "An unexpected error occurred while generating your resume",
    ResumeErrorCodes.UNKNOWN_ERROR,
    error,
  )
}

