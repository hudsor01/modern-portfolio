import { describe, it, expect } from 'vitest'
import {
  formatValue,
  formatters,
  isValidChartData,
  isRevenueData,
  isFunnelData,
  isLeadSourceData,
  generateChartColors,
  transformToChartData,
  transformToRevenueData,
  buildChartConfig,
  ChartDataError,
  validateChartData,
  chartThemeConfig,
} from '../chart-utils'
import { CHART_FORMAT_TYPES } from '@/types/chart'
import type { ChartData, RevenueData, FunnelStageData, LeadSourceData } from '@/types/chart'

describe('chart-utils', () => {
  describe('formatters', () => {
    describe('DEFAULT formatter', () => {
      it('should format numbers as strings', () => {
        expect(formatters.default(123)).toBe('123')
        expect(formatters.default(0)).toBe('0')
        expect(formatters.default(999.99)).toBe('999.99')
      })
    })

    describe('CURRENCY formatter', () => {
      it('should format small amounts with no decimals', () => {
        expect(formatters.currency(100)).toBe('$100')
        expect(formatters.currency(999)).toBe('$999')
      })

      it('should format large amounts with minimal decimals', () => {
        expect(formatters.currency(1000000)).toBe('$1,000,000.0')
        expect(formatters.currency(1500000)).toBe('$1,500,000.0')
      })

      it('should handle zero and negative values', () => {
        expect(formatters.currency(0)).toBe('$0')
        expect(formatters.currency(-100)).toBe('-$100')
      })
    })

    describe('PERCENTAGE formatter', () => {
      it('should format decimal percentages correctly', () => {
        expect(formatters.percentage(0.25)).toBe('25.0%')
        expect(formatters.percentage(0.333)).toBe('33.3%')
        expect(formatters.percentage(1)).toBe('100.0%')
        expect(formatters.percentage(0)).toBe('0.0%')
      })
    })

    describe('THOUSANDS formatter', () => {
      it('should format thousands with K suffix', () => {
        expect(formatters.thousands(1000)).toBe('1.0K')
        expect(formatters.thousands(1500)).toBe('1.5K')
        expect(formatters.thousands(999)).toBe('999')
      })
    })

    describe('COMPACT formatter', () => {
      it('should format millions with M suffix', () => {
        expect(formatters.compact(1000000)).toBe('1.0M')
        expect(formatters.compact(2500000)).toBe('2.5M')
      })

      it('should format thousands with K suffix', () => {
        expect(formatters.compact(1000)).toBe('1.0K')
        expect(formatters.compact(1500)).toBe('1.5K')
      })

      it('should return raw number for small values', () => {
        expect(formatters.compact(999)).toBe('999')
        expect(formatters.compact(100)).toBe('100')
      })
    })
  })

  describe('formatValue', () => {
    it('should use default formatter when no format specified', () => {
      expect(formatValue(123)).toBe('123')
    })

    it('should use specified formatter', () => {
      expect(formatValue(0.25, CHART_FORMAT_TYPES.PERCENTAGE)).toBe('25.0%')
      expect(formatValue(1000, CHART_FORMAT_TYPES.THOUSANDS)).toBe('1.0K')
      expect(formatValue(100, CHART_FORMAT_TYPES.CURRENCY)).toBe('$100')
    })
  })

  describe('data validators', () => {
    describe('isValidChartData', () => {
      it('should validate correct chart data', () => {
        const validData = [
          { name: 'Item 1', value: 100 },
          { name: 'Item 2', value: 200 },
        ]
        expect(isValidChartData(validData)).toBe(true)
      })

      it('should reject invalid chart data', () => {
        expect(isValidChartData([])).toBe(true) // Empty array is valid
        expect(isValidChartData([{ name: 'Item 1' }])).toBe(false) // Missing value
        expect(isValidChartData([{ value: 100 }])).toBe(false) // Missing name
        expect(isValidChartData([{ name: 123, value: 100 }])).toBe(false) // Wrong name type
        expect(isValidChartData([{ name: 'Item 1', value: 'invalid' }])).toBe(false) // Wrong value type
        expect(isValidChartData('not an array')).toBe(false)
      })
    })

    describe('isRevenueData', () => {
      it('should validate correct revenue data', () => {
        const validRevenueData: RevenueData[] = [
          {
            name: 'Q1',
            value: 100000,
            revenue: 100000,
            period: new Date('2024-01-01'),
            id: '1',
            metadata: { source: 'test' },
          },
        ]
        expect(isRevenueData(validRevenueData)).toBe(true)
      })

      it('should reject invalid revenue data', () => {
        const invalidRevenueData = [
          { name: 'Q1', value: 100, revenue: 100 }, // Missing period
        ]
        expect(isRevenueData(invalidRevenueData)).toBe(false)
      })
    })

    describe('isFunnelData', () => {
      it('should validate correct funnel data', () => {
        const validFunnelData: FunnelStageData[] = [
          {
            name: 'Leads',
            value: 1000,
            stage: 'Leads',
            count: 1000,
            id: '1',
            metadata: { source: 'test' },
          },
        ]
        expect(isFunnelData(validFunnelData)).toBe(true)
      })

      it('should reject invalid funnel data', () => {
        const invalidFunnelData = [
          { name: 'Leads', value: 1000 }, // Missing stage and count
        ]
        expect(isFunnelData(invalidFunnelData)).toBe(false)
      })
    })

    describe('isLeadSourceData', () => {
      it('should validate correct lead source data', () => {
        const validLeadSourceData: LeadSourceData[] = [
          {
            name: 'Google',
            value: 100,
            source: 'Google',
            leads: 1000,
            conversions: 100,
            conversionRate: 0.1,
            id: '1',
            metadata: { source: 'test' },
          },
        ]
        expect(isLeadSourceData(validLeadSourceData)).toBe(true)
      })

      it('should reject invalid lead source data', () => {
        const invalidLeadSourceData = [
          { name: 'Google', value: 100, source: 'Google' }, // Missing leads, conversions, conversionRate
        ]
        expect(isLeadSourceData(invalidLeadSourceData)).toBe(false)
      })
    })
  })

  describe('generateChartColors', () => {
    it('should generate correct number of colors', () => {
      expect(generateChartColors(3)).toHaveLength(3)
      expect(generateChartColors(5)).toHaveLength(5)
      expect(generateChartColors(10)).toHaveLength(10)
    })

    it('should use base colors for small counts', () => {
      const colors = generateChartColors(3)
      expect(colors[0]).toBe('hsl(var(--chart-1))')
      expect(colors[1]).toBe('hsl(var(--chart-2))')
      expect(colors[2]).toBe('hsl(var(--chart-3))')
    })

    it('should generate variations for large counts', () => {
      const colors = generateChartColors(7)
      expect(colors).toHaveLength(7)
      expect(colors[0]).toBe('hsl(var(--chart-1))')
      expect(colors[5]).toContain('hsl(var(--chart-1))')
      expect(colors[5]).toContain('/')
    })
  })

  describe('transformToChartData', () => {
    it('should transform generic data to chart data', () => {
      const inputData = [
        { label: 'Item 1', amount: 100, extra: 'data' },
        { label: 'Item 2', amount: 200, extra: 'more' },
      ]

      const result = transformToChartData(inputData, 'label', 'amount')

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        name: 'Item 1',
        value: 100,
        id: '0',
        metadata: { source: 'Data transformation utility' },
      })
      expect(result[1]).toEqual({
        name: 'Item 2',
        value: 200,
        id: '1',
        metadata: { source: 'Data transformation utility' },
      })
    })

    it('should handle invalid values gracefully', () => {
      const inputData = [
        { label: 'Item 1', amount: 'invalid' },
        { label: 'Item 2', amount: null },
      ]

      const result = transformToChartData(inputData, 'label', 'amount')

      expect(result[0]?.value).toBe(0)
      expect(result[1]?.value).toBe(0)
    })
  })

  describe('transformToRevenueData', () => {
    it('should transform generic data to revenue data', () => {
      const inputData = [
        {
          quarter: 'Q1 2024',
          sales: 100000,
          date: '2024-01-01',
          growthRate: 0.15,
        },
      ]

      const result = transformToRevenueData(
        inputData,
        'quarter',
        'sales',
        'date',
        'growthRate'
      )

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        name: 'Q1 2024',
        value: 100000,
        revenue: 100000,
        period: new Date('2024-01-01'),
        growth: 0.15,
        id: '0',
        metadata: { source: 'Revenue data transformation' },
      })
    })

    it('should work without growth key', () => {
      const inputData = [
        { quarter: 'Q1 2024', sales: 100000, date: '2024-01-01' },
      ]

      const result = transformToRevenueData(inputData, 'quarter', 'sales', 'date')

      expect(result[0]?.growth).toBeUndefined()
    })
  })

  describe('buildChartConfig', () => {
    const mockData: ChartData[] = [
      { name: 'Item 1', value: 100, id: '1', metadata: { source: 'test' } },
      { name: 'Item 2', value: 200, id: '2', metadata: { source: 'test' } },
    ]

    it('should build default chart configuration', () => {
      const config = buildChartConfig(mockData)

      expect(config.data).toHaveLength(2)
      expect(config.data[0]).toHaveProperty('fill')
      expect(config.data[0]).toHaveProperty('color')
      expect(config.colors).toHaveLength(2)
      expect(typeof config.formatValue).toBe('function')
      expect(config.theme).toBe(chartThemeConfig)
      expect(config.options.showGrid).toBe(true)
      expect(config.options.showLegend).toBe(true)
    })

    it('should use custom options', () => {
      const customColors = ['red', 'blue']
      const config = buildChartConfig(mockData, {
        colors: customColors,
        formatType: CHART_FORMAT_TYPES.CURRENCY,
        showGrid: false,
        showLegend: false,
      })

      expect(config.colors).toBe(customColors)
      expect(config.formatValue(100)).toBe('$100')
      expect(config.options.showGrid).toBe(false)
      expect(config.options.showLegend).toBe(false)
    })
  })

  describe('error handling', () => {
    describe('ChartDataError', () => {
      it('should create proper error instance', () => {
        const error = new ChartDataError('Test error', { test: 'data' })

        expect(error).toBeInstanceOf(Error)
        expect(error).toBeInstanceOf(ChartDataError)
        expect(error.message).toBe('Chart Data Error: Test error')
        expect(error.name).toBe('ChartDataError')
        expect(error.data).toEqual({ test: 'data' })
      })
    })

    describe('validateChartData', () => {
      it('should validate data successfully', () => {
        const validData = [
          { name: 'Item 1', value: 100 },
          { name: 'Item 2', value: 200 },
        ]

        const result = validateChartData(validData, isValidChartData)
        expect(result).toEqual(validData)
      })

      it('should throw error for non-array data', () => {
        expect(() => {
          validateChartData('not an array', isValidChartData)
        }).toThrow(ChartDataError)

        expect(() => {
          validateChartData('not an array', isValidChartData)
        }).toThrow('Data must be an array')
      })

      it('should throw error for invalid data structure', () => {
        const invalidData = [{ name: 'Item 1' }] // Missing value

        expect(() => {
          validateChartData(invalidData, isValidChartData)
        }).toThrow(ChartDataError)

        expect(() => {
          validateChartData(invalidData, isValidChartData)
        }).toThrow('Data does not match expected chart data structure')
      })
    })
  })

  describe('chartThemeConfig', () => {
    it('should have proper structure', () => {
      expect(chartThemeConfig).toHaveProperty('colors')
      expect(chartThemeConfig).toHaveProperty('spacing')
      expect(chartThemeConfig).toHaveProperty('fonts')

      expect(chartThemeConfig.colors).toHaveProperty('primary')
      expect(Array.isArray(chartThemeConfig.colors.primary)).toBe(true)
      expect(chartThemeConfig.colors.primary).toHaveLength(5)

      expect(chartThemeConfig.spacing).toHaveProperty('xs', 4)
      expect(chartThemeConfig.spacing).toHaveProperty('sm', 8)
      expect(chartThemeConfig.spacing).toHaveProperty('md', 16)
      expect(chartThemeConfig.spacing).toHaveProperty('lg', 24)

      expect(chartThemeConfig.fonts).toHaveProperty('family')
      expect(chartThemeConfig.fonts).toHaveProperty('sizes')
    })
  })
})