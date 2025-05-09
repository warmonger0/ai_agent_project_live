import { useEffect, useState } from "react";
import { sendChatMessage } from "./sendChatMessage";
import type { ChatMessage } from "./types";

const STORAGE_KEY = "chatMessages";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setMessages(parsed);
      } catch {
        console.warn("Invalid chat history in localStorage");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [
      ...prev,
      userMessage,
      { role: "assistant", content: "" },
    ]);
    setInput("");
    setLoading(true);

    try {
      console.log("👋 Sending chat request with stream: true");
      await sendChatMessage(
        { messages: [...messages, userMessage], stream: true },
        undefined,
        (chunk) => {
          console.log("📥 Received chunk:", chunk);
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];

            if (last.role === "assistant") {
              updated[updated.length - 1] = {
                ...last,
                content: last.content + chunk,
              };
            }

            return updated;
          });
        }
      );
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Error: Could not get a response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    input,
    setInput,
    loading,
    handleSend,
  };
}
