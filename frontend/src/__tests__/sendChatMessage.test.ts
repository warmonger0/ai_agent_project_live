import { sendChatMessage } from "../lib/sendChatMessage";
import type { ChatRequest } from "../lib/sendChatMessage";

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

  // Simulate undefined config — and stub fetch to prove it's not called
  const spy = vi.spyOn(global, "fetch");

  await expect(sendChatMessage(mockRequest, null)).rejects.toThrow(
    "VITE_API_BASE_URL is not defined"
  );

  // Ensure fetch was NOT called
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
