import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProjectSidebar from "./ProjectSidebar";

// Mock the useProjects hook
vi.mock("@/hooks/useProjects", () => ({
  default: () => ({
    projects: [
      {
        id: 1,
        title: "Project Alpha",
        chats: [
          { id: "chat-1", title: "Alpha Chat 1" },
          { id: "chat-2", title: "Alpha Chat 2" },
        ],
      },
      {
        id: 2,
        title: "Project Beta",
        chats: [{ id: "chat-3", title: "Beta Chat 1" }],
      },
    ],
    isLoading: false,
    error: null,
  }),
}));

describe("ProjectSidebar", () => {
  it("renders list of projects and chats", () => {
    render(
      <ProjectSidebar
        selectedChatId={null}
        onSelectChat={() => {}}
        onSelectProject={() => {}}
      />
    );

    // Simulate selecting "Project Alpha"
    const select = screen.getByLabelText("Select Project");
    fireEvent.change(select, { target: { value: "1" } });

    // Verify that chats for "Project Alpha" are displayed
    expect(screen.getByText("Alpha Chat 1")).toBeInTheDocument();
    expect(screen.getByText("Alpha Chat 2")).toBeInTheDocument();
  });

  it("calls onSelectChat when a chat is clicked", () => {
    const onSelectChat = vi.fn();

    render(
      <ProjectSidebar
        selectedChatId={null}
        onSelectChat={onSelectChat}
        onSelectProject={() => {}}
      />
    );

    // Simulate selecting "Project Alpha"
    const select = screen.getByLabelText("Select Project");
    fireEvent.change(select, { target: { value: "1" } });

    // Simulate clicking on "Alpha Chat 2"
    const chatItem = screen.getByText("Alpha Chat 2");
    fireEvent.click(chatItem);

    expect(onSelectChat).toHaveBeenCalledWith("chat-2");
  });

  it("calls onSelectProject when a project is selected", () => {
    const onSelectProject = vi.fn();

    render(
      <ProjectSidebar
        selectedChatId={null}
        onSelectChat={() => {}}
        onSelectProject={onSelectProject}
      />
    );

    // Simulate selecting "Project Beta"
    const select = screen.getByLabelText("Select Project");
    fireEvent.change(select, { target: { value: "2" } });

    expect(onSelectProject).toHaveBeenCalledWith(2);
  });
});
