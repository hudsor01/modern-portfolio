import { z } from 'zod'

export class ExperienceError extends Error {
  code: number;
  details?: z.ZodFormattedError<any> | Record<string, any>;

  constructor(message: string, code: number = 400, details?: z.ZodFormattedError<any> | Record<string, any>) {
    super(message);
    this.name = 'ExperienceError';
    this.code = code;
    this.details = details;
  }
}

export interface Experience {
  company: string
  position: string
  logo?: string
  location?: string
  startDate: string | Date
  endDate?: string | Date
  current?: boolean
  description?: string
  achievements?: string[]
  technologies?: string[]
  url?: string
}

export interface Education {
  institution: string
  degree: string
  field: string
  logo?: string
  location?: string
  startDate: string | Date
  endDate?: string | Date
  current?: boolean
  description?: string
  achievements?: string[]
  url?: string
}

export interface Certification {
  name: string
  issuer: string
  date: string | Date
  expires?: string | Date
  credentialId?: string
  credentialUrl?: string
  logo?: string
}

// Zod schemas for validation
export const experienceSchema = z
  .object({
    company: z.string().min(1, 'Company name is required'),
    position: z.string().min(1, 'Position is required'),
    logo: z.string().url('Logo must be a valid URL').optional(),
    location: z.string().optional(),
    startDate: z.union([
      z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
      z.date(),
    ]),
    endDate: z
      .union([
        z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
        z.date(),
      ])
      .optional(),
    current: z.boolean().optional(),
    description: z.string().optional(),
    achievements: z.array(z.string()).optional(),
    technologies: z.array(z.string()).optional(),
    url: z.string().url('URL must be valid').optional(),
  })
  .refine(
    (data) => {
      // If current is true, endDate should be undefined
      if (data.current === true && data.endDate !== undefined) {
        return false
      }
      return true
    },
    {
      message: 'End date should not be provided when position is current',
      path: ['endDate'],
    }
  )

export const educationSchema = z.object({
  institution: z.string().min(1, 'Institution name is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().min(1, 'Field of study is required'),
  logo: z.string().url('Logo must be a valid URL').optional(),
  location: z.string().optional(),
  startDate: z.union([
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    z.date(),
  ]),
  endDate: z
    .union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'), z.date()])
    .optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
  achievements: z.array(z.string()).optional(),
  url: z.string().url('URL must be valid').optional(),
})

export const certificationSchema = z.object({
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  date: z.union([
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    z.date(),
  ]),
  expires: z
    .union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'), z.date()])
    .optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url('Credential URL must be valid').optional(),
  logo: z.string().url('Logo must be a valid URL').optional(),
})

// Helper function to validate experience data
export function validateExperience(data: unknown): Experience {
  try {
    return experienceSchema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ExperienceError('Experience validation failed', 400, error.format())
    }
    throw new ExperienceError('Invalid experience data', 400)
  }
}

// Helper function to validate education data
export function validateEducation(data: unknown): Education {
  try {
    return educationSchema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ExperienceError('Education validation failed', 400, error.format())
    } else {
      throw new Error('Invalid experience data')
    }
  }
}

// Helper function to validate certification data
export function validateCertification(data: unknown): Certification {
  try {
    return certificationSchema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error('Education validation failed', { cause: error.format() })
    } else {
      throw new Error('Invalid education data')
    }
  }
}
