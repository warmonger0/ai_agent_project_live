import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import useChat from "./useChat"; // ✅ same folder
import type { ChatRequest, ChatResponse } from "./sendChatMessage";
import sendChatMessage from "./sendChatMessage"; // ✅ default import from same folder

vi.mock("./sendChatMessage", () => ({
  default: vi.fn(),
}));

describe("useChat", () => {
  it("initializes with empty messages and loading false", () => {
    const { result } = renderHook(() => useChat("1"));

    expect(result.current.messages).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it("sends user message and receives assistant reply", async () => {
    const mockResponse: ChatResponse = {
      choices: [{ message: { role: "assistant", content: "Hello back!" } }],
    };

    const mockFn = sendChatMessage as ReturnType<typeof vi.fn>;
    mockFn.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useChat("2"));

    await act(async () => {
      await result.current.handleSend("Hi");
    });

    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[0]).toEqual({ role: "user", content: "Hi" });
    expect(result.current.messages[1]).toEqual({
      role: "assistant",
      content: "Hello back!",
    });
  });

  it("sets error message on failed request", async () => {
    const mockFn = sendChatMessage as ReturnType<typeof vi.fn>;
    mockFn.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useChat("3"));

    await act(async () => {
      await result.current.handleSend("test");
    });

    expect(result.current.error).toBe("Network error");
    expect(result.current.loading).toBe(false);
  });
});
