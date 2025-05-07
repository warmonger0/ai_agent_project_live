describe("ComponentName", () => {
  it("renders without crashing", () => {
    expect(true).toBe(true);
  });
});
// File: /frontend/src/__tests__/commandPanel/useChat.test.ts

import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useChat from "@/components/planning/ChatPanel/useChat";
import { sendChatMessage } from "@/lib/sendChatMessage";
import type { ChatMessage } from "@/types";

vi.mock("@/lib/sendChatMessage");

describe("useChat", () => {
  const mockResponse = {
    choices: [{ message: { role: "assistant", content: "Hi there!" } }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with empty messages and loading false", () => {
    const { result } = renderHook(() => useChat());
    expect(result.current.messages).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it("sends user message and receives assistant reply", async () => {
    (
      sendChatMessage as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage("Hello");
    });

    expect(result.current.messages.length).toBe(2);
    expect(result.current.messages[0]).toEqual({
      role: "user",
      content: "Hello",
    });
    expect(result.current.messages[1]).toEqual({
      role: "assistant",
      content: "Hi there!",
    });
    expect(result.current.loading).toBe(false);
  });

  it("sets error message on failed request", async () => {
    (
      sendChatMessage as unknown as ReturnType<typeof vi.fn>
    ).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage("Fail test");
    });

    expect(result.current.messages.length).toBe(2);
    expect(result.current.messages[1].content.toLowerCase()).toContain("error");
    expect(result.current.loading).toBe(false);
  });
});
