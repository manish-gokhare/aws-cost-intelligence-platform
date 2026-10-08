interface EmptyStateProps {
  title?: string;
  message?: string;
}

export default function EmptyState({
  title = "No cost data available",
  message = "There is no cost data available for the selected period.",
}: EmptyStateProps) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state-icon" aria-hidden="true">
        📊
      </div>

      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}
