import { useEffect, useMemo, useState } from "react";

import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import CostSummaryCard from "../components/dashboard/CostSummaryCard";
import ServiceTable from "../components/dashboard/ServiceTable";

import type { ServiceCost } from "../types/cost";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "http://127.0.0.1:8000";

type SortOption =
  | "cost-desc"
  | "cost-asc"
  | "name-asc"
  | "name-desc";

function Services() {
  const [services, setServices] = useState<ServiceCost[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] =
    useState<SortOption>("cost-desc");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadServices() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_BASE_URL}/api/v1/costs/services`,
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch service costs: ${response.status} ${response.statusText}`,
          );
        }

        const result: { data: ServiceCost[] } =
          await response.json();

        setServices(result.data);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load AWS service costs.";

        setError(message);
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  const filteredAndSortedServices = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    const filtered = services.filter((service) =>
      service.serviceName
        .toLowerCase()
        .includes(normalizedSearch),
    );

    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "cost-asc":
          return a.cost - b.cost;

        case "cost-desc":
          return b.cost - a.cost;

        case "name-asc":
          return a.serviceName.localeCompare(
            b.serviceName,
          );

        case "name-desc":
          return b.serviceName.localeCompare(
            a.serviceName,
          );

        default:
          return 0;
      }
    });
  }, [services, searchTerm, sortOption]);

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

  const totalCost = services.reduce(
    (total, service) => total + service.cost,
    0,
  );

  const topService = services.reduce<ServiceCost | null>(
    (top, service) => {
      if (!top || service.cost > top.cost) {
        return service;
      }

      return top;
    },
    null,
  );

  const currency = services[0]?.currency ?? "USD";

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>AWS Services</h1>
          <p>
            Explore your AWS spending across individual services.
          </p>
        </div>
      </div>

      <div className="summary-grid">
        <CostSummaryCard
          title="Total Cost"
          value={totalCost}
          currency={currency}
        />

        <CostSummaryCard
          title="Top Service"
          value={topService?.serviceName ?? "N/A"}
        />
      </div>

      <div className="service-controls">
        <div className="service-search">
          <label htmlFor="service-search">
            Search services
          </label>

          <input
            id="service-search"
            type="search"
            placeholder="Search by service name..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <div className="service-sort">
          <label htmlFor="service-sort">
            Sort by
          </label>

          <select
            id="service-sort"
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

            <option value="name-asc">
              Service: A to Z
            </option>

            <option value="name-desc">
              Service: Z to A
            </option>
          </select>
        </div>
      </div>

      <div className="dashboard-card">
        <ServiceTable
          data={filteredAndSortedServices}
        />
      </div>
    </div>
  );
}

export default Services;
