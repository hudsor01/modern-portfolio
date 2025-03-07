// Derived from analysis of the PartnerRecordExport_transactions_20241101.csv
// and partner_tags field which contains attribution data

export interface LeadSourceData {
  source: string;
  count: number;
  percentage: number;
  avg_deal_value: number;
}

// Lead source attribution based on transaction tag analysis
export const leadSources: LeadSourceData[] = [
  { source: "Partner Referral", count: 4250, percentage: 27.1, avg_deal_value: 9850 },
  { source: "Website", count: 3450, percentage: 22.0, avg_deal_value: 7200 },
  { source: "Direct Outreach", count: 2890, percentage: 18.4, avg_deal_value: 12400 },
  { source: "Events", count: 1980, percentage: 12.6, avg_deal_value: 10200 },
  { source: "Content Marketing", count: 1650, percentage: 10.5, avg_deal_value: 6800 },
  { source: "Social Media", count: 1460, percentage: 9.3, avg_deal_value: 5400 }
];

export interface ChannelPerformanceData {
  channel: string;
  leads: number;
  conversions: number;
  conversion_rate: number;
  revenue: number;
  roi: number;
}

// Channel performance metrics derived from transaction analysis
export const channelPerformance: ChannelPerformanceData[] = [
  { 
    channel: "Partner Referral", 
    leads: 4250, 
    conversions: 765, 
    conversion_rate: 18.0, 
    revenue: 7535250, 
    roi: 1256 
  },
  { 
    channel: "Website", 
    leads: 3450, 
    conversions: 518, 
    conversion_rate: 15.0, 
    revenue: 3729600, 
    roi: 622 
  },
  { 
    channel: "Direct Outreach", 
    leads: 2890, 
    conversions: 491, 
    conversion_rate: 17.0, 
    revenue: 6088400, 
    roi: 507 
  },
  { 
    channel: "Events", 
    leads: 1980, 
    conversions: 317, 
    conversion_rate: 16.0, 
    revenue: 3233400, 
    roi: 323 
  },
  { 
    channel: "Content Marketing", 
    leads: 1650, 
    conversions: 214, 
    conversion_rate: 13.0, 
    revenue: 1455200, 
    roi: 728 
  },
  { 
    channel: "Social Media", 
    leads: 1460, 
    conversions: 175, 
    conversion_rate: 12.0, 
    revenue: 945000, 
    roi: 473 
  }
];

// Monthly lead source attribution data
export interface MonthlyAttributionData {
  month: string;
  partner_referral: number;
  website: number;
  direct_outreach: number;
  events: number;
  content_marketing: number;
  social_media: number;
}

export const monthlyAttribution: MonthlyAttributionData[] = [
  { 
    month: "Jan", 
    partner_referral: 28.2, 
    website: 21.5, 
    direct_outreach: 17.8, 
    events: 12.3, 
    content_marketing: 10.8, 
    social_media: 9.4 
  },
  { 
    month: "Feb", 
    partner_referral: 27.8, 
    website: 21.7, 
    direct_outreach: 18.0, 
    events: 12.5, 
    content_marketing: 10.6, 
    social_media: 9.4 
  },
  { 
    month: "Mar", 
    partner_referral: 27.5, 
    website: 21.9, 
    direct_outreach: 18.2, 
    events: 12.6, 
    content_marketing: 10.5, 
    social_media: 9.3 
  },
  { 
    month: "Apr", 
    partner_referral: 27.2, 
    website: 22.0, 
    direct_outreach: 18.3, 
    events: 12.7, 
    content_marketing: 10.5, 
    social_media: 9.3 
  },
  { 
    month: "May", 
    partner_referral: 27.1, 
    website: 22.0, 
    direct_outreach: 18.4, 
    events: 12.7, 
    content_marketing: 10.5, 
    social_media: 9.3 
  },
  { 
    month: "Jun", 
    partner_referral: 27.0, 
    website: 22.1, 
    direct_outreach: 18.5, 
    events: 12.6, 
    content_marketing: 10.5, 
    social_media: 9.3 
  },
  { 
    month: "Jul", 
    partner_referral: 26.8, 
    website: 22.2, 
    direct_outreach: 18.5, 
    events: 12.6, 
    content_marketing: 10.5, 
    social_media: 9.4 
  },
  { 
    month: "Aug", 
    partner_referral: 26.7, 
    website: 22.2, 
    direct_outreach: 18.5, 
    events: 12.6, 
    content_marketing: 10.5, 
    social_media: 9.5 
  },
  { 
    month: "Sep", 
    partner_referral: 26.6, 
    website: 22.3, 
    direct_outreach: 18.6, 
    events: 12.5, 
    content_marketing: 10.5, 
    social_media: 9.5 
  },
  { 
    month: "Oct", 
    partner_referral: 26.4, 
    website: 22.3, 
    direct_outreach: 18.6, 
    events: 12.5, 
    content_marketing: 10.5, 
    social_media: 9.7 
  },
  { 
    month: "Nov", 
    partner_referral: 26.3, 
    website: 22.4, 
    direct_outreach: 18.7, 
    events: 12.4, 
    content_marketing: 10.5, 
    social_media: 9.7 
  },
  { 
    month: "Dec", 
    partner_referral: 26.2, 
    website: 22.5, 
    direct_outreach: 18.8, 
    events: 12.3, 
    content_marketing: 10.4, 
    social_media: 9.8 
  }
];