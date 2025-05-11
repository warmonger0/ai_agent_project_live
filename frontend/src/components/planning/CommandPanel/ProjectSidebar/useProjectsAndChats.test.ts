import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useProjectsAndChats } from "./useProjectsAndChats";

describe("useProjectsAndChats", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("fetches projects and chats when project is selected", async () => {
    global.fetch = vi
      .fn()
      // Mock project list
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve([{ id: 1, name: "Test Project" }]),
        })
      )
      // Mock chat list for selected project
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve([{ id: 100, title: "Alpha Chat A" }]),
        })
      );

    const { result } = renderHook(() => useProjectsAndChats());

    await waitFor(() => {
      expect(result.current.projects).toHaveLength(1);
      expect(result.current.projects[0].name).toBe("Test Project");
    });

    // Select project
    act(() => {
      result.current.setSelectedProjectId(1);
    });

    await waitFor(() => {
      expect(result.current.selectedProjectId).toBe(1);
      expect(result.current.chats).toHaveLength(1);
      expect(result.current.chats[0].title).toBe("Alpha Chat A");
    });
  });

  it("refetchChats manually reloads chat list", async () => {
    global.fetch = vi
      .fn()
      // Initial projects fetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve([{ id: 2, name: "Reloadable Project" }]),
        })
      )
      // First chat fetch (empty)
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve([]),
        })
      )
      // Refetched chat fetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve([{ id: 200, title: "Reloaded Chat" }]),
        })
      );

    const { result } = renderHook(() => useProjectsAndChats());

    // Select project to trigger chat load
    act(() => {
      result.current.setSelectedProjectId(2);
    });

    await waitFor(() => {
      expect(result.current.chats).toEqual([]);
    });

    // Manually trigger chat reload
    await act(async () => {
      await result.current.refetchChats();
    });

    expect(result.current.chats).toEqual([{ id: 200, title: "Reloaded Chat" }]);
  });
});
