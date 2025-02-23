type LogLevel = "error" | "warn" | "info" | "debug"

interface LogMetadata {
  [key: string]: unknown
}

class Logger {
  private static instance: Logger
  private isDevelopment = process.env.NODE_ENV === "development"

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private formatMessage(level: LogLevel, message: string, metadata?: LogMetadata): string {
    const timestamp = new Date().toISOString()
    return `[${timestamp}] [${level.toUpperCase()}] ${message} ${metadata ? JSON.stringify(metadata, null, 2) : ""}`
  }

  private log(level: LogLevel, message: string, metadata?: LogMetadata) {
    const formattedMessage = this.formatMessage(level, message, metadata)

    // Always log errors
    if (level === "error") {
      console.error(formattedMessage)
      // Here you could also send to an error tracking service like Sentry
      return
    }

    // Only log other levels in development
    if (this.isDevelopment) {
      switch (level) {
        case "warn":
          console.warn(formattedMessage)
          break
        case "info":
          console.info(formattedMessage)
          break
        case "debug":
          console.debug(formattedMessage)
          break
      }
    }
  }

  error(message: string, metadata?: LogMetadata) {
    this.log("error", message, metadata)
  }

  warn(message: string, metadata?: LogMetadata) {
    this.log("warn", message, metadata)
  }

  info(message: string, metadata?: LogMetadata) {
    this.log("info", message, metadata)
  }

  debug(message: string, metadata?: LogMetadata) {
    this.log("debug", message, metadata)
  }
}

export const logger = Logger.getInstance()
