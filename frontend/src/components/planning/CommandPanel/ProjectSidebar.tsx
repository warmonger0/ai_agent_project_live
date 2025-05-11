import React from "react";
import { useProjectsAndChats } from "./ProjectSidebar/useProjectsAndChats";
import ChatList from "./ProjectSidebar/ChatList";
import CreateChatForm from "./ProjectSidebar/CreateChatForm";

interface Props {
  selectedChatId: number | null;
  onSelectChat: (id: number) => void;
  onSelectProject: (id: number) => void;
}

const ProjectSidebar: React.FC<Props> = ({
  selectedChatId,
  onSelectChat,
  onSelectProject,
}) => {
  const { projects, chats, setChats, selectedProjectId, setSelectedProjectId } =
    useProjectsAndChats();

  return (
    <div className="w-64 border-r border-gray-200 p-4 bg-gray-50 dark:bg-gray-900">
      <label
        htmlFor="project-select"
        className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300"
      >
        Select Project
      </label>
      <select
        id="project-select"
        className="w-full border rounded p-2 mb-4 bg-white dark:bg-gray-800 dark:text-white"
        onChange={(e) => {
          const id = parseInt(e.target.value, 10);
          setSelectedProjectId(id);
          onSelectProject(id);
        }}
        value={selectedProjectId ?? ""}
      >
        <option value="" disabled>
          Select a project
        </option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
        Chats
      </h3>
      <CreateChatForm
        projectId={selectedProjectId}
        onChatCreated={(newChatId) => {
          fetch(`/api/v1/chat/projects/${selectedProjectId}/chats`)
            .then((res) => res.json())
            .then((updatedChats) => {
              setChats(updatedChats);
              onSelectChat(newChatId); // ✅ set selected chat to the new one
            })
            .catch((err) => {
              console.error("❌ Failed to refresh chats:", err);
              setChats([]);
            });
        }}
      />
      <ChatList
        chats={chats}
        selectedChatId={selectedChatId}
        onSelectChat={onSelectChat}
      />
    </div>
  );
};

export default ProjectSidebar;
