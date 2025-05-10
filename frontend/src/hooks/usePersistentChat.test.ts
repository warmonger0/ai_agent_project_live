import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import axios from "axios";
import usePersistentChat from "./usePersistentChat";

// Mock axios
vi.mock("axios");

// Manually define mocks for get/post
const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
};

mockedAxios.get = vi.fn();
mockedAxios.post = vi.fn();

describe("usePersistentChat", () => {
  const mockChatId = "abc123";

  const sampleMessages = [
    { id: "1", role: "user", content: "Hello" },
    { id: "2", role: "assistant", content: "Hi there!" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches messages on mount when chatId is provided", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: sampleMessages });

    const { result } = renderHook(() => usePersistentChat(mockChatId));

    // Wait for fetch to resolve
    await act(async () => {});

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `/api/v1/chat/chats/${mockChatId}/messages/`
    );

    expect(result.current.messages).toEqual(sampleMessages);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("handles message sending", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { id: "3", role: "assistant", content: "Got it." },
    });

    const { result } = renderHook(() => usePersistentChat(mockChatId));

    // Wait for initial fetch
    await act(async () => {});

    // Simulate input
    act(() => {
      result.current.setInput("Hey");
    });

    // Submit message
    await act(async () => {
      await result.current.handleSend();
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `/api/v1/chat/chats/${mockChatId}/messages/`,
      { content: "Hey" }
    );

    const sentMessages = result.current.messages;

    expect(sentMessages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ role: "user", content: "Hey" }),
        expect.objectContaining({ role: "assistant", content: "Got it." }),
      ])
    );
  });

  it("gracefully handles API errors during fetch", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Fetch failed"));

    const { result } = renderHook(() => usePersistentChat(mockChatId));

    await act(async () => {});

    expect(result.current.error).toBe("Failed to load messages.");
    expect(result.current.loading).toBe(false);
    expect(result.current.messages).toEqual([]);
  });

  it("ignores fetch when chatId is null", async () => {
    const { result } = renderHook(() => usePersistentChat(null));

    await act(async () => {});

    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(result.current.messages).toEqual([]);
    expect(result.current.error).toBeNull();
  });
});
