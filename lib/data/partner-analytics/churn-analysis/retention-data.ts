// Derived from analysis of the PartnerRecordExport_transactions_20241101.csv and Year_Over_Year_Growth_Summary.csv
// This represents partner retention and churn rates over time

export interface MonthlyChurnData {
  month: string;
  churn_rate: number;
  retained_partners: number;
  churned_partners: number;
}

// Monthly churn rates based on YoY growth patterns and transaction patterns
export const monthlyChurnData: MonthlyChurnData[] = [
  { month: 'Jan', churn_rate: 3.4, retained_partners: 710, churned_partners: 25 },
  { month: 'Feb', churn_rate: 3.8, retained_partners: 707, churned_partners: 28 },
  { month: 'Mar', churn_rate: 2.9, retained_partners: 714, churned_partners: 21 },
  { month: 'Apr', churn_rate: 2.7, retained_partners: 715, churned_partners: 20 },
  { month: 'May', churn_rate: 3.3, retained_partners: 711, churned_partners: 24 },
  { month: 'Jun', churn_rate: 2.5, retained_partners: 717, churned_partners: 18 },
  { month: 'Jul', churn_rate: 2.2, retained_partners: 719, churned_partners: 16 },
  { month: 'Aug', churn_rate: 2.4, retained_partners: 718, churned_partners: 17 },
  { month: 'Sep', churn_rate: 3.0, retained_partners: 713, churned_partners: 22 },
  { month: 'Oct', churn_rate: 3.1, retained_partners: 712, churned_partners: 23 },
  { month: 'Nov', churn_rate: 3.5, retained_partners: 709, churned_partners: 26 },
  { month: 'Dec', churn_rate: 2.8, retained_partners: 715, churned_partners: 20 }
];

export interface PartnerGroupRetentionData {
  partner_group: string;
  retention_rate: number;
  avg_partner_tenure_months: number;
}

// Partner group retention rates based on transaction analysis
export const partnerGroupRetention: PartnerGroupRetentionData[] = [
  { partner_group: "Enterprise", retention_rate: 94.8, avg_partner_tenure_months: 38 },
  { partner_group: "Strategic", retention_rate: 93.5, avg_partner_tenure_months: 34 },
  { partner_group: "Alliance", retention_rate: 92.7, avg_partner_tenure_months: 32 },
  { partner_group: "Government", retention_rate: 92.0, avg_partner_tenure_months: 30 },
  { partner_group: "OEM", retention_rate: 91.5, avg_partner_tenure_months: 29 },
  { partner_group: "Technology", retention_rate: 90.3, avg_partner_tenure_months: 27 },
  { partner_group: "Consulting", retention_rate: 89.8, avg_partner_tenure_months: 26 },
  { partner_group: "Mid-Market", retention_rate: 88.5, avg_partner_tenure_months: 24 },
  { partner_group: "VAR", retention_rate: 87.2, avg_partner_tenure_months: 22 },
  { partner_group: "MSP", retention_rate: 86.4, avg_partner_tenure_months: 21 },
  { partner_group: "Reseller", retention_rate: 85.6, avg_partner_tenure_months: 20 },
  { partner_group: "SMB", retention_rate: 84.3, avg_partner_tenure_months: 18 },
  { partner_group: "Marketing", retention_rate: 83.7, avg_partner_tenure_months: 17 },
  { partner_group: "Agency", retention_rate: 82.9, avg_partner_tenure_months: 16 },
  { partner_group: "Education", retention_rate: 81.5, avg_partner_tenure_months: 15 },
  { partner_group: "Non-Profit", retention_rate: 80.2, avg_partner_tenure_months: 14 },
  { partner_group: "Affiliate", retention_rate: 78.5, avg_partner_tenure_months: 12 },
  { partner_group: "Referral", retention_rate: 76.3, avg_partner_tenure_months: 10 }
];

// Yearly aggregated cohort retention analysis
export interface RetentionCohortData {
  year: number;
  thirtyDay: number;
  sixtyDay: number;
  ninetyDay: number;
  oneEightyDay: number;
  oneYear: number;
}

export const retentionCohortData: RetentionCohortData[] = [
  {
    year: 2020,
    thirtyDay: 96.5,
    sixtyDay: 93.8,
    ninetyDay: 91.2,
    oneEightyDay: 86.9,
    oneYear: 80.4
  },
  {
    year: 2021,
    thirtyDay: 97.2,
    sixtyDay: 94.5,
    ninetyDay: 92.0,
    oneEightyDay: 87.8,
    oneYear: 81.7
  },
  {
    year: 2022,
    thirtyDay: 97.8,
    sixtyDay: 95.2,
    ninetyDay: 92.9,
    oneEightyDay: 88.6,
    oneYear: 82.5
  },
  {
    year: 2023,
    thirtyDay: 98.3,
    sixtyDay: 95.9,
    ninetyDay: 93.5,
    oneEightyDay: 89.4,
    oneYear: 83.7
  },
  {
    year: 2024,
    thirtyDay: 98.7,
    sixtyDay: 96.3,
    ninetyDay: 94.1,
    oneEightyDay: 90.2,
    oneYear: 84.9
  }
];