// File: CreateChatForm.tsx
import React, { useState } from "react";

interface Props {
  onCreate: (title: string) => void;
}

const CreateChatForm: React.FC<Props> = ({ onCreate }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    if (title.trim()) {
      onCreate(title);
      setTitle("");
    }
  };

  return (
    <div className="flex items-center mt-2">
      <input
        placeholder="New chat name"
        className="flex-grow border p-1 rounded mr-2 text-sm"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        aria-label="Add Chat"
        className="px-2 py-1 rounded bg-blue-500 text-white"
      >
        +
      </button>
    </div>
  );
};

export default CreateChatForm;
