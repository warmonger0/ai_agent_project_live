import sendChatMessage from "../lib/sendChatMessage"; // ✅ default import
import type { ChatRequest } from "../lib/sendChatMessage";

// ✅ MOCK FETCH CLEANUP
beforeEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

it("should throw an error if the response is not ok", async () => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: false,
      status: 500,
      text: () => Promise.resolve("Internal Server Error"),
    })
  ) as unknown as typeof fetch;

  const mockRequest: ChatRequest = {
    messages: [{ role: "user", content: "Trigger failure" }],
  };

  await expect(sendChatMessage(mockRequest, "http://fake-url")).rejects.toThrow(
    "Chat request failed: 500 - Internal Server Error"
  );
});

it("should throw if VITE_API_BASE_URL is undefined", async () => {
  const mockRequest: ChatRequest = {
    messages: [{ role: "user", content: "Missing env" }],
  };

  const spy = vi.spyOn(global, "fetch");

  await expect(sendChatMessage(mockRequest, "__MISSING__")).rejects.toThrow(
    "VITE_API_BASE_URL is not defined"
  );

  expect(spy).not.toHaveBeenCalled();
});

it("should throw if response is not valid JSON", async () => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.reject(new Error("Invalid JSON")),
    })
  ) as unknown as typeof fetch;

  const mockRequest: ChatRequest = {
    messages: [{ role: "user", content: "Invalid JSON" }],
  };

  await expect(sendChatMessage(mockRequest, "http://fake-url")).rejects.toThrow(
    "Invalid JSON"
  );
});
