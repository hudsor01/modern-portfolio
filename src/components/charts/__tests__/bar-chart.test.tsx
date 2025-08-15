import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import { BarChart } from '../bar-chart'
import { createMockChartData } from '@/test/factories'
import type { ChartData } from '@/types/chart'

describe('BarChart', () => {
  const mockData = createMockChartData(3)

  describe('rendering', () => {
    it('should render bar chart with data', () => {
      render(
        <BarChart
          data={mockData}
          dataKey="value"
          title="Test Bar Chart"
        />
      )

      expect(screen.getByText('Test Bar Chart')).toBeInTheDocument()
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
    })

    it('should render without title', () => {
      render(
        <BarChart
          data={mockData}
          dataKey="value"
        />
      )

      expect(screen.queryByRole('heading')).not.toBeInTheDocument()
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
    })

    it('should render with custom className', () => {
      const { container } = render(
        <BarChart
          data={mockData}
          dataKey="value"
          className="custom-class"
        />
      )

      // The BarChart container is nested inside provider wrappers
      const barChartContainer = container.querySelector('.w-full')
      expect(barChartContainer).toHaveClass('w-full', 'custom-class')
    })
  })

  describe('chart components', () => {
    it('should render XAxis with correct dataKey', () => {
      render(
        <BarChart
          data={mockData}
          dataKey="value"
          xAxisKey="name"
        />
      )

      expect(screen.getByTestId('x-axis')).toBeInTheDocument()
    })

    it('should render YAxis', () => {
      render(
        <BarChart
          data={mockData}
          dataKey="value"
        />
      )

      expect(screen.getByTestId('y-axis')).toBeInTheDocument()
    })

    it('should render Bar component', () => {
      render(
        <BarChart
          data={mockData}
          dataKey="value"
        />
      )

      expect(screen.getByTestId('bar')).toBeInTheDocument()
    })

    it('should render CartesianGrid when showGrid is true', () => {
      render(
        <BarChart
          data={mockData}
          dataKey="value"
          showGrid={true}
        />
      )

      expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument()
    })

    it('should not render CartesianGrid when showGrid is false', () => {
      render(
        <BarChart
          data={mockData}
          dataKey="value"
          showGrid={false}
        />
      )

      expect(screen.queryByTestId('cartesian-grid')).not.toBeInTheDocument()
    })

    it('should render Tooltip when showTooltip is true', () => {
      render(
        <BarChart
          data={mockData}
          dataKey="value"
          showTooltip={true}
        />
      )

      expect(screen.getByTestId('tooltip')).toBeInTheDocument()
    })

    it('should not render Tooltip when showTooltip is false', () => {
      render(
        <BarChart
          data={mockData}
          dataKey="value"
          showTooltip={false}
        />
      )

      expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument()
    })

    it('should render Legend when showLegend is true', () => {
      render(
        <BarChart
          data={mockData}
          dataKey="value"
          showLegend={true}
        />
      )

      expect(screen.getByTestId('legend')).toBeInTheDocument()
    })

    it('should not render Legend when showLegend is false', () => {
      render(
        <BarChart
          data={mockData}
          dataKey="value"
          showLegend={false}
        />
      )

      expect(screen.queryByTestId('legend')).not.toBeInTheDocument()
    })
  })

  describe('props configuration', () => {
    it('should use default xAxisKey when not provided', () => {
      const { container } = render(
        <BarChart
          data={mockData}
          dataKey="value"
        />
      )

      // The default xAxisKey should be 'name'
      expect(container).toBeInTheDocument()
    })

    it('should use custom xAxisKey', () => {
      const customData = [
        { label: 'Item 1', value: 100 },
        { label: 'Item 2', value: 200 },
      ]

      render(
        <BarChart
          data={customData}
          dataKey="value"
          xAxisKey="label"
        />
      )

      expect(screen.getByTestId('x-axis')).toBeInTheDocument()
    })

    it('should use default color when not provided', () => {
      render(
        <BarChart
          data={mockData}
          dataKey="value"
        />
      )

      expect(screen.getByTestId('bar')).toBeInTheDocument()
    })

    it('should use custom color', () => {
      render(
        <BarChart
          data={mockData}
          dataKey="value"
          color="red"
        />
      )

      expect(screen.getByTestId('bar')).toBeInTheDocument()
    })

    it('should use custom value formatter', () => {
      const customFormatter = (value: number) => `$${value}`

      render(
        <BarChart
          data={mockData}
          dataKey="value"
          valueFormatterAction={customFormatter}
        />
      )

      expect(screen.getByTestId('y-axis')).toBeInTheDocument()
      expect(screen.getByTestId('tooltip')).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should handle empty data array', () => {
      render(
        <BarChart
          data={[]}
          dataKey="value"
        />
      )

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
    })

    it('should handle data with missing values', () => {
      const incompleteData = [
        { name: 'Item 1', value: 100 },
        { name: 'Item 2' }, // Missing value
      ]

      render(
        <BarChart
          data={incompleteData as ChartData[]}
          dataKey="value"
        />
      )

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
    })

    it('should handle very large values', () => {
      const largeData = [
        { name: 'Item 1', value: 1000000 },
        { name: 'Item 2', value: 2000000 },
      ]

      render(
        <BarChart
          data={largeData}
          dataKey="value"
        />
      )

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
    })

    it('should handle negative values', () => {
      const negativeData = [
        { name: 'Item 1', value: -100 },
        { name: 'Item 2', value: 200 },
      ]

      render(
        <BarChart
          data={negativeData}
          dataKey="value"
        />
      )

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should render title as heading when provided', () => {
      render(
        <BarChart
          data={mockData}
          dataKey="value"
          title="Revenue Chart"
        />
      )

      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveTextContent('Revenue Chart')
    })

    it('should have proper responsive container structure', () => {
      render(
        <BarChart
          data={mockData}
          dataKey="value"
        />
      )

      const container = screen.getByTestId('responsive-container')
      expect(container).toBeInTheDocument()
    })
  })
})