// File: CreateChatForm.tsx
import React, { useState } from "react";

// ✅ Export Props for typing in test files
export interface CreateChatFormProps {
  projectId: number | null;
  onChatCreated: () => void;
}

const CreateChatForm: React.FC<CreateChatFormProps> = ({
  projectId,
  onChatCreated,
}) => {
  const [newChatTitle, setNewChatTitle] = useState("");

  const handleCreateChat = async () => {
    const trimmedTitle = newChatTitle.trim();
    if (!projectId || !trimmedTitle) return;

    try {
      const res = await fetch("/api/v1/chat/chats/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedTitle,
          project_id: projectId,
        }),
      });

      if (res.ok) {
        setNewChatTitle("");
        onChatCreated();
      } else {
        console.error("❌ Failed to create chat:", res.status);
      }
    } catch (err) {
      console.error("❌ Network error while creating chat:", err);
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
