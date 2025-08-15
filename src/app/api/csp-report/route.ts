import { NextRequest, NextResponse } from 'next/server'
import { logSecurityEvent } from '@/lib/security/security-headers'

interface CSPViolationReport {
  'csp-report': {
    'document-uri': string
    referrer: string
    'violated-directive': string
    'effective-directive': string
    'original-policy': string
    disposition: string
    'blocked-uri': string
    'line-number': number
    'column-number': number
    'source-file': string
    'status-code': number
    'script-sample': string
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse CSP violation report
    const report: CSPViolationReport = await request.json()
    const violation = report['csp-report']

    // Determine severity based on violation type
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
    
    if (violation['violated-directive'].includes('script-src')) {
      severity = 'high' // Script violations are serious
    } else if (violation['violated-directive'].includes('object-src') || 
               violation['violated-directive'].includes('base-uri')) {
      severity = 'critical' // These could indicate XSS attempts
    } else if (violation['violated-directive'].includes('img-src') ||
               violation['violated-directive'].includes('font-src')) {
      severity = 'low' // Resource loading issues
    }

    // Log the security event
    logSecurityEvent('csp_violation', severity, {
      documentUri: violation['document-uri'],
      violatedDirective: violation['violated-directive'],
      effectiveDirective: violation['effective-directive'],
      blockedUri: violation['blocked-uri'],
      sourceFile: violation['source-file'],
      lineNumber: violation['line-number'],
      columnNumber: violation['column-number'],
      scriptSample: violation['script-sample']?.substring(0, 100), // Limit sample size
      statusCode: violation['status-code'],
      disposition: violation.disposition
    }, request)

    // Check for potential attack patterns
    const suspiciousPatterns = [
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /<script/i,
      /eval\(/i,
      /setTimeout\(/i,
      /setInterval\(/i
    ]

    const isSuspicious = suspiciousPatterns.some(pattern => 
      pattern.test(violation['blocked-uri']) || 
      pattern.test(violation['script-sample'] || '')
    )

    if (isSuspicious) {
      logSecurityEvent('potential_xss_attempt', 'critical', {
        blockedUri: violation['blocked-uri'],
        scriptSample: violation['script-sample'],
        documentUri: violation['document-uri'],
        sourceFile: violation['source-file']
      }, request)
    }

    return new NextResponse('OK', { 
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-store, max-age=0'
      }
    })

  } catch (error) {
    console.error('Error processing CSP report:', error)
    
    // Log the error but don't reveal details to client
    logSecurityEvent('csp_report_processing_error', 'low', {
      error: error instanceof Error ? error.message : 'Unknown error'
    }, request)

    return new NextResponse('Bad Request', { status: 400 })
  }
}

// Define allowed HTTP methods
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

// CSP reporting endpoint should only accept POST requests
export async function GET() {
  return new NextResponse('Method Not Allowed', { 
    status: 405,
    headers: {
      'Allow': 'POST'
    }
  })
}

export async function PUT() {
  return new NextResponse('Method Not Allowed', { 
    status: 405,
    headers: {
      'Allow': 'POST'
    }
  })
}

export async function DELETE() {
  return new NextResponse('Method Not Allowed', { 
    status: 405,
    headers: {
      'Allow': 'POST'
    }
  })
}

export async function PATCH() {
  return new NextResponse('Method Not Allowed', { 
    status: 405,
    headers: {
      'Allow': 'POST'
    }
  })
}
