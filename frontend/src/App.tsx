import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import TaskDashboard from "./pages/TaskDashboard";
import SystemHealth from "./pages/SystemHealth";
import DeploymentLogs from "./pages/DeploymentLogs";
import CommandPanel from "./pages/CommandPanel";

import { Toaster } from "sonner";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* ✅ Navigation */}
        <nav className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-4 px-4 py-3">
            {[
              { to: "/tasks", label: "Tasks" },
              { to: "/health", label: "System Health" },
              { to: "/deployments", label: "Deployment Logs" },
              { to: "/command", label: "Command Panel" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="px-4 py-2 text-sm font-medium rounded-full bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition"
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>

        {/* ✅ Main Route Content */}
        <main className="pt-4">
          <Routes>
            <Route path="/" element={<Navigate to="/tasks" replace />} />
            <Route path="/tasks" element={<TaskDashboard />} />
            <Route path="/health" element={<SystemHealth />} />
            <Route path="/deployments" element={<DeploymentLogs />} />
            <Route path="/command" element={<CommandPanel />} /> {/* ✅ NEW */}
          </Routes>
        </main>

        {/* ✅ Toaster outside of route context */}
        <Toaster richColors position="top-right" />
      </div>
    </Router>
  );
};

export default App;
