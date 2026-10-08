import type { CostDashboardData } from "../types/cost";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "http://127.0.0.1:8000";

interface DateRange {
  startDate?: string;
  endDate?: string;
}

export async function fetchCostDashboard(
  dateRange?: DateRange,
): Promise<CostDashboardData> {
  const params = new URLSearchParams();

  if (dateRange?.startDate) {
    params.set("start_date", dateRange.startDate);
  }

  if (dateRange?.endDate) {
    params.set("end_date", dateRange.endDate);
  }

  const queryString = params.toString();

  const url = queryString
    ? `${API_BASE_URL}/api/v1/costs/dashboard?${queryString}`
    : `${API_BASE_URL}/api/v1/costs/dashboard`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch cost dashboard: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}