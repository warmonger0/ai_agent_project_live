import React from "react";
import ChatPanel from "@/components/planning/CommandPanel/ChatPanel";
import TabbedPanel from "@/components/planning/TabbedPanel";
import PhaseSidebar from "@/components/planning/PhaseSidebar";

const CommandPanel: React.FC = () => {
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-gray-50 text-gray-900">
      {/* Main area */}
      <div className="flex flex-col flex-1 p-4 space-y-4">
        {/* Chat panel (top half) */}
        <div className="flex-1 rounded-md border border-gray-200 bg-white shadow-sm overflow-hidden">
          <ChatPanel />
        </div>

        {/* Tabbed content (bottom half) */}
        <div className="flex-1 rounded-md border border-gray-200 bg-white shadow-sm overflow-hidden">
          <TabbedPanel />
        </div>
      </div>

      {/* Sidebar */}
      <aside className="w-64 border-l border-gray-300 bg-white shadow-inner px-4 py-6">
        <PhaseSidebar />
      </aside>
    </div>
  );
};

export default CommandPanel;
