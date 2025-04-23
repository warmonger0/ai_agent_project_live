import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import TaskDashboard from './pages/TaskDashboard';
import SystemHealth from './pages/SystemHealth';
import DeploymentLogs from './pages/DeploymentLogs';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow p-4 flex space-x-4">
          <Link to="/tasks" className="text-blue-500">Tasks</Link>
          <Link to="/health" className="text-blue-500">System Health</Link>
          <Link to="/deployments" className="text-blue-500">Deployment Logs</Link>
        </nav>
        <Routes>
          {/* Add default route redirect */}
          <Route path="/" element={<Navigate to="/tasks" replace />} />

          <Route path="/tasks" element={<TaskDashboard />} />
          <Route path="/health" element={<SystemHealth />} />
          <Route path="/deployments" element={<DeploymentLogs />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
