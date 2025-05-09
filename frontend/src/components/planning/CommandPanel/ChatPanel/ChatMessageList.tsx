// File: frontend/src/components/planning/CommandPanel/ChatPanel/ChatMessageList.tsx

import React, { useEffect, useRef } from "react";
import type { ChatMessage as ChatMessageType } from "./types";
import ChatMessage from "./ChatMessage";

interface ChatMessageListProps {
  messages: ChatMessageType[];
  loading: boolean;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  loading,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
      {messages.map((msg, idx) => (
        <ChatMessage key={idx} message={msg} />
      ))}
      {loading && (
        <div className="text-gray-500 italic self-start">Thinking...</div>
      )}
      <div ref={scrollRef} />
    </div>
  );
};

export default ChatMessageList;
