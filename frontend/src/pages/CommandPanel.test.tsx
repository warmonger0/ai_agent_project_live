import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import CommandPanel from "./CommandPanel";

// Mock the ProjectSidebar and ChatPanel subcomponents
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

    // Sidebar and ChatPanel should render with initial state
    expect(screen.getByTestId("project-sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("chat-panel")).toHaveTextContent("Chat ID: null");
  });

  it("updates the chatId prop when chat selection changes", async () => {
    // Mock ProjectSidebar to emit onSelectChat
    const mockSetChat = vi.fn();
    const mockSetProject = vi.fn();

    vi.doMock(
      "../components/planning/CommandPanel/ProjectSidebar",
      () => ({
        default: ({ onSelectProject, onSelectChat }: any) => {
          // Call onSelectChat directly
          onSelectChat("chat-123");
          return <div data-testid="project-sidebar" />;
        },
      }),
      { virtual: true }
    );

    // Re-import to apply updated mock
    const { default: UpdatedCommandPanel } = await import("./CommandPanel");

    render(<UpdatedCommandPanel />);
    expect(screen.getByTestId("chat-panel")).toHaveTextContent("chat-123");
  });
});
