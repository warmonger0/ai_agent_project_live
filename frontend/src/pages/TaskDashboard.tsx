// File: src/pages/TaskDashboard.tsx

import TaskTable from "@/components/TaskTable";
import PluginPanel from "@/components/PluginPanel";
import PluginHistory from "@/components/PluginHistory";

export default function TaskDashboard() {
  return (
    <div className="bg-[#f6f8fa] min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-sm rounded-xl p-6 space-y-8">
        <h1 className="text-2xl font-semibold text-gray-800 text-center">
          Task Dashboard
        </h1>

        <div data-testid="TaskTable">
          <TaskTable />
        </div>

        <div data-testid="PluginPanel">
          <PluginPanel />
        </div>

        <div data-testid="PluginHistory">
          <PluginHistory />
        </div>
      </div>
    </div>
  );
}
