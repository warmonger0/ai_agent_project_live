// frontend/src/components/planning/ChatPanel.tsx

import React, { useState } from "react";

const ChatPanel: React.FC = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>(
    []
  );

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const res = await fetch("/api/v1/planning/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    const agentMessage = { role: "agent", text: data.reply };

    setMessages((prev) => [...prev, agentMessage]);
    setInput("");
  };

  return (
    <div className="p-4 space-y-4 h-full flex flex-col">
      <div className="flex-1 overflow-y-auto bg-gray-50 border rounded p-2 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              msg.role === "user" ? "bg-blue-100" : "bg-green-100"
            }`}
          >
            <strong>{msg.role === "user" ? "You" : "Agent"}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Ask the agent..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
