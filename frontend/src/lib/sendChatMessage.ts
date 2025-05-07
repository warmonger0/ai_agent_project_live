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
  payload: ChatRequest,
  baseUrlOverride?: string
): Promise<ChatResponse> {
  const API_BASE_URL = baseUrlOverride ?? import.meta.env.VITE_API_BASE_URL;

  if (!API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not defined");
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

  try {
    return await response.json();
  } catch {
    throw new Error("Invalid JSON");
  }
}
