// /frontend/src/lib/sendChatMessage.ts

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatCompletionChoice {
  message: ChatMessage;
}

export interface ChatResponse {
  choices: ChatCompletionChoice[];
}

export interface ChatRequest {
  messages: ChatMessage[];
}

export async function sendChatMessage(
  payload: ChatRequest
): Promise<ChatResponse> {
  const response = await fetch("http://localhost:8000/api/v1/planning/chat", {
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

  const data = (await response.json()) as ChatResponse;
  return data;
}
