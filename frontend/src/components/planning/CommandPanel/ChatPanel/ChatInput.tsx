import React from "react";

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  disabled = false,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="text"
        placeholder="Ask the agent something..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="flex-1 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled}
        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
};

export default ChatInput;
