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

  // Custom renderer for inline and block code
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
        return <code className="bg-gray-100 px-1 rounded">{codeContent}</code>;
      }

      return (
        <div className="relative group">
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
          <pre className="overflow-x-auto">
            <code>{codeContent}</code>
          </pre>
        </div>
      );
    },
  };

  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative p-3 rounded-md w-full whitespace-pre-wrap prose prose-sm max-w-[90%] ${
          isUser ? "bg-blue-100 text-right" : "bg-gray-100 text-left"
        }`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={components}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ChatMessage;
