interface LoadingProps {
  message?: string;
}

export default function Loading({
  message = "Loading cost data...",
}: LoadingProps) {
  return (
    <div className="loading-container" role="status" aria-live="polite">
      <div className="loading-spinner" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
