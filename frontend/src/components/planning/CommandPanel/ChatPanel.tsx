import React, { useEffect, useRef } from "react";
import ChatInput, { ChatInputRef } from "./ChatPanel/ChatInput";
import ChatMessageList from "./ChatPanel/ChatMessageList";
import usePersistentChat from "@/hooks/usePersistentChat";

interface ChatPanelProps {
  chatId: string | null;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ chatId }) => {
  const {
    messages,
    input,
    setInput,
    loading,
    error,
    handleSend,
    clearMessages,
  } = usePersistentChat(chatId);

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

      {/* Optional error display */}
      {error && (
        <div className="px-4 py-2 text-sm text-red-600 bg-red-100">{error}</div>
      )}

      {/* Message list */}
      <ChatMessageList messages={messages} loading={loading} />

      {/* Input box */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <ChatInput
          ref={inputRef}
          value={input}
          onChange={setInput}
          onSend={handleSend}
          disabled={loading || !chatId}
        />
      </div>
    </div>
  );
};

export default ChatPanel;
