import { useCallback, useEffect, useState } from "react";

import CostSummaryCard from "../components/dashboard/CostSummaryCard";
import CostTrendChart from "../components/dashboard/CostTrendChart";
import ServiceCostChart from "../components/dashboard/ServiceCostChart";
import TopCostDrivers from "../components/dashboard/TopCostDrivers";
import ServiceTable from "../components/dashboard/ServiceTable";

import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";

import { fetchCostDashboard } from "../services/costApi";

import type { CostDashboardData } from "../types/cost";

function Dashboard() {
  const [data, setData] = useState<CostDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const dashboardData = await fetchCostDashboard();

      setData(dashboardData);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load AWS cost data.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return (
      <div className="dashboard-page">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <ErrorMessage message={error} />

        <button
          type="button"
          onClick={loadDashboard}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const {
    summary,
    dailyCosts,
    serviceCosts,
    topCostDrivers,
  } = data;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>AWS Cost Overview</h1>
          <p>
            Monitor your AWS spending and identify
            the biggest cost drivers.
          </p>
        </div>
      </div>

      <div className="summary-grid">
        <CostSummaryCard
          title="Total Cost"
          value={summary.totalCost}
          currency={summary.currency}
        />

        <CostSummaryCard
          title="Daily Average"
          value={summary.dailyAverage}
          currency={summary.currency}
        />

        <CostSummaryCard
          title="Top Service"
          value={summary.topService}
        />

        <CostSummaryCard
          title="Services"
          value={summary.serviceCount}
        />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card trend-card">
          <div className="card-header">
            <div>
              <h2>Cost Trend</h2>
              <p>Daily AWS spending</p>
            </div>
          </div>

          <CostTrendChart data={dailyCosts} />
        </div>

        <div className="dashboard-card service-chart-card">
          <div className="card-header">
            <div>
              <h2>Cost by Service</h2>
              <p>Distribution of AWS spending</p>
            </div>
          </div>

          <ServiceCostChart data={serviceCosts} />
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>Top Cost Drivers</h2>
              <p>
                Services contributing most to your bill
              </p>
            </div>
          </div>

          <TopCostDrivers data={topCostDrivers} />
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>Service Costs</h2>
              <p>AWS spending by service</p>
            </div>
          </div>

          <ServiceTable data={serviceCosts} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
