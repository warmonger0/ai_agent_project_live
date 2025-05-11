// File: useProjectsAndChats.test.ts
import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useProjectsAndChats } from "./useProjectsAndChats";

describe("useProjectsAndChats", () => {
  it("initializes with empty projects and chats", () => {
    const { result } = renderHook(() => useProjectsAndChats());

    expect(result.current.projects).toEqual([]);
    expect(result.current.chats).toEqual([]);
    expect(result.current.selectedProjectId).toBeNull();
  });

  it("sets selected project ID and fetches chats", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        json: () => Promise.resolve([{ id: 1, name: "Test Project" }]),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve([{ id: 100, title: "Alpha Chat A" }]),
      });

    const { result, waitForNextUpdate } = renderHook(() =>
      useProjectsAndChats()
    );

    await result.current.setSelectedProjectId(1);
    expect(result.current.selectedProjectId).toBe(1);
    expect(result.current.chats).toEqual([{ id: 100, title: "Alpha Chat A" }]);
  });
});
