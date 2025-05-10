import React, { useEffect, useState } from "react";
import { Chat, Project } from "@/types/chatTypes";

interface ProjectSidebarProps {
  onSelectChat: (chatId: number) => void;
  selectedChatId: number | null;
}

const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  onSelectChat,
  selectedChatId,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    fetch("/api/v1/chat/projects")
      .then((res) => res.json())
      .then(setProjects);
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetch(`/api/v1/chat/projects/${selectedProject.id}/chats`)
        .then((res) => res.json())
        .then(setChats);
    } else {
      setChats([]);
    }
  }, [selectedProject]);

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
          const proj = projects.find((p) => p.id === id) || null;
          setSelectedProject(proj);
        }}
        value={selectedProject?.id || ""}
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
