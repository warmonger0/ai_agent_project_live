import React from "react";
import type { ChatMessage } from "./types";

interface ChatMessageListProps {
  messages: ChatMessage[];
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`p-3 rounded-md max-w-xl whitespace-pre-wrap ${
            msg.role === "user"
              ? "bg-blue-100 self-end text-right"
              : "bg-gray-100 self-start text-left"
          }`}
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
};

export default ChatMessageList;
