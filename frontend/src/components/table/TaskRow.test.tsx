/// <reference types="vitest" />
import { render, screen } from "@testing-library/react";
import TaskRow from "@/components/table/TaskRow";

// ✅ Updated to match real file path: `status-badge.tsx`
vi.mock("../components/ui/status-badge", () => ({
  default: ({ status }: { status: string }) => (
    <span data-testid="status-badge">Status: {status}</span>
  ),
}));

describe("TaskRow", () => {
  it("renders task details with badge", () => {
    render(
      <table>
        <tbody>
          <TaskRow task_id={42} description="Test deployment" status="error" />
        </tbody>
      </table>
    );

    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("Test deployment")).toBeInTheDocument();
    screen.getByRole("status")).toHaveTextContent(
      "Status: error"
    );
  });
});
