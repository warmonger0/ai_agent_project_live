// File: frontend/src/components/planning/CommandPanel/ChatPanel/ChatPanel.tsx

import React, { useEffect, useRef } from "react";
import ChatInput, { ChatInputRef } from "./ChatPanel/ChatInput";
import { useChat } from "./ChatPanel/useChat";
import type { ChatMessage } from "./ChatPanel/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatPanel: React.FC = () => {
  const { messages, input, setInput, loading, handleSend } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<ChatInputRef>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Refocus input on message complete
  useEffect(() => {
    if (!loading) inputRef.current?.focusInput();
  }, [loading]);

  return (
    <div className="flex flex-col h-full">
      {/* Message list */}
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
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className="prose prose-sm max-w-none"
            >
              {msg.content}
            </ReactMarkdown>
          </div>
        ))}
        {loading && (
          <div className="text-gray-500 italic self-start">Thinking...</div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input box */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <ChatInput
          ref={inputRef}
          value={input}
          onChange={setInput}
          onSend={handleSend}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default ChatPanel;
