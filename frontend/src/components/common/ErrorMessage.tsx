interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({
  message = "Unable to load cost data.",
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="error-container" role="alert">
      <div className="error-icon" aria-hidden="true">
        ⚠
      </div>

      <div className="error-content">
        <h3>Something went wrong</h3>
        <p>{message}</p>

        {onRetry && (
          <button type="button" onClick={onRetry}>
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
