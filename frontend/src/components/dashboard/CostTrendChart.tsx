import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DailyCost } from "../../types/cost";
import { formatCurrency } from "../../utils/formatCurrency";

interface CostTrendChartProps {
  data: DailyCost[];
  title?: string;
}

export default function CostTrendChart({
  data,
  title = "AWS Cost Trend",
}: CostTrendChartProps) {
  return (
    <div className="cost-trend-chart">
      <div className="chart-header">
        <h2>{title}</h2>
        <span>Daily AWS spend</span>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                const date = new Date(value);

                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />

            <YAxis
              tickFormatter={(value) =>
                formatCurrency(Number(value), "USD")
              }
            />

            <Tooltip
              formatter={(value) =>
                formatCurrency(Number(value), "USD")
              }
              labelFormatter={(label) => {
                if (
                  typeof label !== "string" &&
                  typeof label !== "number"
                ) {
                  return "";
                }

                const date = new Date(label);

                return date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
              }}
            />

            <Line
              type="monotone"
              dataKey="cost"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
