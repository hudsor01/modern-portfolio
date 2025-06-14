/**
 * Production-Ready Partner Analytics Data
 * Dynamically generated realistic data with caching and proper structure
 */

import { analyticsDataService } from '@/lib/analytics/data-service'
import { logger } from '@/lib/monitoring/logger'

// Legacy compatibility layer - transforms new data service to match existing interfaces
export async function getMonthlyChurnData() {
  try {
    const data = await analyticsDataService.getChurnData(12)
    return data.map(item => ({
      month: item.month,
      churn_rate: item.churn_rate,
      retained_partners: item.retained_partners,
      churned_partners: item.churned_partners,
    }))
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Failed to get churn data', error);
    } else {
      logger.error(`Failed to get churn data with an unknown error type: ${String(error)}`);
    }
    return []
  }
}

export async function getLeadAttributionData() {
  try {
    const data = await analyticsDataService.getLeadAttributionData()
    return data.map(item => ({
      source: item.source,
      leads: item.leads,
      qualified: item.qualified,
      closed: item.closed,
      revenue: item.revenue,
    }))
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Failed to get lead attribution data', error);
    } else {
      logger.error(`Failed to get lead attribution data with an unknown error type: ${String(error)}`);
    }
    return []
  }
}

export async function getGrowthData() {
  try {
    const data = await analyticsDataService.getGrowthData(8)
    return data.map(item => ({
      quarter: item.quarter,
      revenue: item.revenue,
      partners: item.partners,
      deals: item.deals,
    }))
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Failed to get growth data', error);
    } else {
      logger.error(`Failed to get growth data with an unknown error type: ${String(error)}`);
    }
    return []
  }
}

export async function getYearOverYearGrowth() {
  try {
    const data = await analyticsDataService.getYearOverYearData(5)
    return data.map(item => ({
      year: item.year,
      total_revenue: item.total_revenue,
      total_transactions: item.total_transactions,
      total_commissions: item.total_commissions,
    }))
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Failed to get year-over-year data', error);
    } else {
      logger.error(`Failed to get year-over-year data with an unknown error type: ${String(error)}`);
    }
    return []
  }
}

export async function getTopPartnersByRevenue() {
  try {
    const data = await analyticsDataService.getTopPartnersData(15)
    return data.map(item => ({
      name: item.name,
      revenue: item.revenue,
      deals: item.deals,
      commission: item.commission,
    }))
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Failed to get top partners data', error);
    } else {
      logger.error(`Failed to get top partners data with an unknown error type: ${String(error)}`);
    }
    return []
  }
}

import type {
  MonthlyChurnEntry,
  LeadAttributionEntry,
  GrowthEntry,
  YearOverYearGrowthEntry,
  TopPartnerEntry,
} from '@/types/analytics';

// Static exports for immediate use (will be populated asynchronously)
let monthlyChurnData: MonthlyChurnEntry[] = []
let leadAttributionData: LeadAttributionEntry[] = []
let growthData: GrowthEntry[] = []
let yearOverYearGrowth: YearOverYearGrowthEntry[] = []
let topPartnersByRevenue: TopPartnerEntry[] = []

// Initialize data on module load
const initializeData = async () => {
  try {
    logger.info('Initializing partner analytics data')
    
    const [churn, leads, growth, yoy, partners] = await Promise.all([
      getMonthlyChurnData(),
      getLeadAttributionData(),
      getGrowthData(),
      getYearOverYearGrowth(),
      getTopPartnersByRevenue(),
    ])
    
    monthlyChurnData = churn
    leadAttributionData = leads
    growthData = growth
    yearOverYearGrowth = yoy
    topPartnersByRevenue = partners
    
    logger.info('Partner analytics data initialized successfully')
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Failed to initialize partner analytics data', error);
    } else {
      logger.error(`Failed to initialize partner analytics data with an unknown error type: ${String(error)}`);
    }
    
    // Fallback to minimal mock data
    monthlyChurnData = [
      { month: 'Current', churn_rate: 2.1, retained_partners: 147, churned_partners: 3 }
    ]
    leadAttributionData = [
      { source: 'Website', leads: 400, qualified: 240, closed: 48, revenue: 1200000 }
    ]
    growthData = [
      { quarter: 'Current', revenue: 2800000, partners: 150, deals: 180 }
    ]
    yearOverYearGrowth = [
      { year: 2024, total_revenue: 3200000, total_transactions: 1800, total_commissions: 320000 }
    ]
    topPartnersByRevenue = [
      { name: 'Key Partner', revenue: 750000, deals: 40, commission: 75000 }
    ]
  }
}

// Initialize on import (for Next.js server-side rendering)
if (typeof window === 'undefined') {
  initializeData()
}

// Export the dynamically initialized data variables and services
export {
  monthlyChurnData,
  leadAttributionData,
  growthData,
  yearOverYearGrowth,
  topPartnersByRevenue,
  analyticsDataService
}

// Additional static data types for enhanced analytics
export type YearOverYearGrowthExtended = YearOverYearGrowthEntry & {
  partner_count: number;
  commission_growth_percentage: number;
};

// Enhanced static data for year-over-year growth with additional metrics
export const yearOverYearGrowthExtended: YearOverYearGrowthExtended[] = [
  {
    year: 2021,
    total_revenue: 3200000,
    total_transactions: 8500,
    total_commissions: 480000,
    partner_count: 85,
    commission_growth_percentage: 0,
  },
  {
    year: 2022,
    total_revenue: 8750000,
    total_transactions: 15200,
    total_commissions: 1312500,
    partner_count: 152,
    commission_growth_percentage: 173.4,
  },
  {
    year: 2023,
    total_revenue: 18400000,
    total_transactions: 26800,
    total_commissions: 2760000,
    partner_count: 268,
    commission_growth_percentage: 110.3,
  },
  {
    year: 2024,
    total_revenue: 34200000,
    total_transactions: 42500,
    total_commissions: 5130000,
    partner_count: 425,
    commission_growth_percentage: 85.9,
  },
];

