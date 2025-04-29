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

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white border-b border-gray-200 p-4 shadow-sm">
          <div className="max-w-6xl mx-auto flex space-x-6">
            <Link
              to="/tasks"
              className="text-indigo-600 font-medium hover:text-indigo-800"
            >
              Tasks
            </Link>
            <Link
              to="/health"
              className="text-indigo-600 font-medium hover:text-indigo-800"
            >
              System Health
            </Link>
            <Link
              to="/deployments"
              className="text-indigo-600 font-medium hover:text-indigo-800"
            >
              Deployment Logs
            </Link>
          </div>
        </nav>

        <Routes>
          {/* Add default route redirect */}
          <Route path="/" element={<Navigate to="/tasks" replace />} />

          <Route path="/tasks" element={<TaskDashboard />} />
          <Route path="/health" element={<SystemHealth />} />
          <Route path="/deployments" element={<DeploymentLogs />} />
        </Routes>
        <Toaster richColors />
      </div>
    </Router>
  );
};

export default App;
