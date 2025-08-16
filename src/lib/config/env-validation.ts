/**
 * Environment Variable Validation and Configuration Management
 * Ensures all required environment variables are present and valid
 */

import { z } from 'zod';

// Environment variable schemas
const EnvironmentSchema = z.object({
  // App Configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  
  // Database Configuration (if applicable)
  DATABASE_URL: z.string().url().optional(),
  
  // API Configuration
  API_BASE_URL: z.string().url().optional(),
  API_TIMEOUT: z.coerce.number().default(10000),
  
  // Email Service Configuration
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().regex(/^\d+$/, 'Must be a number').transform(Number).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),
  
  // External Service API Keys
  VERCEL_ANALYTICS_ID: z.string().optional(),
  
  // Security Configuration
  JWT_SECRET: z.string().min(32).optional(),
  ENCRYPTION_KEY: z.string().min(32).optional(),
  
  // File Storage Configuration
  UPLOAD_MAX_SIZE: z.coerce.number().default(5242880), // 5MB default
  ALLOWED_FILE_TYPES: z.string().default('image/jpeg,image/png,image/webp,application/pdf'),
  
  // Rate Limiting Configuration
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW: z.coerce.number().default(900000), // 15 minutes
  
  // Feature Flags
  ENABLE_ANALYTICS: z.coerce.boolean().default(true),
  ENABLE_CONTACT_FORM: z.coerce.boolean().default(true),
  ENABLE_RESUME_GENERATION: z.coerce.boolean().default(true),
  ENABLE_PERFORMANCE_MONITORING: z.coerce.boolean().default(false),
  
  // Cache Configuration
  CACHE_TTL: z.coerce.number().default(300), // 5 minutes
  REDIS_URL: z.string().url().optional(),
  
  // Logging Configuration
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  ENABLE_REQUEST_LOGGING: z.coerce.boolean().default(false),
  
  // CSP and Security Headers
  CSP_REPORT_URI: z.string().url().optional(),
  ALLOWED_ORIGINS: z.string().default('*'),
});

// Runtime configuration schema (derived from env vars)
const RuntimeConfigSchema = z.object({
  app: z.object({
    env: z.enum(['development', 'production', 'test']),
    port: z.number(),
    baseUrl: z.string().optional(),
  }),
  
  api: z.object({
    baseUrl: z.string().optional(),
    timeout: z.number(),
  }),
  
  email: z.object({
    enabled: z.boolean(),
    smtp: z.object({
      host: z.string().optional(),
      port: z.number().optional(),
      user: z.string().optional(),
      pass: z.string().optional(),
    }),
    from: z.string().email().optional(),
  }),
  
  security: z.object({
    jwtSecret: z.string().optional(),
    encryptionKey: z.string().optional(),
    allowedOrigins: z.array(z.string()),
    cspReportUri: z.string().optional(),
  }),
  
  storage: z.object({
    maxFileSize: z.number(),
    allowedTypes: z.array(z.string()),
  }),
  
  rateLimit: z.object({
    max: z.number(),
    windowMs: z.number(),
  }),
  
  features: z.object({
    analytics: z.boolean(),
    contactForm: z.boolean(),
    resumeGeneration: z.boolean(),
    performanceMonitoring: z.boolean(),
  }),
  
  cache: z.object({
    ttl: z.number(),
    redisUrl: z.string().optional(),
  }),
  
  logging: z.object({
    level: z.enum(['error', 'warn', 'info', 'debug']),
    enableRequestLogging: z.boolean(),
  }),
  
  analytics: z.object({
    vercelId: z.string().optional(),
  }),
});

// Validation result interface
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: z.ZodError;
  warnings?: string[];
}

/**
 * Environment Configuration Manager
 */
export class EnvConfigManager {
  private static instance: EnvConfigManager;
  private envVars: z.infer<typeof EnvironmentSchema> | null = null;
  private runtimeConfig: z.infer<typeof RuntimeConfigSchema> | null = null;
  private validationErrors: z.ZodError | null = null;
  private warnings: string[] = [];

