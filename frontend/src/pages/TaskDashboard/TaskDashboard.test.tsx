/// <reference types="vitest" />
import { render, screen } from "@testing-library/react";
import TaskDashboard from "@/pages/TaskDashboard";

// ✅ Mock children to isolate the TaskDashboard layout
vi.mock("../components/TaskTable", () => ({
  default: () => <div data-testid="TaskTable">🧪 TaskTable</div>,
}));
vi.mock("../components/PluginPanel", () => ({
  default: () => <div data-testid="PluginPanel">🧪 PluginPanel</div>,
}));
vi.mock("../components/PluginHistory", () => ({
  default: () => <div data-testid="PluginHistory">🧪 PluginHistory</div>,
}));

describe("TaskDashboard", () => {
  it("renders dashboard layout and mounts sections", () => {
    render(<TaskDashboard />);

    expect(screen.getByText("Task Dashboard")).toBeInTheDocument();
    expect(screen.getByTestId("TaskTable")).toBeInTheDocument();
    expect(screen.getByTestId("PluginPanel")).toBeInTheDocument();
    expect(screen.getByTestId("PluginHistory")).toBeInTheDocument();
  });
});
