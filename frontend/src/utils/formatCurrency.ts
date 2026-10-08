import type { CurrencyCode } from "../types/cost";

/**
 * Formats a numeric value as a currency amount.
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a currency value in compact form.
 *
 * Examples:
 * 1248.32  → $1.25K
 * 1250000  → $1.25M
 */
export function formatCompactCurrency(
  amount: number,
  currency: CurrencyCode = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: "compact",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a percentage value.
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Formats a percentage change with an arrow.
 */
export function formatPercentageChange(value: number): string {
  if (value > 0) {
    return `↑ ${Math.abs(value).toFixed(1)}%`;
  }

  if (value < 0) {
    return `↓ ${Math.abs(value).toFixed(1)}%`;
  }

  return "0.0%";
}
