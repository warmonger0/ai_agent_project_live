// File: useProjectsAndChats.test.ts
import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useProjectsAndChats } from "./useProjectsAndChats";

describe("useProjectsAndChats", () => {
  beforeEach(() => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        json: () => Promise.resolve([{ id: 1, name: "Test Project" }]),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve([{ id: 100, title: "Alpha Chat A" }]),
      });
  });

  it("fetches projects and chats when project is selected", async () => {
    const { result } = renderHook(() => useProjectsAndChats());

    // Simulate project selection
    act(() => {
      result.current.setSelectedProjectId(1);
    });

    await waitFor(() => {
      expect(result.current.selectedProjectId).toBe(1);
      expect(result.current.chats.length).toBeGreaterThan(0);
    });
  });
});
