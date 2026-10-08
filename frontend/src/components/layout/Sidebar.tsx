interface SidebarProps {
  activeItem?: string;
  onNavigate?: (item: string) => void;
}

const navigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "▦",
  },
  {
    id: "services",
    label: "Services",
    icon: "☁",
  },
  {
    id: "cost-drivers",
    label: "Cost Drivers",
    icon: "↗",
  },
];

export default function Sidebar({
  activeItem = "dashboard",
  onNavigate,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">AWS</div>

        <div>
          <strong>Cost Intelligence</strong>
          <span>FinOps Dashboard</span>
        </div>
      </div>

      <nav className="sidebar-navigation" aria-label="Main navigation">
        <div className="sidebar-section-title">OVERVIEW</div>

        {navigationItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`sidebar-navigation-item ${
              activeItem === item.id ? "active" : ""
            }`}
            onClick={() => onNavigate?.(item.id)}
          >
            <span className="sidebar-navigation-icon" aria-hidden="true">
              {item.icon}
            </span>

            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-status">
          <span className="sidebar-status-indicator" />
          <span>AWS Cost Explorer</span>
        </div>

        <span className="sidebar-version">Phase 1</span>
      </div>
    </aside>
  );
}
