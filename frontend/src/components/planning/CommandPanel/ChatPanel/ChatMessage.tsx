import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import type { ChatMessage as ChatMessageType } from "./types";

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";

  const handleEdit = () => {
    console.log("📝 Edit clicked:", message.content);
  };

  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative p-3 rounded-md w-full whitespace-pre-wrap prose prose-sm max-w-none ${
          isUser ? "bg-blue-100 text-right" : "bg-gray-100 text-left"
        }`}
      >
        {/* Actions: Only for assistant */}
        {!isUser && (
          <div className="absolute top-2 right-3 text-sm text-gray-400 space-x-2">
            <button
              onClick={() => navigator.clipboard.writeText(message.content)}
              className="hover:underline"
            >
              Copy
            </button>
            <button onClick={handleEdit} className="hover:underline">
              Edit
            </button>
          </div>
        )}

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ChatMessage;
