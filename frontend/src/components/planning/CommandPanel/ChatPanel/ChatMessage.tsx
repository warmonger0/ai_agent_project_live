import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import type { ChatMessage as ChatMessageType } from "./types";
import CopyButton from "./CopyButton";

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";

  const handleEdit = (code: string) => {
    console.log("📝 Edit clicked:", code);
  };

  const extractText = (node: React.ReactNode): string => {
    if (typeof node === "string") return node;
    if (Array.isArray(node)) return node.map(extractText).join("");
    if (React.isValidElement(node)) {
      const el = node as React.ReactElement<{ children?: React.ReactNode }>;
      if (el.props.children) return extractText(el.props.children);
    }
    return "";
  };

  const components = {
    code({
      inline,
      children,
    }: {
      inline?: boolean;
      children: React.ReactNode;
    }) {
      const codeContent = extractText(children);

      if (inline) {
        return (
          <code className="bg-gray-200 px-1 py-0.5 rounded text-sm font-mono break-words">
            {codeContent}
          </code>
        );
      }

      return (
        <>
          <div className="relative group my-2 not-prose">
            <div className="absolute top-1 right-2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition space-x-2 z-10">
              <CopyButton text={codeContent} />
              <button
                onClick={() => handleEdit(codeContent)}
                className="hover:underline"
              >
                Edit
              </button>
            </div>
            <pre className="bg-gray-800 text-white rounded-md p-4 text-sm break-words whitespace-pre-wrap overflow-auto max-w-full">
              <code>{codeContent}</code>
            </pre>
          </div>
        </>
      );
    },
  };

  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative p-3 rounded-md w-full bg-opacity-90 overflow-hidden ${
          isUser ? "bg-blue-100 text-right" : "bg-gray-100 text-left"
        }`}
      >
        <ReactMarkdown
          className="prose prose-sm max-w-full break-words whitespace-pre-wrap"
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
