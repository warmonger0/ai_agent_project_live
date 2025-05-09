import React, { useEffect, useRef } from "react";
import ChatInput, { ChatInputRef } from "./ChatPanel/ChatInput";
import ChatMessageList from "./ChatPanel/ChatMessageList";
import { useChat } from "./ChatPanel/useChat";

const ChatPanel: React.FC = () => {
  const { messages, input, setInput, loading, handleSend, clearMessages } =
    useChat();

  const inputRef = useRef<ChatInputRef>(null);

  // Focus input after message completes
  useEffect(() => {
    if (!loading) inputRef.current?.focusInput();
  }, [loading]);

  return (
    <div className="flex flex-col h-full">
      {/* Header with Clear button */}
      <div className="flex justify-between items-center px-4 py-2 bg-gray-100 border-b">
        <h2 className="text-lg font-semibold">Agent Chat</h2>
        <button
          onClick={clearMessages}
          className="text-sm text-red-500 hover:underline"
          disabled={loading}
        >
          Clear
        </button>
      </div>

      {/* Message list */}
      <ChatMessageList messages={messages} loading={loading} />

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
