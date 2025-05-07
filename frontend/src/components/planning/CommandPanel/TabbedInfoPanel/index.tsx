import { useState } from "react";
import ProjectUnderstanding from "./ProjectUnderstanding";
import FileTreePreview from "./FileTreePreview";
import IssueList from "./IssueList";

const tabs = ["Overview", "File Tree", "Issues"] as const;
type Tab = typeof tabs[number];

export default function TabbedInfoPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  const renderTab = () => {
    switch (activeTab) {
      case "Overview":
        return <ProjectUnderstanding />;
      case "File Tree":
        return <FileTreePreview />;
      case "Issues":
        return <IssueList />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex space-x-4 border-b p-2 text-sm font-medium">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`${
              activeTab === tab ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
            } pb-1`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex-1 p-2 overflow-y-auto">{renderTab()}</div>
    </div>
  );
}
