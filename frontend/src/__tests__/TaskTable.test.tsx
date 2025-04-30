/// <reference types="vitest" />
import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import * as taskService from "../lib/services/taskService";
import TaskTable from "../components/TaskTable";

vi.mock("../lib/services/taskService");

const mockedFetchTasks = taskService.fetchTasks as unknown as ReturnType<typeof vi.fn>;

describe("TaskTable", () => {
  beforeEach(() => {
    mockedFetchTasks.mockReset();
  });

  it("shows loading and then task list", async () => {
    mockedFetchTasks.mockResolvedValueOnce({
      data: [
        { task_id: 1, description: "Mock Task A", status: "error" },
        { task_id: 2, description: "Mock Task B", status: "success" },
      ],
    });

    render(<TaskTable />);

    // Loading state
    expect(screen.getByText("Loading tasks...")).toBeInTheDocument();

    // Wait for tasks
    await waitFor(() => {
      expect(screen.getByText("Mock Task A")).toBeInTheDocument();
      expect(screen.getByText("Mock Task B")).toBeInTheDocument();
    });
  });

  it("renders fallback on error", async () => {
    mockedFetchTasks.mockRejectedValueOnce(new Error("Fetch error"));

    render(<TaskTable />);

    // Loading state
    expect(screen.getByText("Loading tasks...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Mock Task A")).not.toBeInTheDocument();
    });
  });
});
