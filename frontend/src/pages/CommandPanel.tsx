import React from 'react';
import Sidebar from '../components/commandPanel/Sidebar';
import ChatPanel from '../components/commandPanel/ChatPanel';
import TabbedPanel from '../components/commandPanel/TabbedPanel';

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