  private constructor() {
    this.loadAndValidate();
  }

  static getInstance(): EnvConfigManager {
    if (!EnvConfigManager.instance) {
      EnvConfigManager.instance = new EnvConfigManager();
    }
    return EnvConfigManager.instance;
  }

  /**
   * Load and validate environment variables
   */
  private loadAndValidate(): void {
    try {
      // Validate environment variables
      const envResult = EnvironmentSchema.safeParse(process.env);
      
      if (!envResult.success) {
        this.validationErrors = envResult.error;
        console.error('Environment validation failed:', envResult.error.issues);
        return;
      }

      this.envVars = envResult.data;
      this.generateRuntimeConfig();
      this.checkWarnings();
      
    } catch (error) {
      console.error('Failed to load environment configuration:', error);
    }
  }

  /**
   * Generate runtime configuration from environment variables
   */
  private generateRuntimeConfig(): void {
    if (!this.envVars) return;

    try {
      const config = {
        app: {
          env: this.envVars.NODE_ENV,
          port: this.envVars.PORT,
          baseUrl: this.envVars.API_BASE_URL,
        },
        
        api: {
          baseUrl: this.envVars.API_BASE_URL,
          timeout: this.envVars.API_TIMEOUT,
        },
        
        email: {
          enabled: !!(this.envVars.SMTP_HOST && this.envVars.EMAIL_FROM),
          smtp: {
            host: this.envVars.SMTP_HOST,
            port: this.envVars.SMTP_PORT,
            user: this.envVars.SMTP_USER,
            pass: this.envVars.SMTP_PASS,
          },
          from: this.envVars.EMAIL_FROM,
        },
        
        security: {
          jwtSecret: this.envVars.JWT_SECRET,
          encryptionKey: this.envVars.ENCRYPTION_KEY,
          allowedOrigins: this.envVars.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()),
          cspReportUri: this.envVars.CSP_REPORT_URI,
        },
        
        storage: {
          maxFileSize: this.envVars.UPLOAD_MAX_SIZE,
          allowedTypes: this.envVars.ALLOWED_FILE_TYPES.split(',').map(type => type.trim()),
        },
        
        rateLimit: {
          max: this.envVars.RATE_LIMIT_MAX,
          windowMs: this.envVars.RATE_LIMIT_WINDOW,
        },
        
        features: {
          analytics: this.envVars.ENABLE_ANALYTICS,
          contactForm: this.envVars.ENABLE_CONTACT_FORM,
          resumeGeneration: this.envVars.ENABLE_RESUME_GENERATION,
          performanceMonitoring: this.envVars.ENABLE_PERFORMANCE_MONITORING,
        },
        
        cache: {
          ttl: this.envVars.CACHE_TTL,
          redisUrl: this.envVars.REDIS_URL,
        },
        
        logging: {
          level: this.envVars.LOG_LEVEL,
          enableRequestLogging: this.envVars.ENABLE_REQUEST_LOGGING,
        },
        
        analytics: {
          vercelId: this.envVars.VERCEL_ANALYTICS_ID,
        },
      };

      const validationResult = RuntimeConfigSchema.safeParse(config);
      
      if (validationResult.success) {
        this.runtimeConfig = validationResult.data;
      } else {
        console.error('Runtime config validation failed:', validationResult.error.issues);
      }
    } catch (error) {
      console.error('Failed to generate runtime config:', error);
    }
  }

  /**
   * Check for configuration warnings
   */
  private checkWarnings(): void {
    const warnings: string[] = [];

    if (this.envVars?.NODE_ENV === 'production') {
      // Production-specific warnings
      if (!this.envVars.JWT_SECRET) {
        warnings.push('JWT_SECRET is not set - authentication features may not work');
      }
      
      if (!this.envVars.ENCRYPTION_KEY) {
        warnings.push('ENCRYPTION_KEY is not set - data encryption features may not work');
      }
      
      if (!this.envVars.SMTP_HOST || !this.envVars.EMAIL_FROM) {
        warnings.push('Email configuration incomplete - contact forms may not work');
      }
      
      if (this.envVars.LOG_LEVEL === 'debug') {
        warnings.push('Debug logging enabled in production - consider changing to "info" or "warn"');
      }
    }

    // General warnings
    if (this.envVars?.ALLOWED_ORIGINS === '*') {
      warnings.push('CORS is set to allow all origins - consider restricting for security');
    }

    this.warnings = warnings;
    
    if (warnings.length > 0) {
      console.warn('Configuration warnings:', warnings);
    }
  }

  /**
   * Get validated environment variables
   */
  getEnvVars(): z.infer<typeof EnvironmentSchema> | null {
    return this.envVars;
  }

  /**
   * Get runtime configuration
   */
  getRuntimeConfig(): z.infer<typeof RuntimeConfigSchema> | null {
    return this.runtimeConfig;
  }

  /**
   * Check if configuration is valid
   */
  isValid(): boolean {
    return this.envVars !== null && this.runtimeConfig !== null && this.validationErrors === null;
  }

  /**
   * Get configuration validation errors
   */
  getErrors(): z.ZodError | null {
    return this.validationErrors;
  }

  /**
   * Get configuration warnings
   */
  getWarnings(): string[] {
    return this.warnings;
  }

  /**
   * Get a specific configuration value with type safety
   */
  get<K extends keyof z.infer<typeof RuntimeConfigSchema>>(
    section: K
  ): z.infer<typeof RuntimeConfigSchema>[K] | null {
    return this.runtimeConfig?.[section] || null;
  }

  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(feature: keyof z.infer<typeof RuntimeConfigSchema>['features']): boolean {
    return this.runtimeConfig?.features[feature] || false;
  }

  /**
   * Reload configuration (useful for development)
   */
  reload(): void {
    this.envVars = null;
    this.runtimeConfig = null;
    this.validationErrors = null;
    this.warnings = [];
    this.loadAndValidate();
  }

  /**
   * Export configuration for debugging
   */
  exportConfig(): {
    isValid: boolean;
    warnings: string[];
    errors: z.ZodIssue[] | null;
    config: z.infer<typeof RuntimeConfigSchema> | null;
  } {
    return {
      isValid: this.isValid(),
      warnings: this.warnings,
      errors: this.validationErrors?.issues || null,
      config: this.runtimeConfig,
    };
  }
}