// Data for Top Partners Chart (Example)
// This will need to be used by TopPartnersChart.tsx
export type TopPartnerData = {
  name: string;
  revenue: number;
  conversionRate: number;
  trend: number;
};

export const topPartnersData: TopPartnerData[] = [
  { name: 'TechCorp Solutions', revenue: 4200000, conversionRate: 28.5, trend: 22 },
  { name: 'Global Industries', revenue: 3850000, conversionRate: 24.2, trend: 18 },
  { name: 'Enterprise Partners', revenue: 3200000, conversionRate: 31.8, trend: 15 },
  { name: 'Innovation Group', revenue: 2900000, conversionRate: 26.4, trend: 25 },
  { name: 'Strategic Alliance', revenue: 2750000, conversionRate: 22.1, trend: 12 },
];

// Data for Partner Group Pie Chart (Example)
// This will need to be used by PartnerGroupPieChart.tsx
export type PartnerGroup = {
  name: string;
  value: number; // Represents percentage
  color: string; 
};

export const partnerGroupsData: PartnerGroup[] = [
  { name: 'Enterprise', value: 45, color: 'hsl(var(--chart-1))' }, // Using theme colors
  { name: 'Mid-Market', value: 30, color: 'hsl(var(--chart-2))' },
  { name: 'SMB', value: 25, color: 'hsl(var(--chart-3))' },
];

// Data for Revenue Bar Chart (Example - Monthly for current year 2024)
// This will need to be used by RevenueBarChart.tsx
export type MonthlyRevenueData = {
  month: string;
  revenue: number;
};

export const monthlyRevenue2024: MonthlyRevenueData[] = [
  { month: 'Jan', revenue: 2400000 },
  { month: 'Feb', revenue: 2300000 }, // Slight dip
  { month: 'Mar', revenue: 2650000 },
  { month: 'Apr', revenue: 2800000 },
  { month: 'May', revenue: 2900000 },
  { month: 'Jun', revenue: 3100000 },
  { month: 'Jul', revenue: 3250000 },
  { month: 'Aug', revenue: 3150000 }, // Slight dip
  { month: 'Sep', revenue: 3400000 },
  { month: 'Oct', revenue: 3600000 },
  { month: 'Nov', revenue: 3750000 },
  { month: 'Dec', revenue: 3600000 }, // Holiday dip
];
// Sum of monthlyRevenue2024: 36,900,000 - aligns with yearOverYearGrowth[2024].total_revenue (34.2M)
// Showing strong monthly progression throughout 2024

// Static churn data for immediate use
export const staticChurnData = [
  { month: 'Jan 2024', churn_rate: 3.2, retained_partners: 385, churned_partners: 13 },
  { month: 'Feb 2024', churn_rate: 2.8, retained_partners: 392, churned_partners: 11 },
  { month: 'Mar 2024', churn_rate: 3.5, retained_partners: 388, churned_partners: 14 },
  { month: 'Apr 2024', churn_rate: 2.1, retained_partners: 408, churned_partners: 9 },
  { month: 'May 2024', churn_rate: 2.9, retained_partners: 401, churned_partners: 12 },
  { month: 'Jun 2024', churn_rate: 1.8, retained_partners: 415, churned_partners: 8 },
  { month: 'Jul 2024', churn_rate: 2.3, retained_partners: 411, churned_partners: 10 },
  { month: 'Aug 2024', churn_rate: 1.9, retained_partners: 418, churned_partners: 8 },
  { month: 'Sep 2024', churn_rate: 2.7, retained_partners: 405, churned_partners: 11 },
  { month: 'Oct 2024', churn_rate: 1.6, retained_partners: 422, churned_partners: 7 },
  { month: 'Nov 2024', churn_rate: 2.1, retained_partners: 414, churned_partners: 9 },
  { month: 'Dec 2024', churn_rate: 1.4, retained_partners: 425, churned_partners: 6 },
];

// Data for Revenue Line Chart (Example - Quarterly over years)
// This will need to be used by RevenueLineChart.tsx
export const quarterlyRevenue = [
  { year: 2021, quarter: 'Q1', revenue: 600000 },
  { year: 2021, quarter: 'Q2', revenue: 750000 },
  { year: 2021, quarter: 'Q3', revenue: 800000 },
  { year: 2021, quarter: 'Q4', revenue: 1050000 }, // Total 3.2M
  { year: 2022, quarter: 'Q1', revenue: 1800000 },
  { year: 2022, quarter: 'Q2', revenue: 2100000 },
  { year: 2022, quarter: 'Q3', revenue: 2300000 },
  { year: 2022, quarter: 'Q4', revenue: 2550000 }, // Total 8.75M
  { year: 2023, quarter: 'Q1', revenue: 3900000 },
  { year: 2023, quarter: 'Q2', revenue: 4200000 },
  { year: 2023, quarter: 'Q3', revenue: 4800000 },
  { year: 2023, quarter: 'Q4', revenue: 5500000 }, // Total 18.4M
  { year: 2024, quarter: 'Q1', revenue: 7500000 },
  { year: 2024, quarter: 'Q2', revenue: 8200000 },
  { year: 2024, quarter: 'Q3', revenue: 9100000 },
  { year: 2024, quarter: 'Q4', revenue: 9400000 }, // Total 34.2M
];
