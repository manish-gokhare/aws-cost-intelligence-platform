import type { ServiceCost } from "../../types/cost";
import {
  formatCurrency,
  formatPercentage,
  formatPercentageChange,
} from "../../utils/formatCurrency";

interface ServiceTableProps {
  data: ServiceCost[];
  title?: string;
}

export default function ServiceTable({
  data,
  title = "AWS Services",
}: ServiceTableProps) {
  return (
    <div className="service-table">
      <div className="table-header">
        <div>
          <h2>{title}</h2>
          <span>Detailed AWS service cost breakdown</span>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Cost</th>
              <th>% of Total</th>
              <th>Change</th>
            </tr>
          </thead>

          <tbody>
            {data.map((service) => (
              <tr key={service.serviceName}>
                <td>
                  <strong>{service.serviceName}</strong>
                </td>

                <td>
                  {formatCurrency(service.cost, service.currency)}
                </td>

                <td>
                  {formatPercentage(service.percentageOfTotal)}
                </td>

                <td>
                  <span
                    className={
                      service.changePercentage > 0
                        ? "increase"
                        : service.changePercentage < 0
                          ? "decrease"
                          : "neutral"
                    }
                  >
                    {formatPercentageChange(
                      service.changePercentage
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
