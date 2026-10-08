import { useEffect, useMemo, useState } from "react";

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

type SortOption =
  | "cost-desc"
  | "cost-asc"
  | "change-desc"
  | "change-asc";

function CostDrivers() {
  const [drivers, setDrivers] = useState<CostDriver[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] =
    useState<SortOption>("cost-desc");

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

  const filteredAndSortedDrivers = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    const filtered = drivers.filter((driver) =>
      driver.serviceName
        .toLowerCase()
        .includes(normalizedSearch),
    );

    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "cost-asc":
          return a.cost - b.cost;

        case "cost-desc":
          return b.cost - a.cost;

        case "change-desc":
          return (
            b.changePercentage -
            a.changePercentage
          );

        case "change-asc":
          return (
            a.changePercentage -
            b.changePercentage
          );

        default:
          return 0;
      }
    });
  }, [drivers, searchTerm, sortOption]);

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

      <div className="service-controls">
        <div className="service-search">
          <label htmlFor="cost-driver-search">
            Search services
          </label>

          <input
            id="cost-driver-search"
            type="search"
            placeholder="Search by service name..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <div className="service-sort">
          <label htmlFor="cost-driver-sort">
            Sort by
          </label>

          <select
            id="cost-driver-sort"
            value={sortOption}
            onChange={(event) =>
              setSortOption(
                event.target.value as SortOption,
              )
            }
          >
            <option value="cost-desc">
              Cost: High to Low
            </option>

            <option value="cost-asc">
              Cost: Low to High
            </option>

            <option value="change-desc">
              Change: Highest to Lowest
            </option>

            <option value="change-asc">
              Change: Lowest to Highest
            </option>
          </select>
        </div>
      </div>

      <div className="dashboard-card">
        <TopCostDrivers
          data={filteredAndSortedDrivers}
        />
      </div>
    </div>
  );
}

export default CostDrivers;