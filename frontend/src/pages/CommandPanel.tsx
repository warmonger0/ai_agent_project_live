import React, { useRef, useState } from "react";
import ChatPanel from "@/components/planning/CommandPanel/ChatPanel";
import TabbedPanel from "@/components/planning/CommandPanel/TabbedPanel";
import PhaseSidebar from "@/components/planning/CommandPanel/SidebarPanel/PhaseSidebar";
import ProjectSidebar from "@/components/planning/CommandPanel/ProjectSidebar";

const CommandPanel: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [topHeight, setTopHeight] = useState(60); // in %
  const isDragging = useRef(false);

  const startDrag = (e: React.MouseEvent) => {
    isDragging.current = true;
    const startY = e.clientY;
    const startHeight = topHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const deltaY = moveEvent.clientY - startY;
      const newHeight = Math.max(
        20,
        Math.min(80, startHeight + (deltaY / rect.height) * 100)
      );
      setTopHeight(newHeight);
    };

    const stopDrag = () => {
      isDragging.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopDrag);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopDrag);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-gray-50 text-gray-900">
      {/* Left Sidebar */}
      <aside className="w-64 border-r border-gray-300 bg-white shadow-inner px-4 py-6">
        <ProjectSidebar
          selectedChatId={selectedChatId}
          onSelectChat={(chatId) => setSelectedChatId(chatId)}
        />
      </aside>

      {/* Main content column */}
      <div ref={containerRef} className="flex flex-col flex-1 p-4 space-y-0">
        {/* Chat panel with adjustable height */}
        <div
          style={{ height: `${topHeight}%` }}
          className="rounded-md border border-gray-200 bg-white shadow-sm overflow-hidden"
        >
          <ChatPanel />
        </div>

        {/* Drag handle */}
        <div
          onMouseDown={startDrag}
          className="h-2 cursor-row-resize bg-gray-200 hover:bg-gray-300"
        />

        {/* Tabbed content */}
        <div
          style={{ height: `${100 - topHeight}%` }}
          className="rounded-md border border-gray-200 bg-white shadow-sm overflow-hidden"
        >
          <TabbedPanel />
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="w-64 border-l border-gray-300 bg-white shadow-inner px-4 py-6">
        <PhaseSidebar />
      </aside>
    </div>
  );
};

export default CommandPanel;
