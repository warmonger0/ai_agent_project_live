// /frontend/src/lib/sendChatMessage.ts

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
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/planning/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Chat request failed: ${response.status} - ${error}`);
  }

  return await response.json();
}
