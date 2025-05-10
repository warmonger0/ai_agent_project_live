import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import CommandPanel from "./CommandPanel";

// Static mocks for layout-only render test
vi.mock("../components/planning/CommandPanel/ProjectSidebar", () => ({
  default: () => <div data-testid="project-sidebar">MockSidebar</div>,
}));

vi.mock("../components/planning/CommandPanel/ChatPanel", () => ({
  default: ({ chatId }: { chatId: string | null }) => (
    <div data-testid="chat-panel">Chat ID: {chatId}</div>
  ),
}));

describe("CommandPanel", () => {
  it("renders the layout with sidebar and chat panel", () => {
    render(<CommandPanel />);
    expect(screen.getByTestId("project-sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("chat-panel")).toHaveTextContent("Chat ID: null");
  });

  it("updates the chatId prop when chat selection changes", async () => {
    // Dynamic mock: overrides ProjectSidebar to trigger selection
    vi.doMock("../components/planning/CommandPanel/ProjectSidebar", () => ({
      default: ({ onSelectChat }: any) => {
        onSelectChat("chat-123");
        return <div data-testid="project-sidebar" />;
      },
    }));

    // Reload CommandPanel with updated mock
    const { default: UpdatedCommandPanel } = await import("./CommandPanel");

    render(<UpdatedCommandPanel />);
    expect(screen.getByTestId("chat-panel")).toHaveTextContent("chat-123");
  });
});
