import { renderHook, act } from "@testing-library/react";
import axios from "axios";
import usePersistentChat from "./usePersistentChat";
import { vi } from "vitest";

// Partial mock of only the used methods
const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
};

// Mock axios
vi.mock("axios");

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

    expect(result.current.loading).toBe(true);

    // Wait for useEffect to finish
    await act(async () => {});

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `/api/v1/chat/chats/${mockChatId}/messages/`
    );
    expect(result.current.messages).toEqual(sampleMessages);
    expect(result.current.loading).toBe(false);
  });

  it("handles message sending", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { id: "3", role: "assistant", content: "Got it." },
    });

    const { result } = renderHook(() => usePersistentChat(mockChatId));

    // Wait for initial fetch
    await act(async () => {});

    act(() => {
      result.current.setInput("Hey");
    });

    await act(async () => {
      await result.current.handleSend();
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `/api/v1/chat/chats/${mockChatId}/messages/`,
      { content: "Hey" }
    );

    expect(result.current.messages).toContainEqual({
      role: "user",
      content: "Hey",
    });

    expect(result.current.messages).toContainEqual({
      id: "3",
      role: "assistant",
      content: "Got it.",
    });
  });

  it("gracefully handles API errors", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Fetch failed"));

    const { result } = renderHook(() => usePersistentChat(mockChatId));

    await act(async () => {});

    expect(result.current.error).toBe("Failed to load messages.");
  });

  it("ignores fetch when chatId is null", async () => {
    const { result } = renderHook(() => usePersistentChat(null));

    await act(async () => {});

    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(result.current.messages).toEqual([]);
  });
});
