import { test, expect } from 'bun:test'
import { readdirSync, readFileSync } from 'fs'
import path from 'path'

const chartHexPattern = /#[0-9a-fA-F]{3,8}/
const legacyChartTokenPattern = /--chart-/

function collectChartFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...collectChartFiles(entryPath))
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.tsx') && entry.name.includes('Chart')) {
      files.push(entryPath)
    }
  }

  return files
}

test('project charts do not use hex colors or legacy chart tokens', () => {
  const srcRoot = path.resolve(import.meta.dir, '..')
  const projectsDir = path.join(srcRoot, 'app', 'projects')
  const chartFiles = collectChartFiles(projectsDir)

  const violations: Array<{ file: string; reason: string }> = []

  for (const filePath of chartFiles) {
    const contents = readFileSync(filePath, 'utf-8')
    if (chartHexPattern.test(contents)) {
      violations.push({ file: filePath, reason: 'hex color detected' })
    }
    if (legacyChartTokenPattern.test(contents)) {
      violations.push({ file: filePath, reason: 'legacy --chart-* token detected' })
    }
  }

  if (violations.length) {
    const message = violations
      .map((violation) => `${violation.file}: ${violation.reason}`)
      .join('\n')
    expect(message).toBe('')
  }

  expect(violations).toHaveLength(0)
})
