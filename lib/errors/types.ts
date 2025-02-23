export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode = 500,
    public metadata?: Record<string, unknown>,
  ) {
    super(message)
    this.name = "AppError"
  }
}

export class ValidationError extends AppError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, "VALIDATION_ERROR", 400, metadata)
    this.name = "ValidationError"
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, "AUTHENTICATION_ERROR", 401, metadata)
    this.name = "AuthenticationError"
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, "DATABASE_ERROR", 500, metadata)
    this.name = "DatabaseError"
  }
}

export class ApiError extends AppError {
  constructor(message: string, statusCode = 500, metadata?: Record<string, unknown>) {
    super(message, "API_ERROR", statusCode, metadata)
    this.name = "ApiError"
  }
}
