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

  const handleEdit = (code: string) => {
    console.log("📝 Edit clicked:", code);
  };

  const components = {
    code({
      inline,
      children,
    }: {
      inline?: boolean;
      children: string | string[];
    }) {
      const codeContent = Array.isArray(children)
        ? children.join("")
        : children;

      if (inline) {
        return (
          <code className="bg-gray-200 px-1 py-0.5 rounded text-sm font-mono">
            {codeContent}
          </code>
        );
      }

      return (
        <div className="relative group">
          {/* Floating actions */}
          <div className="absolute top-1 right-2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition space-x-2 z-10">
            <button
              onClick={() => navigator.clipboard.writeText(codeContent)}
              className="hover:underline"
            >
              Copy
            </button>
            <button
              onClick={() => handleEdit(codeContent)}
              className="hover:underline"
            >
              Edit
            </button>
          </div>
          <pre className="bg-gray-800 text-white rounded-md p-4 overflow-x-auto text-sm max-w-full">
            <code>{codeContent}</code>
          </pre>
        </div>
      );
    },
  };

  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative p-3 rounded-md w-full whitespace-pre-wrap bg-opacity-90 ${
          isUser ? "bg-blue-100 text-right" : "bg-gray-100 text-left"
        }`}
      >
        <div className="prose prose-sm max-w-full break-words">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={components}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
