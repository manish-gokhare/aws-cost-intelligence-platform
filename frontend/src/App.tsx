import { useState } from "react";

import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import CostDrivers from "./pages/CostDrivers";

import DashboardLayout from "./components/layout/DashboardLayout";

function App() {
  const [activeItem, setActiveItem] = useState("dashboard");

  const renderPage = () => {
    switch (activeItem) {
      case "services":
        return <Services />;

      case "cost-drivers":
        return <CostDrivers />;

      case "dashboard":
      default:
        return <Dashboard />;
    }
  };

  return (
    <DashboardLayout
      activeItem={activeItem}
      onNavigate={setActiveItem}
    >
      {renderPage()}
    </DashboardLayout>
  );
}

export default App;
