import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendChatMessage } from "../sendChatMessage";

describe("sendChatMessage", () => {
  const originalEnv = import.meta.env;
  const mockResponse = { message: "Hello from AI" };

  beforeEach(() => {
    // Set up the environment variable
    import.meta.env = {
      ...originalEnv,
      VITE_API_BASE_URL: "http://localhost:8000",
    };

    // Mock the fetch function
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    ) as unknown as typeof fetch;
  });

  afterEach(() => {
    // Restore the original environment and fetch
    import.meta.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("should send a message and receive a response", async () => {
    const response = await sendChatMessage("Test message");
    expect(response).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      "http://192.168.50.142:8000/api/v1/planning/chat",
      expect.any(Object)
    );
  });
});
