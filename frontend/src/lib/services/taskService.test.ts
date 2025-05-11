/// <reference types="vitest" />
import { describe, it, expect, vi } from "vitest";
import api from "./api";
import { fetchTasks, retryTask, createTask } from "./taskService";

vi.mock("../api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("taskService", () => {
  it("fetchTasks calls /api/v1/tasks", async () => {
    (api.get as any).mockResolvedValue({ data: ["mock task"] });
    const res = await fetchTasks();
    expect(api.get).toHaveBeenCalledWith("/api/v1/tasks");
    expect(res.data).toEqual(["mock task"]);
  });

  it("retryTask calls /api/v1/retry/:id", async () => {
    (api.post as any).mockResolvedValue({ data: "retry-ok" });
    const result = await retryTask(1);
    expect(api.post).toHaveBeenCalledWith("/api/v1/retry/1");
    expect(result).toEqual("retry-ok");
  });

  it("createTask posts task with model", async () => {
    const mockResp = { data: { task_id: 123 } };
    (api.post as any).mockResolvedValue(mockResp);
    const result = await createTask("Test task", "Claude");
    expect(api.post).toHaveBeenCalledWith("/api/v1/task", {
      description: "Test task",
      model_used: "Claude",
    });
    expect(result).toEqual({ task_id: 123 });
  });
});
