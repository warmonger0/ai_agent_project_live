import { useEffect, useState, useCallback } from "react";

type Project = { id: number; name: string };
type Chat = { id: number; title: string };

export function useProjectsAndChats() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );

  // Fetch all projects on mount
  useEffect(() => {
    fetch("/api/v1/chat/projects")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch projects: ${res.status}`);
        }
        return res.json();
      })
      .then(setProjects)
      .catch((err) => {
        console.error("Failed to load projects:", err);
        setProjects([]);
      });
  }, []);

  // Fetch chats when selectedProjectId changes
  useEffect(() => {
    if (selectedProjectId === null) {
      setChats([]);
      return;
    }

    fetch(`/api/v1/chat/projects/${selectedProjectId}/chats`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch chats: ${res.status}`);
        }
        return res.json();
      })
      .then(setChats)
      .catch((err) => {
        console.error("Failed to load chats:", err);
        setChats([]);
      });
  }, [selectedProjectId]);

  // Exposed manual reload function for parent components
  const refetchChats = useCallback(() => {
    if (selectedProjectId === null) return;

    fetch(`/api/v1/chat/projects/${selectedProjectId}/chats`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to refetch chats: ${res.status}`);
        }
        return res.json();
      })
      .then(setChats)
      .catch((err) => {
        console.error("Refetch failed:", err);
        setChats([]);
      });
  }, [selectedProjectId]);

  return {
    projects,
    chats,
    selectedProjectId,
    setSelectedProjectId,
    setChats,
    refetchChats,
  };
}
