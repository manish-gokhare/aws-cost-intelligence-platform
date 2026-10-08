export type CurrencyCode = "USD" | "EUR" | "INR" | string;

export interface CostSummary {
  totalCost: number;
  dailyAverage: number;
  topService: string;
  topServiceCost: number;
  serviceCount: number;
  percentageChange: number;
  currency: CurrencyCode;
}

export interface DailyCost {
  date: string;
  cost: number;
  currency: CurrencyCode;
}

export interface ServiceCost {
  serviceName: string;
  cost: number;
  percentageOfTotal: number;
  changePercentage: number;
  currency: CurrencyCode;
}

export interface CostDriver {
  rank: number;
  serviceName: string;
  cost: number;
  percentageOfTotal: number;
  changePercentage: number;
  currency: CurrencyCode;
}

export interface RegionCost {
  region: string;
  cost: number;
  percentageOfTotal: number;
  currency: CurrencyCode;
}

export interface ServiceCostDetails {
  serviceName: string;
  totalCost: number;
  dailyAverage: number;
  percentageOfTotal: number;
  changePercentage: number;
  currency: CurrencyCode;
  dailyCosts: DailyCost[];
  regionalCosts: RegionCost[];
}

export interface CostDateRange {
  startDate: string;
  endDate: string;
}

export type CostPeriod =
  | "7d"
  | "30d"
  | "current-month"
  | "previous-month"
  | "90d"
  | "custom";

export interface CostFilters {
  dateRange: CostDateRange;
  period: CostPeriod;
  service?: string;
  region?: string;
  tagKey?: string;
  tagValue?: string;
}

export interface CostMetadata {
  startDate: string;
  endDate: string;
  currency: CurrencyCode;
  metric: string;
  source: "COST_EXPLORER" | "MOCK" | string;
  dataMode: "aws" | "mock" | string;
}

export interface CostDashboardData {
  summary: CostSummary;
  dailyCosts: DailyCost[];
  serviceCosts: ServiceCost[];
  topCostDrivers: CostDriver[];
  metadata: CostMetadata;
}
