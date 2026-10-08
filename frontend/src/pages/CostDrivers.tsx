import { useEffect, useState } from "react";

import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import TopCostDrivers from "../components/dashboard/TopCostDrivers";

import type { CostDriver } from "../types/cost";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "http://127.0.0.1:8000";

interface DashboardResponse {
  topCostDrivers: CostDriver[];
}

function CostDrivers() {
  const [drivers, setDrivers] = useState<CostDriver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCostDrivers() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_BASE_URL}/api/v1/costs/dashboard`,
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch cost drivers: ${response.status} ${response.statusText}`,
          );
        }

        const result: DashboardResponse =
          await response.json();

        setDrivers(result.topCostDrivers);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load AWS cost drivers.";

        setError(message);
      } finally {
        setLoading(false);
      }
    }

    loadCostDrivers();
  }, []);

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
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Cost Drivers</h1>
          <p>
            Identify the AWS services contributing most
            to your cloud spending.
          </p>
        </div>
      </div>

      <div className="dashboard-card">
        <TopCostDrivers data={drivers} />
      </div>
    </div>
  );
}

export default CostDrivers;
