export interface PartnerGroupTransactions {
  partner_group: string;
  transaction_volume: number;
  total_transaction_amount: number;
}

export interface PartnerGroupCommission {
  partner_group: string;
  commission_amount: number;
}

// Data from Total_Transaction_Volume_and_Amount_by_Partner_Group.csv
export const partnerGroupTransactions: PartnerGroupTransactions[] = [
  {
    partner_group: "Enterprise",
    transaction_volume: 1240,
    total_transaction_amount: 3750000
  },
  {
    partner_group: "Mid-Market",
    transaction_volume: 1860,
    total_transaction_amount: 2650000
  },
  {
    partner_group: "SMB",
    transaction_volume: 2544,
    total_transaction_amount: 1350000
  },
  {
    partner_group: "Agency",
    transaction_volume: 1358,
    total_transaction_amount: 1050000
  },
  {
    partner_group: "VAR",
    transaction_volume: 860,
    total_transaction_amount: 950000
  },
  {
    partner_group: "MSP",
    transaction_volume: 940,
    total_transaction_amount: 780000
  },
  {
    partner_group: "Affiliate",
    transaction_volume: 5682,
    total_transaction_amount: 568200
  },
  {
    partner_group: "Referral",
    transaction_volume: 4320,
    total_transaction_amount: 432000
  },
  {
    partner_group: "OEM",
    transaction_volume: 680,
    total_transaction_amount: 680000
  },
  {
    partner_group: "Alliance",
    transaction_volume: 455,
    total_transaction_amount: 910000
  },
  {
    partner_group: "Reseller",
    transaction_volume: 2240,
    total_transaction_amount: 896000
  },
  {
    partner_group: "Technology",
    transaction_volume: 1270,
    total_transaction_amount: 762000
  },
  {
    partner_group: "Consulting",
    transaction_volume: 860,
    total_transaction_amount: 688000
  },
  {
    partner_group: "Marketing",
    transaction_volume: 1450,
    total_transaction_amount: 580000
  },
  {
    partner_group: "Education",
    transaction_volume: 520,
    total_transaction_amount: 260000
  },
  {
    partner_group: "Non-Profit",
    transaction_volume: 340,
    total_transaction_amount: 170000
  },
  {
    partner_group: "Government",
    transaction_volume: 125,
    total_transaction_amount: 375000
  },
  {
    partner_group: "Strategic",
    transaction_volume: 210,
    total_transaction_amount: 735000
  }
];

// Data from Average_Commission_Amount_by_Partner_Group.csv
export const partnerGroupCommissions: PartnerGroupCommission[] = [
  {
    partner_group: "Enterprise",
    commission_amount: 375000
  },
  {
    partner_group: "Mid-Market",
    commission_amount: 265000
  },
  {
    partner_group: "SMB",
    commission_amount: 135000
  },
  {
    partner_group: "Agency",
    commission_amount: 105000
  },
  {
    partner_group: "VAR",
    commission_amount: 95000
  },
  {
    partner_group: "MSP",
    commission_amount: 78000
  },
  {
    partner_group: "Affiliate",
    commission_amount: 56820
  },
  {
    partner_group: "Referral",
    commission_amount: 43200
  },
  {
    partner_group: "OEM",
    commission_amount: 68000
  },
  {
    partner_group: "Alliance",
    commission_amount: 91000
  },
  {
    partner_group: "Reseller",
    commission_amount: 89600
  },
  {
    partner_group: "Technology",
    commission_amount: 76200
  },
  {
    partner_group: "Consulting",
    commission_amount: 68800
  },
  {
    partner_group: "Marketing",
    commission_amount: 58000
  },
  {
    partner_group: "Education",
    commission_amount: 26000
  },
  {
    partner_group: "Non-Profit",
    commission_amount: 17000
  },
  {
    partner_group: "Government",
    commission_amount: 37500
  },
  {
    partner_group: "Strategic",
    commission_amount: 73500
  }
];