// File: frontend/src/components/planning/CommandPanel/ChatPanel/ChatPanel.tsx

import React, { useEffect, useRef } from "react";
import ChatInput from "./ChatPanel/ChatInput";
import { useChat } from "./ChatPanel/useChat";
import type { ChatMessage } from "./ChatPanel/types";

const ChatPanel: React.FC = () => {
  const { messages, input, setInput, loading, handleSend } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {messages.map((msg: ChatMessage, idx: number) => (
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
        {loading && (
          <div className="text-gray-500 italic self-start">Thinking...</div>
        )}
        {/* Anchor div for scrolling */}
        <div ref={scrollRef} />
      </div>

      {/* Chat input */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <ChatInput
          value={input}
          onChange={(val) => setInput(val)}
          onSend={handleSend}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default ChatPanel;
