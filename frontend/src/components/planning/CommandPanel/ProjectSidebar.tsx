import React, { useEffect, useState } from "react";

// Types
type Chat = {
  id: number;
  title: string;
};

type Project = {
  id: number;
  name: string;
};

interface ProjectSidebarProps {
  selectedChatId: number | null;
  onSelectChat: (chatId: number) => void;
  onSelectProject: (projectId: number) => void;
}

const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  selectedChatId,
  onSelectChat,
  onSelectProject,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const [newChatTitle, setNewChatTitle] = useState("");

  useEffect(() => {
    fetch("/api/v1/chat/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        console.log("📦 Projects loaded:", data);
      })
      .catch((err) => console.error("Failed to load projects:", err));
  }, []);

  useEffect(() => {
    setChats([]); // ✅ Clear previous chats immediately
    if (selectedProjectId === null) return;

    fetch(`/api/v1/chat/projects/${selectedProjectId}/chats`)
      .then((res) => res.json())
      .then((data) => {
        setChats(data);
        console.log(`💬 Chats for project ${selectedProjectId}:`, data);
      })
      .catch((err) => {
        console.error("Failed to load chats:", err);
        setChats([]); // ✅ Clear on failure too
      });
  }, [selectedProjectId]);

  const handleCreateChat = async () => {
    if (!selectedProjectId || !newChatTitle.trim()) return;

    try {
      const res = await fetch("/api/v1/chat/chats/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newChatTitle.trim(),
          project_id: selectedProjectId,
        }),
      });

      if (res.ok) {
        setNewChatTitle("");
        const updated = await fetch(
          `/api/v1/chat/projects/${selectedProjectId}/chats`
        );
        const updatedChats = await updated.json();
        setChats(updatedChats);
        console.log("✨ Chat created and loaded:", updatedChats);
      } else {
        console.error("Failed to create chat:", res.status);
      }
    } catch (error) {
      console.error("Chat creation error:", error);
    }
  };

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
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>

      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
          Chats
        </h3>

        {/* ➕ Add new chat */}
        <div className="flex gap-1 mb-3">
          <input
            type="text"
            placeholder="New chat..."
            value={newChatTitle}
            onChange={(e) => setNewChatTitle(e.target.value)}
            className="flex-1 border px-2 py-1 rounded text-sm"
          />
          <button
            onClick={handleCreateChat}
            className="text-xl px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
            title="Create Chat"
          >
            +
          </button>
        </div>

        <ul className="space-y-2">
          {chats.map((chat) => (
            <li key={chat.id}>
              <button
                className={`w-full text-left px-2 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-800 ${
                  selectedChatId === chat.id
                    ? "bg-blue-200 dark:bg-blue-700 text-white"
                    : ""
                }`}
                onClick={() => onSelectChat(chat.id)}
              >
                {chat.title || `Chat ${chat.id}`}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProjectSidebar;
