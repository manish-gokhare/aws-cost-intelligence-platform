import type { ReactNode } from "react";

import Header from "./Header";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  activeItem?: string;
  onNavigate?: (item: string) => void;
}

export default function DashboardLayout({
  children,
  activeItem = "dashboard",
  onNavigate,
}: DashboardLayoutProps) {
  return (
    <div className="dashboard-layout">
      <Sidebar
        activeItem={activeItem}
        onNavigate={onNavigate}
      />

      <div className="dashboard-main">
        <Header />

        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}
