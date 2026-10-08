import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ServiceCost } from "../../types/cost";
import { formatCurrency } from "../../utils/formatCurrency";

interface ServiceCostChartProps {
  data: ServiceCost[];
  title?: string;
}

export default function ServiceCostChart({
  data,
  title = "Cost by AWS Service",
}: ServiceCostChartProps) {
  return (
    <div className="service-cost-chart">
      <div className="chart-header">
        <h2>{title}</h2>
        <span>AWS spend by service</span>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 10,
              right: 20,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              type="number"
              tickFormatter={(value) =>
                formatCurrency(Number(value), "USD")
              }
            />

            <YAxis
              type="category"
              dataKey="serviceName"
              width={120}
            />

            <Tooltip
              formatter={(value) =>
                formatCurrency(Number(value), "USD")
              }
            />

            <Bar
              dataKey="cost"
              name="Cost"
              barSize={24}
              fill="#ff9900"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
