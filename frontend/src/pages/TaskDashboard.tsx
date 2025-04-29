import PluginPanel from "@/components/PluginPanel";
import TaskTable from "@/components/TaskTable";
import PluginHistory from "@/components/PluginHistory"; // ✅ Add this import

const TaskDashboard = () => {
  return (
    <div className="bg-[#f6f8fa] min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-sm rounded-xl p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Task Dashboard
        </h1>

        <TaskTable />

        <PluginPanel />

        {/* ✅ Add Plugin History */}
        <div className="mt-8">
          <PluginHistory />
        </div>
      </div>
    </div>
  );
};

export default TaskDashboard;
