// Export all partner analytics data from a single file
export * from './top-partners';
export * from './partner-groups';
export * from './growth-data';

// Export project-specific analytics
export * from './churn-analysis/retention-data';
export * from './deal-analysis/funnel-data';
export * from './lead-analysis/attribution-data';

// The detailed transaction data from PartnerRecordExport_transactions_20241101.csv
// is quite large with 5644 rows, so we're only exposing aggregated and analyzed
// data represented in the more manageable exported files above.
