import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import "./index.css";
import TaskDashboard from "./pages/TaskDashboard";
import SystemHealth from "./pages/SystemHealth";
import DeploymentLogs from "./pages/DeploymentLogs";
import CommandPanel from "./pages/CommandPanel";

import { Toaster } from "sonner";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold text-red-500">Tailwind works!</h1>

        {/* ✅ Navigation */}
        <nav className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex space-x-4">
                <Link
                  to="/command"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Command Panel
                </Link>
                <Link
                  to="/tasks"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Tasks
                </Link>
                <Link
                  to="/health"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  System Health
                </Link>
                <Link
                  to="/deployments"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Deployment Logs
                </Link>
              </div>
            </div>
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
