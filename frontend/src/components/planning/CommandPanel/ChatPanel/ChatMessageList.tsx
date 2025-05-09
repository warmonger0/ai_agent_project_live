import React from "react";
import type { ChatMessage as ChatMessageType } from "./types";
import ChatMessage from "./ChatMessage";

interface ChatMessageListProps {
  messages: ChatMessageType[];
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
      {messages.map((msg, idx) => (
        <ChatMessage key={idx} message={msg} />
      ))}
    </div>
  );
};

export default ChatMessageList;