// Singleton instance
const envConfig = EnvConfigManager.getInstance();

// Export convenience functions
export const getConfig = () => envConfig.getRuntimeConfig();
export const getEnvVars = () => envConfig.getEnvVars();
export const isFeatureEnabled = (feature: keyof z.infer<typeof RuntimeConfigSchema>['features']) => 
  envConfig.isFeatureEnabled(feature);
export const isConfigValid = () => envConfig.isValid();
export const getConfigErrors = () => envConfig.getErrors();
export const getConfigWarnings = () => envConfig.getWarnings();

// Export configuration sections for easy access
export const appConfig = () => envConfig.get('app');
export const apiConfig = () => envConfig.get('api');
export const emailConfig = () => envConfig.get('email');
export const securityConfig = () => envConfig.get('security');
export const storageConfig = () => envConfig.get('storage');
export const rateLimitConfig = () => envConfig.get('rateLimit');
export const featuresConfig = () => envConfig.get('features');
export const cacheConfig = () => envConfig.get('cache');
export const loggingConfig = () => envConfig.get('logging');
export const analyticsConfig = () => envConfig.get('analytics');

// Export types
export type EnvVars = z.infer<typeof EnvironmentSchema>;
export type RuntimeConfig = z.infer<typeof RuntimeConfigSchema>;
export type ConfigSection<K extends keyof RuntimeConfig> = RuntimeConfig[K];

export default envConfig;