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

import { Toaster } from "sonner";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* ✅ Navigation */}
        <nav className="bg-white border-b border-gray-200 p-4 shadow-sm">
          <div className="max-w-6xl mx-auto flex flex-wrap gap-4 sm:gap-6">
            <Link
              to="/tasks"
              className="text-indigo-600 font-medium hover:text-indigo-800 transition"
            >
              Tasks
            </Link>
            <Link
              to="/health"
              className="text-indigo-600 font-medium hover:text-indigo-800 transition"
            >
              System Health
            </Link>
            <Link
              to="/deployments"
              className="text-indigo-600 font-medium hover:text-indigo-800 transition"
            >
              Deployment Logs
            </Link>
          </div>
        </nav>

        {/* ✅ Main Route Content */}
        <main className="pt-4">
          <Routes>
            <Route path="/" element={<Navigate to="/tasks" replace />} />
            <Route path="/tasks" element={<TaskDashboard />} />
            <Route path="/health" element={<SystemHealth />} />
            <Route path="/deployments" element={<DeploymentLogs />} />
          </Routes>
        </main>

        {/* ✅ Toaster outside of route context */}
        <Toaster richColors position="top-right" />
      </div>
    </Router>
  );
};

export default App;
