interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export default function Header({
  title = "AWS Cost Intelligence",
  subtitle = "Cloud Cost Overview",
}: HeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header-title">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="app-header-actions">
        <div className="data-status">
          <span className="data-status-indicator" />
          <span>Cost data available</span>
        </div>

        <button
          type="button"
          className="refresh-button"
          aria-label="Refresh cost data"
        >
          ↻
        </button>

        <div className="user-profile">
          <div className="user-avatar">MG</div>

          <div className="user-info">
            <strong>Cloud Admin</strong>
            <span>AWS Account</span>
          </div>
        </div>
      </div>
    </header>
  );
}
