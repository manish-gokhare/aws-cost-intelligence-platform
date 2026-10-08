import { formatCurrency } from "../../utils/formatCurrency";
import type { CurrencyCode } from "../../types/cost";

interface CostSummaryCardProps {
  title: string;
  value: number | string;
  currency?: CurrencyCode;
}

function CostSummaryCard({
  title,
  value,
  currency = "USD",
}: CostSummaryCardProps) {
  const displayValue =
    typeof value === "number"
      ? formatCurrency(value, currency)
      : value;

  return (
    <div className="summary-card">
      <div className="summary-card-title">
        {title}
      </div>

      <div className="summary-card-value">
        {displayValue}
      </div>
    </div>
  );
}

export default CostSummaryCard;
