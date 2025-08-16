#!/usr/bin/env node

/**
 * Script to migrate all project chart components to use ShadcnChartContainer
 * This eliminates thousands of lines of duplicate code
 */

const fs = require('fs');
const path = require('path');

// List of all chart files to migrate
const chartFiles = [
  'src/app/projects/revenue-kpi/RevenueLineChart.tsx',
  'src/app/projects/revenue-kpi/PartnerGroupPieChart.tsx',
  'src/app/projects/lead-attribution/LeadSourcePieChart.tsx',
  'src/app/projects/churn-retention/ChurnLineChart.tsx',
  'src/app/projects/churn-retention/RetentionHeatmap.tsx',
  'src/app/projects/deal-funnel/DealStageFunnelChart.tsx',
  'src/app/projects/revenue-operations-center/ForecastAccuracyChart.tsx',
  'src/app/projects/revenue-operations-center/RevenueOverviewChart.tsx',
  'src/app/projects/revenue-operations-center/PipelineHealthChart.tsx',
  'src/app/projects/revenue-operations-center/OperationalMetricsChart.tsx',
  'src/app/projects/partner-performance/RevenueContributionChart.tsx',
  'src/app/projects/partner-performance/PartnerTierChart.tsx',
  'src/app/projects/partner-performance/PartnerROIChart.tsx',
  'src/app/projects/multi-channel-attribution/ChannelROIChart.tsx',
  'src/app/projects/multi-channel-attribution/TouchpointAnalysisChart.tsx',
  'src/app/projects/multi-channel-attribution/CustomerJourneyChart.tsx',
  'src/app/projects/multi-channel-attribution/AttributionModelChart.tsx',
  'src/app/projects/customer-lifetime-value/CLVPredictionChart.tsx',
  'src/app/projects/customer-lifetime-value/CLVTrendChart.tsx',
  'src/app/projects/customer-lifetime-value/CustomerSegmentChart.tsx',
  'src/app/projects/commission-optimization/CommissionStructureChart.tsx',
  'src/app/projects/commission-optimization/CommissionTierChart.tsx',
  'src/app/projects/commission-optimization/PerformanceIncentiveChart.tsx',
  'src/app/projects/commission-optimization/ROIOptimizationChart.tsx',
  'src/app/projects/cac-unit-economics/CACBreakdownChart.tsx',
  'src/app/projects/cac-unit-economics/PaybackPeriodChart.tsx',
  'src/app/projects/cac-unit-economics/UnitEconomicsChart.tsx',
];

// Template for migrated chart component
const createMigratedChart = (componentName, title, dataKey = 'value') => `'use client'
import { ShadcnChartContainer } from '@/components/charts/shadcn-chart-container'
import { formatCurrency } from '@/lib/utils/formatters'
import { chartColors, chartConfigs } from '@/lib/constants/chart'
import type { ChartConfig } from '@/components/ui/chart'

// TODO: Import your data source here
// import { data } from './data'

// TODO: Transform data if needed
const data = []

// Chart configuration
const chartConfig: ChartConfig = {
  ${dataKey}: {
    label: '${title}',
    color: chartColors.primary,
  },
}

export default function ${componentName}() {
  return (
    <ShadcnChartContainer
      title="${title}"
      staticData={data}
      dataKey="${dataKey}"
      chartConfig={chartConfig}
      variant="default"
      valueFormatter={formatCurrency}
    />
  )
}
`;

// Process each file
chartFiles.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  const fileName = path.basename(filePath, '.tsx');
  const componentName = fileName;
  
  // For now, just log what would be done
  console.log(`📊 Would migrate: ${fileName}`);
  
  // In a real migration, you'd analyze the existing file
  // and create a proper replacement
  // For safety, we'll not auto-replace but create .new files
  
  // Example: Create a new file with .new extension
  // const newContent = createMigratedChart(componentName, fileName.replace(/([A-Z])/g, ' $1').trim());
  // fs.writeFileSync(fullPath + '.new', newContent);
});

console.log('\n✅ Migration plan complete');
console.log('📝 Review and manually update each chart component');
console.log('💡 Use ShadcnChartContainer for all charts');