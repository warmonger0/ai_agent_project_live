const apiUrl =
  import.meta.env.VITE_API_BASE_URL || "http://http://192.168.50.142:8000";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
}

export interface ChatResponse {
  choices: { message: ChatMessage }[];
}

export async function sendChatMessage(
  payload: ChatRequest
): Promise<ChatResponse> {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  if (!API_BASE_URL) {
    throw new Error(
      "VITE_API_BASE_URL is not defined in the environment variables."
    );
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/planning/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Chat request failed: ${response.status} - ${error}`);
  }

  return await response.json();
}
