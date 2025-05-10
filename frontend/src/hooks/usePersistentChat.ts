import { useEffect, useState } from "react";
import axios from "axios";

export interface ChatMessage {
  id?: string;
  content: string;
  role: "user" | "assistant";
  timestamp?: string;
}

function usePersistentChat(chatId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch chat messages on chatId change
  useEffect(() => {
    if (!chatId) return;

    setLoading(true);
    axios
      .get(`/api/v1/chat/chats/${chatId}/messages/`)
      .then((res) => setMessages(res.data))
      .catch((err) => {
        console.error("Failed to fetch messages:", err);
        setError("Failed to load messages.");
      })
      .finally(() => setLoading(false));
  }, [chatId]);

  // Send a new message to the backend
  const handleSend = async () => {
    if (!input.trim() || !chatId) return;
    const userMsg: ChatMessage = { role: "user", content: input };

    setLoading(true);
    setInput("");
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await axios.post(`/api/v1/chat/chats/${chatId}/messages/`, {
        content: input,
      });
      setMessages((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Send error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Error sending message." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Clear history (for UI only – doesn't hit backend)
  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    input,
    setInput,
    loading,
    error,
    handleSend,
    clearMessages,
  };
}

export default usePersistentChat;
