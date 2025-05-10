import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useChat } from "./useChat"; // ✅ correct

import sendChatMessage from "./sendChatMessage"; // ✅ default import

vi.mock("./sendChatMessage"); // ✅ mock default export directly

beforeEach(() => {
  // Clear mocks before each test
  vi.clearAllMocks();
});

describe("useChat", () => {
  it("initializes with empty messages and loading false", () => {
    const { result } = renderHook(() => useChat());
    expect(result.current.messages).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it("sends user message and receives assistant reply", async () => {
    const mockResponse = {
      choices: [{ message: { role: "assistant", content: "Hello back!" } }],
    };

    (
      sendChatMessage as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useChat());

    await act(async () => {
      result.current.setInput("Hi");
      await result.current.handleSend();
    });

    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[0]).toEqual({ role: "user", content: "Hi" });
    expect(result.current.messages[1]).toEqual({
      role: "assistant",
      content: "Hello back!",
    });
  });

  it("sets error message on failed request", async () => {
    (
      sendChatMessage as unknown as ReturnType<typeof vi.fn>
    ).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useChat());

    await act(async () => {
      result.current.setInput("test");
      await result.current.handleSend();
    });

    expect(result.current.error).toBe("❌ Error: Could not get a response.");
    expect(result.current.loading).toBe(false);
  });
});
