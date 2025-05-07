import React from "react";

const phases = [
  "Phase 1: Command Panel",
  "Phase 2: Agent Delegation",
  "Phase 3: Dependency Setup",
  "Phase 4: Implementation",
];

// TODO: replace this with dynamic phase from app state
const currentPhase = 0;

const PhaseSidebar: React.FC = () => {
  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Phases
      </h2>
      <ul className="space-y-2">
        {phases.map((label, idx) => (
          <li
            key={label}
            className={`px-3 py-2 rounded-md transition ${
              idx === currentPhase
                ? "bg-blue-600 text-white font-semibold"
                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
            }`}
          >
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PhaseSidebar;
