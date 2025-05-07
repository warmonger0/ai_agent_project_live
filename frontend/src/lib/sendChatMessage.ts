export type ChatRequest = {
  messages: { role: string; content: string }[];
};

export async function sendChatMessage(
  request: ChatRequest,
  baseUrlOverride?: string
): Promise<any> {
  const baseUrl = baseUrlOverride ?? import.meta.env.VITE_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("VITE_API_BASE_URL is not defined");
  }

  const res = await fetch(`${baseUrl}/api/v1/planning/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    throw new Error("Network response was not ok");
  }

  try {
    return await res.json();
  } catch {
    throw new Error("Invalid JSON");
  }
}
