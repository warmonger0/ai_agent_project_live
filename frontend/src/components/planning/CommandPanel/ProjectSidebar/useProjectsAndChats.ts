import { useEffect, useState } from "react";

export function useProjectsAndChats() {
  const [projects, setProjects] = useState<{ id: number; name: string }[]>([]);
  const [chats, setChats] = useState<{ id: number; title: string }[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );

  useEffect(() => {
    fetch("/api/v1/chat/projects")
      .then((res) => res.json())
      .then(setProjects)
      .catch((err) => console.error("Failed to load projects:", err));
  }, []);

  useEffect(() => {
    setChats([]);
    if (selectedProjectId === null) return;
    fetch(`/api/v1/chat/projects/${selectedProjectId}/chats`)
      .then((res) => res.json())
      .then(setChats)
      .catch((err) => {
        console.error("Failed to load chats:", err);
        setChats([]);
      });
  }, [selectedProjectId]);

  return { projects, chats, setChats, selectedProjectId, setSelectedProjectId };
}
