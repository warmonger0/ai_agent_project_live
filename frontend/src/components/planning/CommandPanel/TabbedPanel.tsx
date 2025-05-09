import React, { useState } from "react";
import UnderstandingTab from "./TabbedInfoPanel/UnderstandingTab";
import FileTreeTab from "./TabbedInfoPanel/FileTreeTab";
import IssuesTab from "./ChatPanel/IssuesTab";

const TabbedPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState("understanding");

  const renderTab = () => {
    switch (activeTab) {
      case "understanding":
        return <UnderstandingTab />;
      case "filetree":
        return <FileTreeTab />;
      case "issues":
        return <IssuesTab />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 p-4">
      <div className="mb-4">
        <button onClick={() => setActiveTab("understanding")} className="mr-2">
          Understanding
        </button>
        <button onClick={() => setActiveTab("filetree")} className="mr-2">
          File Tree
        </button>
        <button onClick={() => setActiveTab("issues")}>Issues</button>
      </div>
      <div>{renderTab()}</div>
    </div>
  );
};

export default TabbedPanel;
