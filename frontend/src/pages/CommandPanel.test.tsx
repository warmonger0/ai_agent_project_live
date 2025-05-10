import React from "react";
import { render, screen } from "@testing-library/react";
import { vi, beforeEach } from "vitest";
import CommandPanel from "./CommandPanel";

// Shared mock chatId value (can change between tests)
let testChatId: string | null = null;

// Mock ChatPanel to render dynamic value
vi.mock("../components/planning/CommandPanel/ChatPanel", () => ({
  default: () => <div data-testid="chat-panel">Chat ID: {testChatId}</div>,
}));

// Mock ProjectSidebar to trigger onSelectChat after mount
vi.mock("../components/planning/CommandPanel/ProjectSidebar", () => ({
  default: ({ onSelectChat }: { onSelectChat: (id: string) => void }) => {
    React.useEffect(() => {
      onSelectChat(testChatId ?? "null");
    }, []);
    return <div data-testid="project-sidebar">MockSidebar</div>;
  },
}));

beforeEach(() => {
  testChatId = null;
  vi.clearAllMocks();
});

describe("CommandPanel", () => {
  it("renders the layout with sidebar and initial null chat panel", () => {
    testChatId = null;
    render(<CommandPanel />);

    expect(screen.getByTestId("project-sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("chat-panel")).toHaveTextContent("Chat ID:");
  });

  it("updates the chatId prop when chat selection changes", () => {
    testChatId = "chat-123";
    render(<CommandPanel />);
    expect(screen.getByTestId("chat-panel")).toHaveTextContent("chat-123");
  });
});
