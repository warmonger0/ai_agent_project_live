import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Phases</h2>
      <ul>
        <li className="mb-2">Phase 1: Command Panel</li>
        <li className="mb-2">Phase 2: Agent Delegation</li>
        <li className="mb-2">Phase 3: Dependency Setup</li>
        <li className="mb-2">Phase 4: Implementation</li>
      </ul>
    </div>
  );
};

export default Sidebar;
