import React, { useState } from "react";

interface Props {
  projectId: number | null;
  onChatCreated: () => void;
}

const CreateChatForm: React.FC<Props> = ({ projectId, onChatCreated }) => {
  const [newChatTitle, setNewChatTitle] = useState("");

  const handleCreateChat = async () => {
    if (!projectId || !newChatTitle.trim()) return;

    const res = await fetch("/api/v1/chat/chats/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newChatTitle.trim(),
        project_id: projectId,
      }),
    });

    if (res.ok) {
      setNewChatTitle("");
      onChatCreated();
    } else {
      console.error("Failed to create chat:", res.status);
    }
  };

  return (
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
  );
};

export default CreateChatForm;
