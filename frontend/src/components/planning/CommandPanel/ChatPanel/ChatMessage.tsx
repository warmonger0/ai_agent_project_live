import React from "react";
import type { ChatMessage as ChatMessageType } from "./types";

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`p-3 rounded-md max-w-xl whitespace-pre-wrap ${
        isUser
          ? "bg-blue-100 self-end text-right"
          : "bg-gray-100 self-start text-left"
      }`}
    >
      {message.content}
    </div>
  );
};

export default ChatMessage;
