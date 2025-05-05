const phases = ["Phase 1", "Phase 2", "Phase 3", "Phase 4"];

export default function PhaseSidebar() {
  return (
    <div className="flex flex-col items-center space-y-4">
      {phases.map((phase, index) => (
        <div
          key={index}
          className={`w-10 h-10 flex items-center justify-center rounded-full ${
            index === 0 ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
}
