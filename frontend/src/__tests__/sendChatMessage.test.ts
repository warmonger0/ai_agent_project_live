import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendChatMessage } from "../lib/sendChatMessage";
import type { ChatRequest } from "../lib/sendChatMessage";

describe("sendChatMessage", () => {
  const mockResponse = { message: "Hello from AI" };

  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    ) as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should send a message and receive a response", async () => {
    const mockRequest: ChatRequest = {
      messages: [{ role: "user", content: "Test message" }],
    };

    const response = await sendChatMessage(mockRequest);
    expect(response).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/planning/chat`,
      expect.any(Object)
    );
  });
});
