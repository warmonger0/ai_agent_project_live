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
        <nav className="bg-white shadow-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex space-x-6">
                <Link
                  to="/"
                  className="text-gray-700 font-semibold hover:text-blue-600 transition duration-300"
                >
                  Command Panel
                </Link>
                <Link
                  to="/tasks"
                  className="text-gray-700 font-semibold hover:text-blue-600 transition duration-300"
                >
                  Tasks
                </Link>
                <Link
                  to="/health"
                  className="text-gray-700 font-semibold hover:text-blue-600 transition duration-300"
                >
                  System Health
                </Link>
                <Link
                  to="/deployments"
                  className="text-gray-700 font-semibold hover:text-blue-600 transition duration-300"
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
