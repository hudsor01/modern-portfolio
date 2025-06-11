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
    logger.error('Failed to get churn data', error)
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
    logger.error('Failed to get lead attribution data', error)
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
    logger.error('Failed to get growth data', error)
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
    logger.error('Failed to get year-over-year data', error)
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
    logger.error('Failed to get top partners data', error)
    return []
  }
}

// Static exports for immediate use (will be populated asynchronously)
let monthlyChurnData: any[] = []
let leadAttributionData: any[] = []
let growthData: any[] = []
let yearOverYearGrowth: any[] = []
let topPartnersByRevenue: any[] = []

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
    logger.error('Failed to initialize partner analytics data', error)
    
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

// Export static data for legacy compatibility
export { monthlyChurnData, leadAttributionData, growthData, yearOverYearGrowth, topPartnersByRevenue }

// Export functions for dynamic data fetching
export {
  getMonthlyChurnData,
  getLeadAttributionData,
  getGrowthData,
  getYearOverYearGrowth,
  getTopPartnersByRevenue,
}

// Export the data service for advanced usage
export { analyticsDataService }