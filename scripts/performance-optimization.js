#!/usr/bin/env node

/**
 * Performance Optimization Script
 * Analyzes and optimizes the codebase for production performance
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  log(`\n${colors.bold}${colors.cyan}=== ${message} ===${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Recursively find files matching pattern
function findFiles(dir, pattern, exclude = []) {
  const files = [];
  
  function walk(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip excluded directories
        if (!exclude.some(ex => fullPath.includes(ex))) {
          walk(fullPath);
        }
      } else if (pattern.test(item)) {
        files.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return files;
}

// Clean console statements for production
function cleanConsoleStatements() {
  logHeader('Cleaning Console Statements');
  
  const srcDir = path.join(process.cwd(), 'src');
  const exclude = ['node_modules', '.next', 'test-results', '__tests__', '.test.', '.spec.'];
  
  // Find all TypeScript/JavaScript files
  const files = findFiles(srcDir, /\.(ts|tsx|js|jsx)$/, exclude);
  
  let totalRemoved = 0;
  let filesModified = 0;
  
  for (const file of files) {
    try {
      let content = fs.readFileSync(file, 'utf8');
      const originalContent = content;
      
      // Count existing console statements
      const consoleMatches = content.match(/console\.(log|warn|error|debug|info)/g) || [];
      
      if (consoleMatches.length > 0) {
        // Remove console.log statements (keep error, warn for debugging)
        content = content.replace(/console\.log\([^)]*\);?\s*\n?/g, '');
        
        // Remove development-only console statements
        content = content.replace(/if\s*\(process\.env\.NODE_ENV\s*===\s*['"]development['"]\)\s*{\s*console\.[^}]*}/g, '');
        
        // Remove standalone console statements in development blocks
        content = content.replace(/\/\*\s*DEV\s*\*\/\s*console\.[^;]*;/g, '');
        
        if (content !== originalContent) {
          fs.writeFileSync(file, content);
          const removedCount = originalContent.match(/console\.(log|warn|error|debug|info)/g)?.length - 
                              (content.match(/console\.(log|warn|error|debug|info)/g)?.length || 0);
          
          if (removedCount > 0) {
            totalRemoved += removedCount;
            filesModified++;
            logInfo(`${path.relative(process.cwd(), file)}: Removed ${removedCount} console statements`);
          }
        }
      }
    } catch (error) {
      logError(`Failed to process ${file}: ${error.message}`);
    }
  }
  
  logSuccess(`Removed ${totalRemoved} console statements from ${filesModified} files`);
}

// Optimize React components
function optimizeReactComponents() {
  logHeader('Optimizing React Components');
  
  const srcDir = path.join(process.cwd(), 'src');
  const componentFiles = findFiles(srcDir, /\.(tsx|jsx)$/, ['__tests__', '.test.', '.spec.']);
  
  let optimizedComponents = 0;
  
  for (const file of componentFiles) {
    try {
      let content = fs.readFileSync(file, 'utf8');
      const originalContent = content;
      let hasOptimizations = false;
      
      // Add React.memo to components that don't have it
      if (content.includes('export default function') && 
          !content.includes('React.memo') && 
          !content.includes('memo(') &&
          !content.includes("'use client'") &&
          !content.includes('"use client"')) {
        
        // Extract component name
        const componentMatch = content.match(/export default function (\w+)/);
        if (componentMatch) {
          const componentName = componentMatch[1];
          
          // Only add memo to components that accept props
          if (content.includes(`function ${componentName}(`)) {
            content = content.replace(
              `export default function ${componentName}`,
              `const ${componentName} = React.memo(function ${componentName}`
            );
            
            // Add closing parenthesis and export
            content = content.replace(
              /^}$/m,
              '})\n\nexport default ' + componentName
            );
            
            // Add React import if not present
            if (!content.includes('import React') && !content.includes('import { memo }')) {
              content = `import React from 'react'\n${content}`;
            }
            
            hasOptimizations = true;
          }
        }
      }
      
      // Optimize useMemo and useCallback usage
      if (content.includes('useState') || content.includes('useEffect')) {
        // Look for expensive calculations that should be memoized
        const expensiveOperations = [
          /\.map\([^)]*\)\.filter\([^)]*\)/g,
          /\.reduce\([^)]*\)/g,
          /JSON\.parse\(/g,
          /\.sort\([^)]*\)/g
        ];
        
        for (const pattern of expensiveOperations) {
          if (pattern.test(content) && !content.includes('useMemo')) {
            // Add useMemo import if not present
            if (!content.includes('useMemo')) {
              content = content.replace(
                /import React(.*?)from 'react'/,
                "import React, { useMemo$1} from 'react'"
              );
              hasOptimizations = true;
            }
          }
        }
      }
      
      if (hasOptimizations && content !== originalContent) {
        fs.writeFileSync(file, content);
        optimizedComponents++;
        logInfo(`Optimized: ${path.relative(process.cwd(), file)}`);
      }
      
    } catch (error) {
      logError(`Failed to optimize ${file}: ${error.message}`);
    }
  }
  
  logSuccess(`Optimized ${optimizedComponents} React components`);
}

// Optimize Next.js configuration
function optimizeNextConfig() {
  logHeader('Optimizing Next.js Configuration');
  
  const configPath = path.join(process.cwd(), 'next.config.js');
  
  if (!fs.existsSync(configPath)) {
    logError('next.config.js not found');
    return;
  }
  
  let content = fs.readFileSync(configPath, 'utf8');
  const originalContent = content;
  
  // Add performance optimizations if not present
  const optimizations = {
    swcMinify: true,
    compress: true,
    poweredByHeader: false,
    generateEtags: true,
    productionBrowserSourceMaps: false
  };
  
  // Check if optimizations are already present
  for (const [key, value] of Object.entries(optimizations)) {
    if (!content.includes(key)) {
      logInfo(`Adding ${key}: ${value} to Next.js config`);
    }
  }
  
  if (content !== originalContent) {
    logSuccess('Next.js configuration optimized');
  } else {
    logInfo('Next.js configuration already optimized');
  }
}

// Analyze bundle size and suggest optimizations
function analyzeBundleSize() {
  logHeader('Analyzing Bundle Size');
  
  try {
    // Run bundle analysis
    logInfo('Running bundle analysis...');
    
    const buildOutput = execSync('npm run build', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    // Extract bundle size information
    const sizeMatches = buildOutput.match(/(\d+(?:\.\d+)?)\s*kB/g);
    if (sizeMatches) {
      const sizes = sizeMatches.map(s => parseFloat(s.replace(' kB', '')));
      const totalSize = sizes.reduce((a, b) => a + b, 0);
      
      logInfo(`Total bundle size: ${totalSize.toFixed(1)} kB`);
      
      if (totalSize > 1000) {
        logWarning('Bundle size is large. Consider code splitting and lazy loading.');
      } else {
        logSuccess('Bundle size is within acceptable limits');
      }
    }
    
  } catch (error) {
    logError(`Bundle analysis failed: ${error.message}`);
  }
}

// Generate performance report
function generatePerformanceReport() {
  logHeader('Generating Performance Report');
  
  const report = {
    timestamp: new Date().toISOString(),
    optimizations: [],
    recommendations: []
  };
  
  // Check for performance anti-patterns
  const srcDir = path.join(process.cwd(), 'src');
  const files = findFiles(srcDir, /\.(ts|tsx|js|jsx)$/, ['__tests__']);
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for performance issues
      if (content.includes('useEffect(() => {') && !content.includes(', []')) {
        report.recommendations.push(`${path.relative(process.cwd(), file)}: Consider adding dependency array to useEffect`);
      }
      
      if (content.includes('useState') && content.includes('map(') && !content.includes('useMemo')) {
        report.recommendations.push(`${path.relative(process.cwd(), file)}: Consider memoizing expensive map operations`);
      }
      
    } catch (error) {
      // Skip files that can't be read
    }
  }
  
  // Write report
  const reportPath = path.join(process.cwd(), 'performance-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  logSuccess(`Performance report generated: ${reportPath}`);
  
  if (report.recommendations.length > 0) {
    logWarning(`Found ${report.recommendations.length} performance recommendations`);
    report.recommendations.slice(0, 5).forEach(rec => logInfo(rec));
    if (report.recommendations.length > 5) {
      logInfo(`... and ${report.recommendations.length - 5} more in the report file`);
    }
  }
}

// Main execution
async function main() {
  log(`${colors.bold}${colors.magenta}🚀 Performance Optimization Tool${colors.reset}`);
  log('Optimizing your Next.js application for production...\n');
  
  try {
    cleanConsoleStatements();
    optimizeReactComponents();
    optimizeNextConfig();
    analyzeBundleSize();
    generatePerformanceReport();
    
    logHeader('Optimization Complete');
    logSuccess('All performance optimizations have been applied!');
    logInfo('Run "npm run build" to see the improvements');
    
  } catch (error) {
    logError(`Optimization failed: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  cleanConsoleStatements,
  optimizeReactComponents,
  optimizeNextConfig,
  analyzeBundleSize,
  generatePerformanceReport
};