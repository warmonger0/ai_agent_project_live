import React from 'react';
import Sidebar from '../components/planning/Sidebar';
import ChatPanel from '../components/planning/ChatPanel';
import TabbedPanel from '../components/planning/TabbedPanel';

const CommandPanel: React.FC = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <ChatPanel />
        <TabbedPanel />
      </div>
    </div>
  );
};

export default CommandPanel;
