import { useState, useEffect } from "react";
import axios from "axios";

function useChat(chatId: string) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!chatId) return;

    setLoading(true);
    axios
      .get(`/api/v1/chat/chats/${chatId}/messages/`)
      .then((response) => setMessages(response.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [chatId]);

  const sendMessage = (content: string) => {
    return axios
      .post(`/api/v1/chat/chats/${chatId}/messages/`, { content })
      .then((response) => {
        setMessages((prev) => [...prev, response.data]);
      });
  };

  return { messages, loading, error, sendMessage };
}

export default useChat;
