import React from "react";
import PhaseSidebar from "./PhaseSidebar";

const Sidebar: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col">
      {/* Top 1/3 Phase indicator */}
      <div className="flex-none border-b border-gray-300 p-4">
        <PhaseSidebar />
      </div>

      {/* Remaining space for future sidebar tools/info */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Add more sidebar content here later */}
        <p className="text-sm text-gray-500 italic">
          Sidebar tools coming soon...
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
