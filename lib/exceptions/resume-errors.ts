export class ResumeGenerationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: any,
  ) {
    super(message)
    this.name = "ResumeGenerationError"
  }
}

export const ResumeErrorCodes = {
  DATABASE_ERROR: "RESUME_DATABASE_ERROR",
  PDF_GENERATION_ERROR: "RESUME_PDF_GENERATION_ERROR",
  BROWSER_ERROR: "RESUME_BROWSER_ERROR",
  NAVIGATION_ERROR: "RESUME_NAVIGATION_ERROR",
  RENDER_ERROR: "RESUME_RENDER_ERROR",
  UNKNOWN_ERROR: "RESUME_UNKNOWN_ERROR",
} as const

