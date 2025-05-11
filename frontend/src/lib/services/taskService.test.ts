// File: frontend/src/lib/services/taskService.test.ts

import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "./api";
import { fetchTasks, retryTask, createTask } from "./taskService";

vi.mock("./api");

describe("taskService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchTasks calls GET /api/v1/tasks and returns response", async () => {
    const mockResponse = { data: [{ task_id: 1, description: "Task A" }] };
    (api.get as any).mockResolvedValueOnce(mockResponse);

    const result = await fetchTasks();
    expect(api.get).toHaveBeenCalledWith("/api/v1/tasks");
    expect(result).toEqual(mockResponse);
  });

  it("retryTask calls POST /api/v1/retry/:id and returns data", async () => {
    const mockResponse = { data: { success: true } };
    (api.post as any).mockResolvedValueOnce(mockResponse);

    const result = await retryTask(42);
    expect(api.post).toHaveBeenCalledWith("/api/v1/retry/42");
    expect(result).toEqual(mockResponse.data);
  });

  it("createTask calls POST /api/v1/task and returns data", async () => {
    const mockResponse = { data: { task_id: 99 } };
    (api.post as any).mockResolvedValueOnce(mockResponse);

    const result = await createTask("Test task");
    expect(api.post).toHaveBeenCalledWith("/api/v1/task", {
      description: "Test task",
      model_used: "DeepSeek",
    });
    expect(result).toEqual(mockResponse.data);
  });
});
