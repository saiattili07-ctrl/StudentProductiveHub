import { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";
import "./AppLayout.css";

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Navbar onToggleSidebar={() => setSidebarOpen((open) => !open)} />
      <div className="app-body">
        <Sidebar
          isOpen={sidebarOpen}
          onNavigate={() => setSidebarOpen(false)}
        />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
