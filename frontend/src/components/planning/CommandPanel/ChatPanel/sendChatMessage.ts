export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  stream?: boolean;
}

export interface ChatResponse {
  choices: { message: ChatMessage }[];
}

export async function sendChatMessage(
  payload: ChatRequest,
  baseUrlOverride?: string,
  onStreamChunk?: (chunk: string) => void
): Promise<ChatResponse> {
  const API_BASE_URL = baseUrlOverride ?? import.meta.env.VITE_API_BASE_URL;

  if (!API_BASE_URL || API_BASE_URL === "__MISSING__") {
    throw new Error("VITE_API_BASE_URL is not defined");
  }

  const isStreaming = payload.stream === true;

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

  // Non-streamed mode
  if (!isStreaming) {
    try {
      return await response.json();
    } catch {
      throw new Error("Invalid JSON");
    }
  }

  // Streamed mode
  const reader = response.body?.getReader();
  const decoder = new TextDecoder("utf-8");
  let fullText = "";

  if (!reader) {
    throw new Error("Stream reader not available");
  }

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const raw = decoder.decode(value, { stream: true });

    for (const line of raw.split("\n")) {
      if (line.startsWith("data:")) {
        try {
          const json = JSON.parse(line.slice(5).trim());
          const chunk = json.message?.content ?? "";
          fullText += chunk;
          onStreamChunk?.(chunk);
        } catch {
          // Ignore malformed lines
        }
      }
    }
  }

  return {
    choices: [{ message: { role: "assistant", content: fullText } }],
  };
}
