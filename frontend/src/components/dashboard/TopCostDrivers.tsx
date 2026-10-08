import type { CostDriver } from "../../types/cost";
import {
  formatCompactCurrency,
  formatPercentage,
  formatPercentageChange,
} from "../../utils/formatCurrency";

interface TopCostDriversProps {
  data: CostDriver[];
  title?: string;
}

export default function TopCostDrivers({
  data,
  title = "Top Cost Drivers",
}: TopCostDriversProps) {
  return (
    <div className="top-cost-drivers">
      <div className="chart-header">
        <h2>{title}</h2>
        <span>Highest AWS service costs</span>
      </div>

      <div className="cost-driver-list">
        {data.map((driver) => (
          <div className="cost-driver-row" key={driver.rank}>
            <div className="cost-driver-rank">
              #{driver.rank}
            </div>

            <div className="cost-driver-service">
              <strong>{driver.serviceName}</strong>

              <span>
                {formatPercentage(driver.percentageOfTotal)} of total
              </span>
            </div>

            <div className="cost-driver-cost">
              <strong>
                {formatCompactCurrency(
                  driver.cost,
                  driver.currency
                )}
              </strong>

              <span
                className={
                  driver.changePercentage > 0
                    ? "increase"
                    : driver.changePercentage < 0
                      ? "decrease"
                      : "neutral"
                }
              >
                {formatPercentageChange(driver.changePercentage)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
