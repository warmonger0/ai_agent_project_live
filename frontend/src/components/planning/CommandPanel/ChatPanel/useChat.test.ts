import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useChat } from "./useChat";
import sendChatMessage from "./sendChatMessage";

// Mock the module
vi.mock("./sendChatMessage", () => ({
  default: vi.fn(),
}));

describe("useChat", () => {
  it("initializes with empty messages and loading false", () => {
    const { result } = renderHook(() => useChat());
    expect(result.current.messages).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it("sends user message and receives assistant reply", async () => {
    const mockFn = sendChatMessage as unknown as ReturnType<typeof vi.fn>;
    mockFn.mockImplementationOnce(async (_payload, _baseUrl, onStreamChunk) => {
      if (onStreamChunk) onStreamChunk("Hello back!");
    });

    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.setInput("Hi");
    });

    await act(async () => {
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
    const mockFn = sendChatMessage as unknown as ReturnType<typeof vi.fn>;
    mockFn.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.setInput("test");
    });

    await act(async () => {
      await result.current.handleSend();
    });

    expect(result.current.error).toBe("Network error");
    expect(result.current.loading).toBe(false);
  });
});
